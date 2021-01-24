import { default as mysql2 } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import { getLogger } from './logger';
import { MySql, InitDbOptions } from './mysql';

let db: MySql;

/**
 * Get a connection to the database
 * TODO: Change it to use pools maybe
 */
export async function getDb(): Promise<MySql> {
  if (!db) {
    const connection = await mysql2.createConnection({
      host: 'localhost',
      user: MYSQL_USER,
      password: MYSQL_PASS,
      database: MYSQL_DATABASE,
    });
    db = new MySql(connection, { logger: getLogger('db') });
  }

  return db;
}

/**
 * Checks that the database is properly initialized.
 * To be called when the app starts
 */
export async function initDb(options: InitDbOptions): Promise<void> {
  const db = await getDb();
  await db.initDb(options);
}

/**
 * Generate a unique ID for the database
 */
export function generateUniqueId(): string {
  return uuidv4();
}
