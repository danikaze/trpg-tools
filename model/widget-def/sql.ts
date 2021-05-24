import { MySql } from '../../utils/mysql';
import { getTimestamp } from '../../utils/db';
import { DbUser } from '../user/sql';
import { SYSTEM_USER } from '../user';
import { WidgetKeyType } from './interface';
import { TimestampTable } from '../interfaces';

export interface DbWidgetDef extends TimestampTable {
  widgetDefId: string;
  userId: DbUser['userId'];
  type: WidgetKeyType;
  name: string;
  html: string;
  js: string;
  css: string;
}

type SelectWidgetDef = Pick<
  DbWidgetDef,
  'userId' | 'type' | 'name' | 'html' | 'js' | 'css' | 'updatedOn'
>;
type SelectUserWidgetDefs = Pick<
  DbWidgetDef,
  'widgetDefId' | 'type' | 'name' | 'userId'
>;

export const sql = {
  insertWidgetDef: (
    db: MySql,
    params: Pick<
      DbWidgetDef,
      'widgetDefId' | 'userId' | 'type' | 'name' | 'html' | 'js' | 'css'
    > & { time: DbWidgetDef['updatedOn'] }
  ) => {
    return db.insertOne(queries.insertWidgetDef, { ...params });
  },

  updateWidgetDef: (
    db: MySql,
    params: Pick<
      DbWidgetDef,
      | 'widgetDefId'
      | 'userId'
      | 'type'
      | 'name'
      | 'html'
      | 'js'
      | 'css'
      | 'updatedOn'
    > & { lastUpdate: DbWidgetDef['updatedOn'] }
  ) => {
    return db.update(queries.updateWidgetDef, params);
  },

  deleteWidgetDef: (
    db: MySql,
    params: Pick<DbWidgetDef, 'widgetDefId' | 'userId'>
  ) => {
    return db.delete(queries.deleteWidgetDef, params);
  },

  selectWidgetDef: (
    db: MySql,
    params: Pick<DbWidgetDef, 'userId' | 'widgetDefId'>
  ) => {
    return db.queryOne<SelectWidgetDef>(queries.selectWidgetDef, params);
  },

  selectAllUserWidgetDefs: (
    db: MySql,
    params: { userId: DbWidgetDef['userId'] }
  ) => {
    return db.query<SelectUserWidgetDefs>(
      queries.selectAllUserWidgetDefs,
      params
    );
  },

  renameWidgetDef: (
    db: MySql,
    params: Pick<DbWidgetDef, 'userId' | 'widgetDefId' | 'name'>
  ) => {
    return db.update(queries.renameWidgetDef, params);
  },
};

const queries = {
  insertWidgetDef: `
    INSERT INTO
    widget_defs (widgetDefId, userId, type, name, html, js, css, createdOn, updatedOn)
      VALUES(:widgetDefId, :userId, :type, :name, :html, :js, :css, :time, :time)
  `,

  updateWidgetDef: `
    UPDATE widget_defs
      SET name = :name,
        type = :type,
        html = :html,
        js = :js,
        css = :css,
        updatedOn = :updatedOn
      WHERE widgetDefId = :widgetDefId
        AND userId = :userId
        AND updatedOn = :lastUpdate
  `,

  deleteWidgetDef: `
    DELETE FROM widget_defs
      WHERE widgetDefId = :widgetDefId
        AND userId = :userId
  `,

  selectWidgetDef: `
    SELECT userId, type, name, html, js, css, updatedOn
      FROM widget_defs
      WHERE widgetDefId = :widgetDefId
        AND (
          userId = :userId
          OR userId = ${SYSTEM_USER.userId}
        )
  `,

  selectAllUserWidgetDefs: `
    SELECT widgetDefId, type, name, userId
      FROM widget_defs
      WHERE userId = :userId
        OR userId = ${SYSTEM_USER.userId}
      ORDER BY updatedOn
  `,

  renameWidgetDef: `
    UPDATE widget_defs
      SET name = :name
      WHERE widgetDefId = :widgetDefId
        AND userId = :userId
  `,
};
