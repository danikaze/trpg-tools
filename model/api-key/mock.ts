import { DbInitFunction } from '@utils/mysql';
import { devUsers } from '@model/user/mock';
import { devNotes } from '@model/note/mock';
import { getSystemNoteDefinitions } from '@model/global';
import { createApiKey } from '.';

export const apiKeyDevData: DbInitFunction = async (db) => {
  const systemNoteTypes = await getSystemNoteDefinitions();

  const pcRungretNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Rungret Ironfist'
  );
  const pcSylnaNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Sylna Nask'
  );

  if (!pcRungretNote) {
    throw new Error('Required mock data (pcRungretNote) not found');
  }
  if (!pcSylnaNote) {
    throw new Error('Required mock data (pcSylnaNote) not found');
  }

  createApiKey(devUsers['user1'], 'updateNote', {
    noteId: pcRungretNote.noteId,
    noteDefId: pcRungretNote.noteDef.noteDefId,
  });

  createApiKey(devUsers['user1'], 'selectNote', {
    noteId: pcSylnaNote.noteId,
  });
};
