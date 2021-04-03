import { getTimestamp } from '../../utils/db';
import { MySql, SqlLimits } from '../../utils/mysql';
import { TimestampTable } from '../interfaces';
import { DbUser } from '../user/sql';
import { SYSTEM_USER } from '../user';

export type FieldType =
  | 'int'
  | 'textfield'
  | 'textarea'
  | 'checkbox'
  | 'select';

export interface DbNoteDefinition extends TimestampTable {
  noteDefId: string;
  userId: DbUser['userId'];
  name: string;
}

export type DbNoteDefinitionName = Pick<DbNoteDefinition, 'noteDefId' | 'name'>;

export interface DbNoteFieldDefinition {
  noteFieldDefId: number;
  noteDefId: DbNoteDefinition['noteDefId'];
  position: number;
  name: string;
  type: FieldType;
  options: string;
}

type SelectUserNoteDefinitions = Pick<DbNoteDefinition, 'noteDefId' | 'name'>;
type SelectNoteFieldsDefinitions = Pick<
  DbNoteFieldDefinition,
  'noteFieldDefId' | 'noteDefId' | 'position' | 'name' | 'type' | 'options'
>;

export const sql = {
  insertNoteDefinition: (
    db: MySql,
    params: Pick<DbNoteDefinition, 'noteDefId' | 'userId' | 'name'>
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertNoteDefinition, {
      ...params,
      time,
    });
  },

  insertNoteFieldDefinition: (
    db: MySql,
    params: Pick<
      DbNoteFieldDefinition,
      'noteDefId' | 'position' | 'name' | 'type' | 'options'
    >
  ) => {
    return db.insertOne(queries.insertNoteFieldDefinition, params);
  },

  selectUserNoteDefinitions: (
    db: MySql,
    params: Pick<DbNoteDefinition, 'userId'>
  ) => {
    return db.query<SelectUserNoteDefinitions>(
      queries.selectUserNoteDefinitions,
      {
        ...params,
        systemUserId: SYSTEM_USER.userId,
      }
    );
  },

  selectUserNoteDefinitionNames: (
    db: MySql,
    params: {
      userId: DbNoteDefinition['userId'];
      noteDefIds: DbNoteDefinition['noteDefId'][];
    }
  ) => {
    return db.query<DbNoteDefinitionName>(
      queries.selectUserNoteDefinitionNames,
      {
        ...params,
        systemUserId: SYSTEM_USER.userId,
      }
    );
  },

  selectNoteFieldsDefinitions: (
    db: MySql,
    params: { noteDefIds: DbNoteDefinition['noteDefId'][] }
  ) => {
    return db.query<SelectNoteFieldsDefinitions>(
      queries.selectNoteFieldsDefinitions,
      params
    );
  },

  deleteNoteDefinition: (
    db: MySql,
    params: Pick<DbNoteDefinition, 'userId' | 'noteDefId'>
  ) => {
    return db.delete(queries.deleteNoteDefinition, params);
  },

  deleteNoteFieldDefinition: (
    db: MySql,
    params: {
      userId: DbNoteDefinition['userId'];
      noteFieldDefId: DbNoteFieldDefinition['noteFieldDefId'];
    }
  ) => {
    return db.delete(queries.deleteNoteFieldDefinition, params);
  },
};

const queries = {
  insertNoteDefinition: `
    INSERT INTO notes_def (noteDefId, userId, name, createdOn, updatedOn)
      VALUES (:noteDefId, :userId, :name, :time, :time)
  `,
  insertNoteFieldDefinition: `
    INSERT INTO notes_fields_def (noteDefId, position, name, type, options)
      VALUES (:noteDefId, :position, :name, :type, :options)
  `,
  selectUserNoteDefinitions: `
    SELECT noteDefId, name
      FROM notes_def
      WHERE userId = :systemUserId
        OR userId = :userId
      ORDER BY updatedOn DESC
  `,
  selectUserNoteDefinitionNames: `
    SELECT noteDefId, name
      FROM notes_def
      WHERE noteDefId IN (:noteDefIds)
        AND (
          userId = :systemUserId
          OR userId = :userId
        )
  `,
  countUserNoteDefinitions: `
    SELECT COUNT(*) AS total
      FROM notes_def
      WHERE userId = :systemUserId
        OR userId = :userId
  `,
  selectNoteFieldsDefinitions: `
    SELECT noteFieldDefId, noteDefId, position, name, type, options
      FROM notes_fields_def
      WHERE noteDefId IN (:noteDefIds)
      ORDER BY noteFieldDefId, position ASC
  `,
  deleteNoteDefinition: `
    DELETE FROM notes_def
      WHERE noteDefId = :noteDefId
        AND userId = :userId
  `,
  deleteNoteFieldDefinition: `
    DELETE notes_fields_def
      FROM notes_fields_def
      JOIN notes_def
      WHERE noteFieldDefId = :noteFieldDefId
        AND userId = :userId
  `,
};

const limits: SqlLimits<typeof queries> = {
  selectUserNoteDefinitions: { default: 50, max: 50, min: 50 },
};
