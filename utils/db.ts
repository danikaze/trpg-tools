import {
  createConnection,
  createPool,
  ConnectionOptions,
  Pool,
} from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { MySql, InitDbOptions } from './mysql';
import { getLogger } from './logger';
// this import is required since it's being used from the server
// (outside webpack), and since we know DB is only used in server
// side, we can include the server implementation for the logger here
import './logger/private/server';

const RATIO_SECS_MS = 1000;
const logger = getLogger('db');
const connectionConfig: ConnectionOptions = {
  host: 'localhost',
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_DATABASE,
};
let pool: Pool;
let db: MySql;

if (MYSQL_USE_POOL) {
  pool = createPool({
    ...connectionConfig,
  });
}

/**
 * Get a connection to the database
 */
export async function getDb(): Promise<MySql> {
  try {
    if (MYSQL_USE_POOL) {
      const connection = await pool.getConnection();
      return new MySql(connection, { logger, keepAlive: 0 });
    }

    if (!db) {
      const connection = await createConnection(connectionConfig);
      db = new MySql(connection, { logger });
    }
  } catch (e) {
    logger.error(`Can't connect to the database. ${e}`);
  }

  return db;
}

/**
 * Checks that the database is properly initialized.
 * To be called when the app starts
 */
export async function initDb(options: InitDbOptions): Promise<void> {
  const db = await getDb();
  db && (await db.initDb(options));
}

/**
 * Generate a unique ID for the database
 */
export function generateUniqueId(): string {
  return uuidv4();
}

/**
 * Get a standard way to store timestamps as numbers in the database
 */
export function getTimestamp(date?: Date): number {
  const timestamp = date ? date.getTime() : Date.now();
  return Math.floor(timestamp / RATIO_SECS_MS);
}
