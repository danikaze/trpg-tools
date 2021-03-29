import { Paginated } from '../../utils/mysql';
import { generateUniqueId, getDb, getTimestamp } from '../../utils/db';
import { TimestampTable } from '../interfaces';
import { DbNote, DbNoteContent, sql } from './sql';
import { DbGame } from '../game/sql';
import { DbNoteDefinition } from '../note-definition/sql';
import { UserAuthData } from '../user';

export interface CreateNoteData {
  noteDefId: DbNoteDefinition['noteDefId'];
  gameId: DbGame['gameId'];
  title: DbNote['title'];
  content: Record<DbNoteDefinition['noteDefId'], NoteContentData['value']>;
}

export interface CreateNoteContentData {
  noteFieldDefId: DbNoteContent['noteFieldDefId'];
  value: DbNoteContent['value'];
}

export interface CreatedNoteData extends TimestampTable {
  noteId: DbNote['noteDefId'];
}

export interface NoteData extends TimestampTable {
  noteId: DbNote['noteId'];
  title: DbNote['title'];
  content: Record<DbNoteDefinition['noteDefId'], NoteContentData['value']>;
}

export interface NoteContentData {
  noteFieldDefId: DbNoteContent['noteFieldDefId'];
  noteId: NoteData['noteId'];
  value: DbNoteContent['value'];
}

export interface UpdateNoteData {
  noteId: DbNote['noteId'];
  noteDefId: DbNoteDefinition['noteDefId'];
  title: DbNote['title'];
  content: Record<DbNoteDefinition['noteDefId'], NoteContentData['value']>;
}

export interface UpdateNoteResult {
  updatedOn: DbNote['updatedOn'];
}

export async function createNote(
  user: UserAuthData,
  data: CreateNoteData
): Promise<CreatedNoteData> {
  const db = await getDb();
  const noteId = generateUniqueId();
  const createdOn = getTimestamp();

  await db.transaction(async () => {
    // note
    await sql.insertNote(db, {
      noteId,
      createdOn,
      userId: user.userId,
      noteDefId: data.noteDefId,
      gameId: data.gameId,
      title: data.title,
    });

    // contents
    await Promise.all(
      Object.entries(data.content).map(([noteFieldDefId, value]) =>
        sql.insertNoteContent(db, {
          noteId,
          value,
          noteFieldDefId: Number(noteFieldDefId),
        })
      )
    );
  });

  return { noteId, createdOn, updatedOn: createdOn };
}

export async function selectNote(
  user: UserAuthData,
  noteId: DbNote['noteId']
): Promise<NoteData | undefined> {
  const db = await getDb();

  // note
  const [note, contents] = await Promise.all([
    sql.selectNote(db, {
      noteId,
      userId: user.userId,
    }),
    sql.selectNoteContents(db, {
      userId: user.userId,
      noteIds: [noteId],
    }),
  ]);

  if (!note) return;
  return {
    noteId: note.noteId,
    title: note.title,
    createdOn: note.createdOn,
    updatedOn: note.updatedOn,
    content: contents.reduce((content, field) => {
      content[field.noteFieldDefId] = field.value;
      return content;
    }, {} as NoteData['content']),
  };
}

export async function selectNotes(
  user: UserAuthData,
  noteDefId: DbNoteDefinition['noteDefId'],
  gameId: DbGame['gameId'],
  page: number = 0
): Promise<Paginated<NoteData>> {
  const db = await getDb();

  // notes
  const paginatedNotes = await sql.paginateUserNotes(db, page, {
    gameId,
    noteDefId,
    userId: user.userId,
  });

  // note contents
  const contents = await sql.selectNoteContents(db, {
    userId: user.userId,
    noteIds: paginatedNotes.data.map((note) => note.noteId),
  });

  // create output
  const contentsByNoteId = contents.reduce(
    (res, content) => {
      res[content.noteId][content.noteFieldDefId] = content.value;
      return res;
    },
    paginatedNotes.data.reduce((res, note) => {
      res[note.noteId] = {};
      return res;
    }, {} as Record<NoteData['noteId'], NoteData['content']>)
  );

  const data = paginatedNotes.data.map((note) => ({
    noteId: note.noteId,
    title: note.title,
    createdOn: note.createdOn,
    updatedOn: note.updatedOn,
    content: contentsByNoteId[note.noteId],
  }));

  return {
    ...paginatedNotes,
    data,
  };
}

export async function deleteNote(
  user: UserAuthData,
  noteId: NoteData['noteId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteNote(db, {
    noteId,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error('No note found to delete or not enough permissions');
  }
}

export async function updateNote(
  user: UserAuthData,
  lastUpdate: DbNote['updatedOn'],
  ignoreLastUpdate: boolean,
  note: UpdateNoteData
): Promise<UpdateNoteResult> {
  const db = await getDb();
  const updatedOn = getTimestamp();
  const noteId = note.noteId;

  await db.transaction(async () => {
    // update the note
    const noteUpdate = await sql.updateNote(db, {
      updatedOn,
      lastUpdate,
      ignoreLastUpdate,
      noteId,
      title: note.title,
      userId: user.userId,
    });

    if (!noteUpdate.affectedRows) {
      throw new Error(
        'No note found to update, not enough permissions or the note was updated somewhere else'
      );
    }

    // update all the fields
    await Promise.all(
      Object.entries(note.content).map(([noteFieldDefId, value]) => {
        return sql.updateNoteContent(db, {
          value,
          noteId,
          noteFieldDefId: Number(noteFieldDefId),
        });
      })
    );
  });

  return { updatedOn };
}
