import { TimestampTable } from '../interfaces';
import { SqlLimits } from '../../utils/mysql';
import { DbUser } from '../user/sql';

export type FieldType =
  | 'int'
  | 'textfield'
  | 'textarea'
  | 'checkbox'
  | 'select';

export interface DbNoteDefinition extends TimestampTable {
  noteDefId: string;
  userId: DbUser['id'];
  name: string;
}

export interface DbNoteFieldDefinition {
  noteFieldDefId: number;
  noteDefId: DbNoteDefinition['noteDefId'];
  position: number;
  name: string;
  type: FieldType;
  options: string;
}

export const sql = {
  createNoteDefinition: `
    INSERT INTO notes_def (noteDefId, userId, name, createdOn, updatedOn)
    VALUES (:noteDefId, :userId, :name, :createdOn, :updatedOn)
  `,
  createNoteFieldDefinition: `
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
  deleteNoteFieldDefinition: `
    DELETE notes_fields_def
      FROM notes_fields_def
      JOIN notes_def
      WHERE noteFieldDefId = :noteFieldDefId
        AND userId = :userId`,
};

export const limits: SqlLimits<typeof sql> = {
  selectUserNoteDefinitions: { default: 50, max: 50, min: 50 },
};
