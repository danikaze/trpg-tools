import { Paginated } from '@utils/mysql';
import { generateUniqueId, getDb, getTimestamp } from '@utils/db';
import { TimestampTable } from '@model/interfaces';
import { DbGame } from '@model/game/sql';
import { DbNoteDefinition } from '@model/note-definition/sql';
import { UserAuthData } from '@model/user';
import { selectGameNames } from '@model/game';
import { getImageFields, getNoteDefinitionNames } from '@model/note-definition';
import { getThumbnails } from '@model/image';
import { DbNote, DbNoteContent, sql } from './sql';

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

export interface NotesByGameData {
  [gameId: string]: {
    gameId: DbGame['gameId'];
    name: DbGame['name'];
    defs: {
      [defId: string]: {
        name: DbNoteDefinition['name'];
        notes: {
          noteId: DbNote['noteId'];
          title: DbNote['title'];
        }[];
      };
    };
  };
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

  // get the list of image fields
  const imageFieldIds = await getImageFields([note.noteDefId]);
  const imageIds = contents.reduce((list, content) => {
    if (imageFieldIds.includes(content.noteFieldDefId) && content.value) {
      list.push(Number(content.value));
    }
    return list;
  }, [] as number[]);

  // get image data (urls)
  const images = await getThumbnails(['noteThumb'], imageIds);

  return {
    noteId: note.noteId,
    title: note.title,
    createdOn: note.createdOn,
    updatedOn: note.updatedOn,
    content: contents.reduce((content, field) => {
      const image =
        imageFieldIds.includes(field.noteFieldDefId) && images[field.value];
      // if the field was an image use the url,
      // if not, use the original value
      content[field.noteFieldDefId] = image ? image['noteThumb']! : field.value;
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

  // get the list of image fields
  const imageFieldIds = await getImageFields([noteDefId]);
  const imageIds = contents.reduce((list, content) => {
    if (imageFieldIds.includes(content.noteFieldDefId) && content.value) {
      list.push(Number(content.value));
    }
    return list;
  }, [] as number[]);
  // get image data (urls)
  const images = await getThumbnails(['noteThumb'], imageIds);

  // create output
  const contentsByNoteId = contents.reduce(
    (res, content) => {
      const image =
        imageFieldIds.includes(content.noteFieldDefId) && images[content.value];
      // if the field was an image use the url,
      // if not, use the original value
      res[content.noteId][content.noteFieldDefId] = image
        ? image['noteThumb']!
        : content.value;
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

export async function selectAllUserNotesByType(
  user: UserAuthData,
  noteDefIds: DbNote['noteDefId'][]
): Promise<NotesByGameData> {
  const db = await getDb();

  // noteDefinitions
  const noteDefNames = await getNoteDefinitionNames(user, noteDefIds);

  // notes
  const notes = await sql.selectUserNotesOfTypeByGame(db, {
    noteDefIds,
    userId: user.userId,
  });

  // game names
  const gameIds = notes.reduce((res, note) => {
    if (!res.includes(note.gameId)) {
      res.push(note.gameId);
    }
    return res;
  }, [] as DbNote['gameId'][]);
  const gameNames = await selectGameNames(user, gameIds);

  // combine result
  const res = notes.reduce((res, note) => {
    let game = res[note.gameId];
    if (!game) {
      game = res[note.gameId] = {
        name: gameNames[note.gameId],
        gameId: note.gameId,
        defs: {},
      };
    }

    let noteDef = game.defs[note.noteDefId];
    if (!noteDef) {
      noteDef = game.defs[note.noteDefId] = {
        name: noteDefNames[note.noteDefId],
        notes: [],
      };
    }
    noteDef.notes.push({
      noteId: note.noteId,
      title: note.title,
    });

    return res;
  }, {} as NotesByGameData);

  return res;
}

export async function deleteNote(
  user: UserAuthData,
  noteId: DbNote['noteId']
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
