import { SqlLimits } from '../../utils/mysql';
import { TimestampTable } from '../interfaces';
import {
  DbNoteDefinition,
  DbNoteFieldDefinition,
} from '../note-definition/sql';
import { DbGame } from '../game/sql';
import { DbUser } from '../user/sql';

export interface DbNote extends TimestampTable {
  noteId: string;
  userId: DbUser['id'];
  noteDefId: DbNoteDefinition['noteDefId'];
  gameId: DbGame['id'];
  title: string;
}

export interface DbNoteContent {
  noteId: DbNote['noteId'];
  noteFieldDefId: DbNoteFieldDefinition['noteFieldDefId'];
  value: string;
}

export const sql = {
  createNote: `
    INSERT INTO notes (
      noteId,
      userId,
      noteDefId,
      gameId,
      title,
      createdOn,
      updatedOn
    )
    VALUES (
      :noteId,
      :userId,
      :noteDefId,
      :gameId,
      :title,
      :createdOn,
      :updatedOn
    )
  `,
  createNoteContent: `
    INSERT INTO notes_contents (
      noteId,
      noteFieldDefId,
      value
    )
    VALUES (
      :noteId,
      :noteFieldDefId,
      :value
    )
  `,
  selectUserNotesOfType: `
    SELECT noteId, title, createdOn, updatedOn
      FROM notes
      WHERE noteDefId = :noteDefId
        AND gameId = :gameId
        AND userId = :userId
      ORDER BY updatedOn DESC
      LIMIT :rpp
      OFFSET :offset
  `,
  countUserNotesOfType: `
    SELECT COUNT(*) AS total
      FROM notes
      WHERE noteDefId = :noteDefId
        AND gameId = :gameId
        AND userId = :userId
  `,
  selectNoteContents: `
  SELECT c.noteFieldDefId, c.noteId, c.value
  FROM notes_contents c
    JOIN notes n ON c.noteId = n.noteId
      WHERE c.noteId IN (:noteIds)
        AND n.userId = :userId
  `,
  updateNote: `
    UPDATE notes
      SET title = :title,
        updatedOn = :updatedOn
      WHERE noteId = :noteId
        AND updatedOn = :lastUpdate
        AND userId = :userId
  `,
  // note that ON DUPLICATE is not safe for replication
  // https://dev.mysql.com/doc/refman/8.0/en/insert-on-duplicate.html
  updateNoteContent: `
  INSERT INTO notes_contents (noteId, noteFieldDefId, value)
    VALUES (:noteId, :noteFieldDefId, :value)
    ON DUPLICATE KEY UPDATE value = :value
  `,
  deleteNote: `
    DELETE
      FROM notes
      WHERE noteId = :noteId
        AND userId = :userId`,
};

export const limits: SqlLimits<typeof sql> = {
  selectUserNotesOfType: { default: 25, max: 25, min: 25 },
};
