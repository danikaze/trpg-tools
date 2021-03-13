import { basename } from 'path';
import {
  FIELD_TEXT_MAX_LENGTH,
  NOTE_COL_NAME_MAX_LENGTH as NOTE_COL_TITLE_MAX_LENGTH,
} from '../../utils/constants';
import { DbInitFunction } from '../../utils/mysql';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '../constants/sql';

export const initNote: DbInitFunction = async (db) => {
  const sql = [
    // User notes
    `
    CREATE TABLE IF NOT EXISTS notes (
      noteId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      noteDefId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      gameId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      title VARCHAR(${NOTE_COL_TITLE_MAX_LENGTH}) NOT NULL DEFAULT '',
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (noteDefId)
        REFERENCES notes_def(noteDefId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (gameId)
        REFERENCES games(gameId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
    // Contents for each field of each user note
    `
    CREATE TABLE IF NOT EXISTS notes_contents (
      noteId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      noteFieldDefId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
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
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};
