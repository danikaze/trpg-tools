import { MySql, SqlLimits } from '@utils/mysql';
import {
  DbNoteDefinition,
  DbNoteFieldDefinition,
} from '@model/note-definition/sql';
import { DbGame } from '@model/game/sql';
import { DbUser } from '@model/user/sql';
import { TimestampTable } from '@model/interfaces';

export interface DbNote extends TimestampTable {
  noteId: string;
  userId: DbUser['userId'];
  noteDefId: DbNoteDefinition['noteDefId'];
  gameId: DbGame['gameId'];
  title: string;
}

export type DbNoteBasic = Pick<
  DbNote,
  'noteId' | 'noteDefId' | 'gameId' | 'title'
>;

export interface DbNoteContent {
  noteId: DbNote['noteId'];
  noteFieldDefId: DbNoteFieldDefinition['noteFieldDefId'];
  value: string;
}

type SelectNoteContents = Pick<
  DbNoteContent,
  'noteFieldDefId' | 'noteId' | 'value'
>;

export const sql = {
  insertNote: (
    db: MySql,
    params: Pick<
      DbNote,
      'noteId' | 'userId' | 'noteDefId' | 'gameId' | 'title' | 'createdOn'
    >
  ) => {
    const time = params.createdOn;
    return db.insertOne(queries.insertNote, {
      ...params,
      time,
    });
  },

  insertNoteContent: (
    db: MySql,
    params: Pick<DbNoteContent, 'noteId' | 'noteFieldDefId' | 'value'>
  ) => {
    return db.insertOne(queries.insertNoteContent, params);
  },

  selectNote: (
    db: MySql,
    params: { userId: DbUser['userId']; noteId: DbNote['noteId'] }
  ) => {
    return db.queryOne<DbNote>(queries.selectNote, params);
  },

  paginateUserNotes: (
    db: MySql,
    page: number,
    params: Pick<DbNote, 'userId' | 'gameId' | 'noteDefId'>
  ) => {
    return db.paginate<DbNote>({
      page,
      rpp: limits.selectUserNotesOfType!.default,
      limit: limits.selectUserNotesOfType!,
      dataSql: queries.selectUserNotesOfType,
      dataParams: params,
      countSql: queries.countUserNotesOfType,
      countParams: params,
    });
  },

  selectUserNotesOfTypeByGame: (
    db: MySql,
    params: { userId: DbNote['userId']; noteDefIds: DbNote['noteDefId'][] }
  ) => {
    return db.query<DbNoteBasic>(queries.selectUserNotesOfTypeByGame, params);
  },

  selectNoteContents: (
    db: MySql,
    params: { userId: DbUser['userId']; noteIds: DbNote['noteId'][] }
  ) => {
    return db.query<SelectNoteContents>(queries.selectNoteContents, params);
  },

  updateNote: (
    db: MySql,
    params: Pick<DbNote, 'title' | 'updatedOn' | 'noteId' | 'userId'> & {
      lastUpdate: DbNote['updatedOn'];
      ignoreLastUpdate: boolean;
    }
  ) => {
    return db.update(queries.updateNote, params);
  },

  updateNoteContent: (
    db: MySql,
    params: Pick<DbNoteContent, 'noteId' | 'noteFieldDefId' | 'value'>
  ) => {
    return db.update(queries.updateNoteContent, params);
  },

  deleteNote: (db: MySql, params: Pick<DbNote, 'userId' | 'noteId'>) => {
    return db.delete(queries.deleteNote, params);
  },
};

const queries = {
  insertNote: `
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
      :time,
      :time
    )
  `,
  insertNoteContent: `
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
  selectNote: `
    SELECT noteId, noteDefId, title, createdOn, updatedOn
      FROM notes
      WHERE noteId = :noteId
        AND userId = :userId
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
  selectUserNotesOfTypeByGame: `
    SELECT noteId, noteDefId, gameId, title
      FROM notes
      WHERE noteDefId IN (:noteDefIds)
        AND userId = :userId
      ORDER BY updatedOn DESC
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
        AND userId = :userId
        AND (
          updatedOn = :lastUpdate
          OR :ignoreLastUpdate = true
        )
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

const limits: SqlLimits<typeof queries> = {
  selectUserNotesOfType: { default: 25, max: 25, min: 25 },
};
