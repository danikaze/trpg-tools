import { Connection, ResultSetHeader } from 'mysql2/promise';
import { NsLogger } from './logger';

export type SqlParams = {
  [key: string]: string | number | null;
};

export interface MySqlOptions {
  /** If provided, it will log some */
  logger?: NsLogger;
}

export type DbInitFunction = (db: MySql) => Promise<void>;

export type TransactionWork<T> = (transaction: {
  db: MySql;
  rollback: () => void;
}) => Promise<T | undefined>;

export interface TransactionOptions {
  throw?: boolean;
  errHandler?: (e: Error) => void;
}

export interface Paginated<T> {
  totalResults: number;
  totalPages: number;
  page: number;
  rpp: number;
  moreResults: boolean;
  data: T[];
}

export interface InitDbOptions {
  /** List of updates/migrations to perform when opening the database */
  updates?: { [toVersion: number]: DbInitFunction };
  /**
   * Desired version to update to.
   * If not provided, it will apply all needed updates
   */
  version?: number;
}

export interface SqlLimitConfig {
  default: number;
  min: number;
  max: number;
}

export type SqlLimits<T extends { [query: string]: string }> = Partial<
  { [query in keyof T]: SqlLimitConfig }
>;

// This is just to prevent assigning this parameters from outside,
// because they are received from the paginate method options
interface PaginationParams {
  /** Number of Result per Page */
  rpp?: never;
  /** First result to show */
  offset?: never;
}

interface DbControl {
  version: number;
}

/**
 * Generic wrapper to operate with MySQL databases
 */
export class MySql {
  public static readonly CONTROL_TABLE_NAME = '_dbcontrol';
  public static readonly INIT_VERSION = 0;

  public readonly logger?: NsLogger;
  protected readonly connection: Connection;

  constructor(connection: Connection, options?: MySqlOptions) {
    this.logger = options && options.logger;
    this.connection = connection;
    this.connection.config.namedPlaceholders = true;
  }

  /**
   * Executes SQL without expecting a result
   */
  public async execute<P extends {} = SqlParams>(sql: string, params?: P) {
    return this.connection.execute(sql, params);
  }

  /**
   * Executes SQL and obtains a list of results
   */
  public async query<T extends {} = {}, P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<T[]> {
    return (await this.connection.execute(sql, params))[0] as T[];
  }

  /**
   * Executes SQL and gets the first result
   */
  public async queryOne<T extends {} = {}, P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<T | undefined> {
    return ((await this.connection.execute(sql, params))[0] as T[])[0];
  }

  /**
   * Executes a query but returns it as paginated data
   */
  public async paginate<
    T extends {} = {},
    DP extends {} = SqlParams & PaginationParams,
    CP extends {} = SqlParams
  >(options: {
    /** Results per Page */
    rpp: number;
    /** Page to retrieve (starting on 0) */
    page: number;
    /** Query to retrieve the data */
    dataSql: string;
    /**
     * Parameters for the dataSql
     * Must include `offset` at least
     * (`limit` can be hardcoded in the sql)
     */
    dataParams: DP;
    /**
     * Query to retrieve the total count
     * Must be SELECT COUNT(*) AS total...
     */
    countSql: string;
    /**
     * Optional parameters for the countSql
     */
    countParams?: CP;
    /**
     * Can be specified to protect queries from aggresive queries so not too
     * much data is retrieved at once
     */
    limit: SqlLimitConfig;
  }): Promise<Paginated<T>> {
    if (!IS_PRODUCTION) {
      if (
        options.dataSql.toLowerCase().indexOf('limit :rpp') === -1 ||
        options.dataSql.toLowerCase().indexOf('offset :offset') === -1
      ) {
        throw new Error(
          `Pagination data SQL needs to use "OFFSET :offset" and "LIMIT :rpp". Query: ${options.dataSql}`
        );
      }
      if (
        options.countSql.toLowerCase().indexOf('limit') !== -1 ||
        options.countSql.toLowerCase().indexOf('offset') !== -1
      ) {
        throw new Error(
          `Pagination SQL can't use OFFSET nor LIMIT. Query: ${options.countSql}`
        );
      }
    }
    const { rpp, page, limit } = options;
    (options.dataParams as SqlParams).rpp = limit
      ? limit.max < rpp
        ? limit.default
        : limit.min || 1 > rpp
        ? limit.default
        : rpp
      : rpp;
    (options.dataParams as SqlParams).offset = Math.max(0, page) * rpp;

    const [dataQuery, countQuery] = await Promise.all([
      this.connection.execute(options.dataSql, options.dataParams),
      this.connection.execute(options.countSql, options.countParams),
    ]);
    const data = dataQuery[0] as T[];
    const count = (countQuery[0] as { total: number }[])[0]!;

    const totalResults = count.total;
    const totalPages = Math.ceil(totalResults / rpp);
    const moreResults = page < totalPages - 1;

    return {
      totalResults,
      totalPages,
      moreResults,
      data,
      rpp: options.rpp,
      page: options.page,
    };
  }

