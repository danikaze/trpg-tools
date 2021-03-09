import { DbInitFunction, InitDbOptions } from '../utils/mysql';

import { initUser } from './user/init';
import { initImage } from './image/init';
import { initGame } from './game/init';
import { initNoteDefinition } from './note-definition/init';
import { initNote } from './note/init';

import { userDevData } from './user/mock';
import { gameDevData } from './game/mock';
import { noteDefinitionDevData } from './note-definition/mock';
import { noteDevData } from './note/mock';

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
