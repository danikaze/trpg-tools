import { Paginated } from '../../utils/mysql';
import { generateUniqueId, getDb, getTimestamp } from '../../utils/db';
import { TimestampTable } from '../interfaces';
import { DbNote, DbNoteContent, limits, sql } from './sql';
import { DbGame } from '../game/sql';
import { DbNoteDefinition } from '../note-definition/sql';
import { UserAuthData } from '../user';

export interface CreateNoteData {
  noteDefId: DbNoteDefinition['noteDefId'];
  gameId: DbGame['id'];
  title: DbNote['title'];
  content: CreateNoteContentData[];
}

export interface CreateNoteContentData {
  noteFieldDefId: DbNoteContent['noteFieldDefId'];
  value: DbNoteContent['value'];
}

export interface CreatedNoteData {
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
  const now = getTimestamp();
  const note: DbNote = {
    noteId: generateUniqueId(),
    userId: user.id,
    noteDefId: data.noteDefId,
    gameId: data.gameId,
    title: data.title,
    createdOn: now,
    updatedOn: now,
  };
  const content: DbNoteContent[] = data.content.map((field) => ({
    noteContentId: generateUniqueId(),
    noteId: note.noteId,
    noteFieldDefId: field.noteFieldDefId,
    value: field.value,
  }));

  await db.transaction(async () => {
    // note
    db.insertOne<DbNote>(sql.createNote, note);

    // contents
    await Promise.all(
      content.map((contentData) =>
        db.insertOne<DbNoteContent>(sql.createNoteContent, contentData)
      )
    );
  });

  return {
    noteId: note.noteId,
  };
}

export async function selectNotes(
  user: UserAuthData,
  noteDefId: DbNoteDefinition['noteDefId'],
  gameId: DbGame['id'],
  page: number = 0
): Promise<Paginated<NoteData>> {
  const db = await getDb();

  // notes
  const paginatedNotes = await db.paginate<NoteData>({
    page,
    rpp: limits.selectUserNotesOfType!.default,
    limit: limits.selectUserNotesOfType!,
    dataSql: sql.selectUserNotesOfType,
    dataParams: { noteDefId, gameId, userId: user.id },
    countSql: sql.countUserNotesOfType,
    countParams: { noteDefId, gameId, userId: user.id },
  });

  // note contents
  const contents = await db.query<NoteContentData>(sql.selectNoteContents, {
    noteIds: paginatedNotes.data.map((note) => note.noteId),
    userId: user.id,
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
  const res = await db.delete(sql.deleteNote, {
    noteId,
    userId: user.id,
  });

  if (!res.affectedRows) {
    throw new Error('No note found to delete or not enough permissions');
  }
}

export async function updateNote(
  user: UserAuthData,
  lastUpdate: DbNote['updatedOn'],
  note: UpdateNoteData
): Promise<UpdateNoteResult> {
  const db = await getDb();
  const updatedOn = getTimestamp();
  const noteId = note.noteId;

  await db.transaction(async () => {
    // update the note
    const noteUpdate = await db.update(sql.updateNote, {
      updatedOn,
      lastUpdate,
      noteId,
      title: note.title,
      userId: user.id,
    });

    if (!noteUpdate.affectedRows) {
      throw new Error(
        'No note found to update, not enough permissions or the note was updated somewhere else'
      );
    }

    // update all the fields
    await Promise.all(
      Object.entries(note.content).map(([noteFieldDefId, value]) => {
        return db.update(sql.updateNoteContent, {
          value,
          noteId,
          noteFieldDefId: Number(noteFieldDefId),
        });
      })
    );
  });

  return { updatedOn };
}
