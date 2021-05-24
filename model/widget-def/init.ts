import { basename } from 'path';
import { DbInitFunction } from '../../utils/mysql';
import { WIDGET_DEF_NAME_MAX_LENGTH } from '../../utils/constants';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '../constants/sql';

import { DbWidgetDef } from './sql';

export type SystemWidgetDef = 'charStatusBorders' | 'charHp' | 'charSheet';
export const systemWidgetDefIds = {} as Record<
  SystemWidgetDef,
  DbWidgetDef['widgetDefId']
>;

export const initWidgetDefs: DbInitFunction = async (db) => {
  const sql = [
    `
    CREATE TABLE IF NOT EXISTS widget_defs (
      widgetDefId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      type ${MYSQL_TYPE_ENUM} NOT NULL,
      name VARCHAR(${WIDGET_DEF_NAME_MAX_LENGTH}) NOT NULL,
      html TEXT NOT NULL,
      js TEXT NOT NULL,
      css TEXT NOT NULL,
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
    `,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};
