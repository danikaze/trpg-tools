import { Connection } from 'mysql2/promise';
import { NsLogger } from './logger';

export interface SqlParams {
  [key: string]: string | number;
}

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

export interface InitDbOptions {
  /** List of updates/migrations to perform when opening the database */
  updates?: { [toVersion: number]: DbInitFunction };
  /**
   * Desired version to update to.
   * If not provided, it will apply all needed updates
   */
  version?: number;
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
  public async execute<P extends {}>(sql: string, params?: P) {
    return this.connection.execute(sql, params);
  }

  /**
   * Executes SQL and obtains a list of results
   */
  public async query<T>(sql: string, params?: SqlParams): Promise<T[]> {
    return (await this.connection.execute(sql, params))[0] as T[];
  }

  /**
   * Executes SQL and gets the first result
   */
  public async queryOne<T>(
    sql: string,
    params?: SqlParams
  ): Promise<T | undefined> {
    return ((await this.connection.execute(sql, params))[0] as T[])[0];
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
