import { DbInitFunction } from '../../utils/mysql';
import { devUsers } from '../user/mock';
import { devNotes } from '../note/mock';
import { systemWidgetDefIds } from '../widget-def/init';
import { getSystemNoteDefinitions } from '../global';
import { createWidgetKey } from '.';

export const widgetKeyDevData: DbInitFunction = async (db) => {
  const systemNoteTypes = await getSystemNoteDefinitions();
  const findNote = (title: string) => {
    const note = devNotes[systemNoteTypes.pcs.noteDefId].find(
      (note) => note.title === title
    );
    if (!note) {
      throw new Error(`Couldn't found mock note with title "${title}"`);
    }
    return note;
  };

  const pcNotes = [
    findNote('Ghorax Alxiac'),
    findNote('Cornelius Woodscar'),
    findNote('Sylna Nask'),
    findNote('Rungret Ironfist'),
    findNote('Indar'),
  ];
  const widgetDefs = [
    { name: 'Sheet', id: systemWidgetDefIds.charSheet },
    { name: 'HP', id: systemWidgetDefIds.charHp },
    { name: 'Borders', id: systemWidgetDefIds.charStatusBorders },
  ];

  widgetDefs.forEach((def) => {
    pcNotes.forEach((note) => {
      const keyName = `${note.title.split(' ')[0]}: ${def.name}`;
      createWidgetKey(devUsers['user1'], def.id, keyName, {
        noteId: note.noteId,
      });
    });
  });
};
