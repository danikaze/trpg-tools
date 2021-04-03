import { DbInitFunction } from '../../utils/mysql';
import { devUsers } from '../user/mock';
import { createWidgetKey } from '.';
import { devNotes } from '../note/mock';
import { getSystemNoteDefinitions } from '../global';

export const widgetKeyDevData: DbInitFunction = async (db) => {
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

  createWidgetKey(devUsers['user1'], 'charSheet', 'Rungret Sheet', {
    noteId: pcRungretNote.noteId,
  });

  createWidgetKey(devUsers['user1'], 'charStatus', 'Sylna Status', {
    noteId: pcSylnaNote.noteId,
  });
};
