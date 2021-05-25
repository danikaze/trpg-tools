import { DbInitFunction } from '../../utils/mysql';
import { devUsers } from '../user/mock';
import { devNotes } from '../note/mock';
import { systemWidgetDefIds } from '../widget-def/init';
import { getSystemNoteDefinitions } from '../global';
import { createWidgetKey } from '.';

export const widgetKeyDevData: DbInitFunction = async (db) => {
  const systemNoteTypes = await getSystemNoteDefinitions();

  const pcRungretNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Rungret Ironfist'
  );
  const pcSylnaNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Sylna Nask'
  );
  const pcCorneliusNote = devNotes[systemNoteTypes.pcs.noteDefId].find(
    (note) => note.title === 'Cornelius Woodscar'
  );

  if (!pcRungretNote) {
    throw new Error('Required mock data (pcRungretNote) not found');
  }
  if (!pcSylnaNote) {
    throw new Error('Required mock data (pcSylnaNote) not found');
  }
  if (!pcCorneliusNote) {
    throw new Error('Required mock data (pcCorneliusNote) not found');
  }

  createWidgetKey(
    devUsers['user1'],
    systemWidgetDefIds.charSheet,
    'Rungret Sheet',
    {
      noteId: pcRungretNote.noteId,
    }
  );

  createWidgetKey(devUsers['user1'], systemWidgetDefIds.charHp, 'Sylna HP', {
    noteId: pcSylnaNote.noteId,
  });

  createWidgetKey(
    devUsers['user1'],
    systemWidgetDefIds.charStatusBorders,
    'Cornelius Borders',
    {
      noteId: pcCorneliusNote.noteId,
    }
  );
};