  /**
   * Insert one element and get the result
   */
  public async insertOne<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<ResultSetHeader> {
    const res = await this.connection.execute(sql, params);
    return res[0] as ResultSetHeader;
  }

  /**
   * Perform the provided work as a transaction.
   * If there's an error or `rollback()` is called from `work`,
   * nothing will be committed.
   *
   * Return value is the return value from work
   * and it will exist even if `rollback` has been called
   * (but undefined if there was an error)
   */
  public async transaction<T = void>(
    work: TransactionWork<T>,
    options: TransactionOptions = {}
  ): Promise<T | undefined> {
    let returnValue: T | undefined;
    let rollback = false;

    await this.connection.beginTransaction();
    try {
      returnValue = await work({
        db: this,
        rollback: () => (rollback = true),
      });
    } catch (e) {
      await this.connection.rollback();
      if (options.throw) throw e;
      if (options.errHandler) options.errHandler(e);
      return;
    }

    if (rollback) {
      await this.connection.rollback();
    } else {
      await this.connection.commit();
    }
    return returnValue;
  }

  /**
   * Initializes the database connection to the provided version,
   * applying updates if needed
   */
  public async initDb(options: InitDbOptions) {
    const dbVersion = await this.getDbVersion();

    this.updateDb(dbVersion, options.updates, options.version);
  }

  protected async getDbVersion(): Promise<number> {
    try {
      const sql = `SELECT version FROM ${MySql.CONTROL_TABLE_NAME}`;
      return (await this.queryOne<DbControl>(sql))!.version;
    } catch (e) {
      this.logger && this.logger.info('Initializating database');
      await this.createControlTable();
      return MySql.INIT_VERSION;
    }
  }

  protected async createControlTable(): Promise<void> {
    [
      `
      CREATE TABLE IF NOT EXISTS ${MySql.CONTROL_TABLE_NAME} (
        version integer NOT NULL
      );`,
      `INSERT INTO ${MySql.CONTROL_TABLE_NAME} (version) VALUES (${MySql.INIT_VERSION})`,
    ].forEach(async (sql) => await this.execute(sql));
  }

  protected async updateDb(
    currentVersion: number,
    updates: InitDbOptions['updates'],
    desiredVersion?: number
  ): Promise<void> {
    if (!updates) return;
    const updateVersionSql = `UPDATE ${MySql.CONTROL_TABLE_NAME} SET version = :version`;
    let list = Object.entries(updates)
      .map(([toVersion, callback]) => ({
        callback,
        toVersion: Number(toVersion),
      }))
      .filter((update) => update.toVersion > currentVersion)
      .sort((a, b) => a.toVersion - b.toVersion);

    if (desiredVersion) {
      list = list.filter((update) => update.toVersion <= desiredVersion);
    }

    if (!list.length) {
      this.logger &&
        this.logger.verbose(`No updates needed for version ${currentVersion}`);
    }

    list.forEach(async (item) => {
      this.logger &&
        this.logger.info(`Updating database to version ${item.toVersion}`);
      await item.callback(this);
      await this.execute(updateVersionSql, { version: item.toVersion });
    });
  }
}
