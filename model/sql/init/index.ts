import { DbInitFunction, InitDbOptions } from '../../../utils/mysql';

import { initUser } from './user';
import { initImage } from './image';
import { initGame } from './game';
import { initNoteDefinition } from './note-definition';
import { initNote } from './note';
import { userDevData } from './mock/user';
import { gameDevData } from './mock/game';
import { noteDefinitionDevData } from './mock/note-definition';
import { noteDevData } from './mock/note';

const init: DbInitFunction = async (db) => {
  await initUser(db);
  await initImage(db);
  await initGame(db);
  await initNoteDefinition(db);
  await initNote(db);

  if (IS_PRODUCTION) return;

  db.logger && db.logger.debug('Inserting Dev Data into the database...');
  await userDevData(db);
  await gameDevData(db);
  await noteDefinitionDevData(db);
  await noteDevData(db);
  db.logger && db.logger.debug('Dev Data done!');
};

/**
 * List of updates and migrations to do in the database between versions
 * `{N: callback}` meaning: callback to be called when updating TO version N
 */
export const dbUpdates: InitDbOptions['updates'] = {
  1: init,
};
