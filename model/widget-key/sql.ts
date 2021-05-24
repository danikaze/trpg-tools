import { MySql } from '../../utils/mysql';
import { getTimestamp } from '../../utils/db';
import { DbUser } from '../user/sql';
import { TimestampTable } from '../interfaces';
import { DbWidgetDef } from '@model/widget-def/sql';

export interface DbWidgetKey extends TimestampTable {
  widgetKeyId: string;
  widgetDefId: DbWidgetDef['widgetDefId'];
  userId: DbUser['userId'];
  name: string;
  data: string;
}

type SelectWidgetKey = Pick<
  DbWidgetKey,
  'userId' | 'widgetDefId' | 'name' | 'data'
> &
  Pick<DbWidgetDef, 'type' | 'html' | 'js' | 'css'>;
type SelectUserWidgetKeys = Pick<
  DbWidgetKey,
  'widgetKeyId' | 'widgetDefId' | 'name' | 'data'
>;

export const sql = {
  insertWidgetKey: (
    db: MySql,
    params: Pick<
      DbWidgetKey,
      'widgetKeyId' | 'userId' | 'widgetDefId' | 'name' | 'data'
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
    params: {
      userId: DbWidgetKey['userId'];
      types: DbWidgetKey['widgetDefId'][];
    }
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
    widget_keys (widgetKeyId, widgetDefId, userId, name, data, createdOn, updatedOn)
      VALUES (:widgetKeyId, :widgetDefId, :userId, :name, :data, :time, :time)
    `,

  deleteWidgetKey: `
    DELETE FROM widget_keys
      WHERE widgetKeyId = :widgetKeyId
        AND userId = :userId
  `,

  selectWidgetKey: `
    SELECT k.userId, k.widgetDefId, k.name, k.data, d.type, d.html, d.js, d.css
      FROM widget_keys k
      JOIN widget_defs d ON k.widgetDefId = d.widgetDefId
      WHERE widgetKeyId = :widgetKeyId
  `,

  selectAllUserWidgetKeys: `
    SELECT widgetKeyId, widgetDefId, name, data
      FROM widget_keys
      WHERE userId = :userId
      ORDER BY updatedOn
  `,

  selectUserWidgetKeys: `
    SELECT widgetKeyId, widgetDefId, name, data
      FROM widget_keys
      WHERE userId = :userId
        AND widgetDefId IN (:widgetDefId)
      ORDER BY updatedOn
  `,

  renameWidgetKey: `
    UPDATE widget_keys
      SET name = :name
      WHERE widgetKeyId = :widgetKeyId
        AND userId = :userId
  `,
};
