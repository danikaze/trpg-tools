import { DbInitFunction } from '../../utils/mysql';
import { systemNoteTypes } from '../note-definition/init';
import { devUsers } from '../user/mock';
import { createApiKey } from '.';
import { devNotes } from '../note/mock';

export const apiKeyDevData: DbInitFunction = async (db) => {
  const pcRungretNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Rungret Ironfist'
  );

  if (!pcRungretNote) {
    throw new Error('Required mock data (pcRungretNote) not found');
  }

  const CHAR_NOTE_DEF_ID = pcRungretNote.noteDef.noteDefId;
  const NOTE_ID = pcRungretNote.noteId;

  createApiKey(devUsers['user1'], 'updateNote', {
    noteId: NOTE_ID,
    noteDefId: CHAR_NOTE_DEF_ID,
  });
};
