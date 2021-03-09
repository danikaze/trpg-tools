import {
  FIELD_TEXT_MAX_LENGTH,
  NOTE_COL_NAME_MAX_LENGTH as NOTE_COL_TITLE_MAX_LENGTH,
} from '../../utils/constants';
import { DbInitFunction } from '../../utils/mysql';
import { EDIT_TIME_COLS, INTERNAL_ID, PUBLIC_ID } from '../constants/sql';

export const initNote: DbInitFunction = async (db) => {
  await Promise.all(
    [
      // User notes
      `
      CREATE TABLE IF NOT EXISTS notes (
        noteId ${PUBLIC_ID} PRIMARY KEY,
        userId ${INTERNAL_ID} NOT NULL,
        noteDefId ${PUBLIC_ID} NOT NULL,
        gameId ${PUBLIC_ID} NOT NULL,
        title VARCHAR(${NOTE_COL_TITLE_MAX_LENGTH}) NOT NULL DEFAULT '',
        ${EDIT_TIME_COLS},

        FOREIGN KEY (userId)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE,

        FOREIGN KEY (noteDefId)
          REFERENCES notes_def(noteDefId)
          ON UPDATE CASCADE
          ON DELETE CASCADE,

        FOREIGN KEY (gameId)
          REFERENCES games(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
      `,
      // Contents for each field of each user note
      `
      CREATE TABLE IF NOT EXISTS notes_contents (
        noteId ${PUBLIC_ID} NOT NULL,
        noteFieldDefId ${INTERNAL_ID} NOT NULL,
        value VARCHAR(${FIELD_TEXT_MAX_LENGTH}),

        PRIMARY KEY (noteId, noteFieldDefId),

        FOREIGN KEY (noteId)
          REFERENCES notes(noteId)
          ON UPDATE CASCADE
          ON DELETE CASCADE,

        FOREIGN KEY (noteFieldDefId)
          REFERENCES notes_fields_def(noteFieldDefId)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
      `,
    ].map(async (sql, i) => {
      db.logger!.debug('Executing notes:', i);
      try {
        await db.execute(sql);
      } catch (e) {
        db.logger!.error(
          `Error while executing notes[${i}]`,
          sql,
          (e as Error).message
        );
      }
    })
  );
};
