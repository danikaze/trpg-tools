import { Connection, ResultSetHeader } from 'mysql2/promise';
import { NsLogger } from './logger';

export type SqlParams = {
  [key: string]: string | number | null | string[] | number[] | boolean;
};

export interface MySqlOptions {
  /** If provided, it will log some */
  logger?: NsLogger;
  /**
   * If greater than 0, ping the connection every this value (ms)
   * Default: 60 secs
   */
  keepAlive?: number;
}

export type DbInitFunction = (db: MySql) => Promise<void>;

export type TransactionWork<T> = (transaction: {
  db: MySql;
  rollback: () => void;
}) => Promise<T | undefined>;

export interface TransactionOptions {
  noThrow?: boolean;
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

type SimpleParams = Record<string, string | number | null>;
type ArrayParams = Record<string, (string | number | null)[]>;
interface InClauseTransform<P extends SimpleParams> {
  sql: string;
  params?: P;
}

/**
 * Generic wrapper to operate with MySQL databases
 */
export class MySql {
  public static readonly CONTROL_TABLE_NAME = '_dbcontrol';
  public static readonly INIT_VERSION = 0;
  public static readonly DEFAULT_KEEPALIVE = 60000;

  public readonly logger?: NsLogger;
  protected readonly connection: Connection;

  constructor(connection: Connection, options?: MySqlOptions) {
    this.logger = options && options.logger;
    this.connection = connection;
    this.connection.config.namedPlaceholders = true;

    this.logger && this.logger.verbose('Database connected');
    const keepAlive = (options && options.keepAlive) || MySql.DEFAULT_KEEPALIVE;
    if (keepAlive <= 0) return;
    setInterval(this.ping.bind(this), keepAlive);
  }

  /**
   * Transforms a query when needed to support running WHERE IN clauses
   * from prepared statements, which are not supported by default on mysql2
   * due to having a variable number of parameters
   */
  protected static transformInClauses<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): InClauseTransform<P> {
    // if no params, use it as it is
    if (!params) {
      return { sql, params };
    }

    // separate array and no array params
    const regExp = / IN \(:([^)]+)\)/gi;
    const simpleParams = {} as SimpleParams;
    const arrayParams = {} as ArrayParams;
    const entries = Object.entries(params) as [
      string,
      string | number | null
    ][];
    let anyArray = false;
    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        arrayParams[key] = value;
        anyArray = true;
      } else {
        simpleParams[key] = value;
      }
    }

    // only transform when there are array parameters
    if (!anyArray) {
      return { sql, params };
    }

    const query = sql.replace(regExp, (match, paramName) => {
      const values = arrayParams[paramName];
      if (!IS_PRODUCTION && !values) {
        throw new Error(
          `Mysql: Parameter (:${paramName}) for the IN clause needs to be an Array in: ${sql}`
        );
      }

      if (values.length === 0) {
        return ' IN(null)';
      }

      const newParams: string[] = [];
      for (let i = 0; i < values.length; i++) {
        simpleParams[`${paramName}${i}`] = values[i];
        newParams.push(`:${paramName}${i}`);
      }
      return ` IN(${newParams.join(', ')})`;
    });

    return {
      sql: query,
      params: simpleParams as P,
    };
  }

  /**
   * Executes SQL without expecting a result
   */
  public async execute<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<void> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      await this.connection.execute(
        transformedQuery.sql,
        transformedQuery.params
      );
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on execute: "${sql}" with params ${JSON.stringify(params)}`
        );
      throw e;
    }
  }

  /**
   * Executes SQL and obtains a list of results
   */
  public async query<T extends {} = {}, P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<T[]> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      return (
        await this.connection.execute(
          transformedQuery.sql,
          transformedQuery.params
        )
      )[0] as T[];
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on query: "${sql}" with params ${JSON.stringify(params)}`
        );
      throw e;
    }
  }

  /**
   * Executes SQL and gets the first result
   */
  public async queryOne<T extends {} = {}, P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<T | undefined> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      return ((
        await this.connection.execute(
          transformedQuery.sql,
          transformedQuery.params
        )
      )[0] as T[])[0];
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on queryOne: "${sql}" with params ${JSON.stringify(
            params
          )}: ${e}`
        );
      throw e;
    }
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

    try {
      const txqData = MySql.transformInClauses(
        options.dataSql,
        options.dataParams
      );
      const txqCount = MySql.transformInClauses(
        options.countSql,
        options.countParams
      );

      const [dataQuery, countQuery] = await Promise.all([
        this.connection.execute(txqData.sql, txqData.params),
        this.connection.execute(txqCount.sql, txqCount.params),
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
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on pagination: "${
            options.dataSql
          }" with params ${JSON.stringify(options.dataParams)} OR "${
            options.countSql
          } with params ${JSON.stringify(options.countParams)}"`
        );
      throw e;
    }
  }

  /**
   * Insert one element and get the result
   */
  public async insertOne<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<ResultSetHeader> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      const res = await this.connection.execute(
        transformedQuery.sql,
        transformedQuery.params
      );
      return res[0] as ResultSetHeader;
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on insertOne: "${sql}" with params ${JSON.stringify(params)}`
        );
      throw e;
    }
  }

  /**
   * Execute an update query and get the result
   */
  public async update<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<ResultSetHeader> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      const res = await this.connection.execute(
        transformedQuery.sql,
        transformedQuery.params
      );
      return res[0] as ResultSetHeader;
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on update: "${sql}" with params ${JSON.stringify(params)}`
        );
      throw e;
    }
  }

  /**
   * Execute a delete query and get the result
   */
  public async delete<P extends {} = SqlParams>(
    sql: string,
    params?: P
  ): Promise<ResultSetHeader> {
    try {
      const transformedQuery = MySql.transformInClauses(sql, params);
      const res = await this.connection.execute(
        transformedQuery.sql,
        transformedQuery.params
      );
      return res[0] as ResultSetHeader;
    } catch (e) {
      this.logger &&
        this.logger.error(
          `Error on delete: "${sql}" with params ${JSON.stringify(params)}`
        );
      throw e;
    }
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
      if (options.noThrow !== false) throw e;
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

  /**
   * Execute a list of SQL queries in synchronous fashion
   * If a `name` is provided, it will `log.debug` the progress if a `logger`
   * is set in the instance.
   */
  public async executeSyncSql(sqlList: string[], name?: string): Promise<void> {
    const logger = name && this.logger;
    for (let i = 0; i < sqlList.length; i++) {
      const sql = sqlList[i];
      logger && logger.debug(`Executing SQL for ${name}[${i}]`);
      try {
        await this.execute(sql);
      } catch (e) {
        logger &&
          logger.error(`Error while executing ${name}[${i}]:\n${sql}`, e);
      }
    }
  }

  protected async getDbVersion(): Promise<number> {
    try {
      const sql = `SELECT version FROM ${MySql.CONTROL_TABLE_NAME}`;
      return ((await this.connection.execute(sql))[0] as DbControl[])[0]!
        .version;
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

  protected async ping(): Promise<void> {
    try {
      this.logger && this.logger.verbose('Pinging the database');
      this.connection.ping();
    } catch (e) {
      this.logger && this.logger.error('Error while pinging the database', e);
    }
  }
}
