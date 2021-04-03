import { WidgetKeyType } from '.';
import { DbUser } from '../user/sql';
import { TimestampTable } from '../interfaces';
import { MySql } from '../../utils/mysql';
import { getTimestamp } from '../../utils/db';

export interface DbWidgetKey extends TimestampTable {
  widgetKeyId: string;
  userId: DbUser['userId'];
  type: WidgetKeyType;
  name: string;
  data: string;
}

type SelectWidgetKey = Pick<DbWidgetKey, 'userId' | 'type' | 'name' | 'data'>;
type SelectUserWidgetKeys = Pick<
  DbWidgetKey,
  'widgetKeyId' | 'type' | 'name' | 'data'
>;

export const sql = {
  insertWidgetKey: (
    db: MySql,
    params: Pick<
      DbWidgetKey,
      'widgetKeyId' | 'userId' | 'type' | 'name' | 'data'
    >
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertWidgetKey, { ...params, time });
  },

  deleteWidgetKey: (
    db: MySql,
    params: Pick<DbWidgetKey, 'widgetKeyId' | 'userId'>
  ) => {
    return db.delete(queries.deleteWidgetKey, params);
  },

  selectWidgetKey: (db: MySql, params: Pick<DbWidgetKey, 'widgetKeyId'>) => {
    return db.queryOne<SelectWidgetKey>(queries.selectWidgetKey, params);
  },

  selectAllUserWidgetKeys: (
    db: MySql,
    params: { userId: DbWidgetKey['userId'] }
  ) => {
    return db.query<SelectUserWidgetKeys>(
      queries.selectAllUserWidgetKeys,
      params
    );
  },

  selectUserWidgetKeys: (
    db: MySql,
    params: { userId: DbWidgetKey['userId']; types: DbWidgetKey['type'][] }
  ) => {
    return db.query<SelectUserWidgetKeys>(queries.selectUserWidgetKeys, params);
  },

  renameWidgetKey: (
    db: MySql,
    params: Pick<DbWidgetKey, 'userId' | 'widgetKeyId' | 'name'>
  ) => {
    return db.update(queries.renameWidgetKey, params);
  },
};

const queries = {
  insertWidgetKey: `
    INSERT INTO
    widget_keys (widgetKeyId, userId, type, name, data, createdOn, updatedOn)
      VALUES (:widgetKeyId, :userId, :type, :name, :data, :time, :time)
    `,

  deleteWidgetKey: `
    DELETE FROM widget_keys
      WHERE widgetKeyId = :widgetKeyId
        AND userId = :userId
  `,

  selectWidgetKey: `
    SELECT userId, type, name, data
      FROM widget_keys
      WHERE widgetKeyId = :widgetKeyId
  `,

  selectAllUserWidgetKeys: `
    SELECT widgetKeyId, type, name, data
      FROM widget_keys
      WHERE userId = :userId
      ORDER BY updatedOn
  `,

  selectUserWidgetKeys: `
    SELECT widgetKeyId, type, name, data
      FROM widget_keys
      WHERE userId = :userId
        AND type IN (:types)
      ORDER BY updatedOn
  `,

  renameWidgetKey: `
    UPDATE widget_keys
      SET name = :name
      WHERE widgetKeyId = :widgetKeyId
        AND userId = :userId
  `,
};
