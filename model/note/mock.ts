import { NoteDefinition, RetrievedNoteDefinition } from '../note-definition';
import { DbInitFunction } from '../../utils/mysql';
import { User } from '../user';
import { devUsers } from '../user/mock';
import { systemNoteTypes } from '../note-definition/init';
import { createNote } from '.';
import { basename } from 'path';
import { devGames } from '../game/mock';
import { GamePreviewData } from '../game';
import { limits } from './sql';
import { noteDefinitionsDevData } from '../note-definition/mock';

interface NoteDef {
  user: User;
  noteDef: NoteDefinition;
  gameDef: GamePreviewData;
  title: string;
  content: {
    id: RetrievedNoteDefinition['fields'][0]['noteFieldDefId'];
    value: string;
  }[];
}

export const noteDevData: DbInitFunction = async () => {
  function getFieldId(noteDef: NoteDefinition, fieldName: string) {
    const id = noteDef.fields.find((f) => f.name === fieldName)?.noteFieldDefId;
    if (!id) {
      throw new Error(
        `Field ${noteDef.name}.${fieldName} not found in ${basename(
          __filename
        )}`
      );
    }
    return id;
  }

  function getGame(name: string) {
    const game = Object.values(devGames).find((g) => g.name === name);
    if (!game) {
      throw new Error(`Game ${name} not found in ${basename(__filename)}`);
    }
    return game;
  }

  const devNoteDefinitions: NoteDef[] = [
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.npcs,
      gameDef: getGame('Game 1'),
      title: 'Amira Shadowhorn',
      content: [
        {
          id: getFieldId(systemNoteTypes.npcs, 'Description'),
          value: 'Tiefling woman with a pale purple skil tone.',
        },
        {
          id: getFieldId(systemNoteTypes.npcs, 'Alignment'),
          value: 'NN',
        },
        {
          id: getFieldId(systemNoteTypes.npcs, 'Location'),
          value: 'Eseneas',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.npcs,
      gameDef: getGame('Game 1'),
      title: 'Kashak, Kobold Shaman',
      content: [
        {
          id: getFieldId(systemNoteTypes.npcs, 'Alignment'),
          value: 'CE',
        },
        {
          id: getFieldId(systemNoteTypes.npcs, 'Location'),
          value: 'Lewick/Malnia',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.locations,
      gameDef: getGame('Game 1'),
      title: 'Lewick',
      content: [
        {
          id: getFieldId(systemNoteTypes.locations, 'Description'),
          value: 'Farming town close to the Black Forest',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.npcs,
      gameDef: getGame('Game 2'),
      title: 'Grog',
      content: [
        {
          id: getFieldId(systemNoteTypes.npcs, 'Description'),
          value: `Goliath Barbarian`,
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.locations,
      gameDef: getGame('Game 2'),
      title: 'Emon',
      content: [
        {
          id: getFieldId(systemNoteTypes.locations, 'Description'),
          value: `Goliath Barbarian`,
        },
      ],
    },
    {
      user: devUsers.user2,
      noteDef: systemNoteTypes.npcs,
      gameDef: getGame('Game 3'),
      title: 'Placeholder NPC',
      content: [
        {
          id: getFieldId(systemNoteTypes.npcs, 'Description'),
          value: `Emon is the capital city of the kingdom of Tal'Dorei, and the largest city on the continent`,
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: noteDefinitionsDevData.user1note,
      gameDef: getGame('Game 1'),
      title: 'Custom note 1',
      content: [
        {
          id: getFieldId(noteDefinitionsDevData.user1note, 'Text area'),
          value: 'text area value',
        },
        {
          id: getFieldId(noteDefinitionsDevData.user1note, 'Select'),
          value: '1',
        },
        {
          id: getFieldId(noteDefinitionsDevData.user1note, 'Text field'),
          value: 'text field\ntest value',
        },
        {
          id: getFieldId(noteDefinitionsDevData.user1note, 'Int [0-10]'),
          value: '5',
        },
        {
          id: getFieldId(noteDefinitionsDevData.user1note, 'Checkbox'),
          value: 'true',
        },
      ],
    },
  ];

  // push enough note to test pagination
  for (let i = 0; i < limits.selectUserNotesOfType!.default * 2 + 2; i++) {
    devNoteDefinitions.push({
      user: devUsers.user1,
      noteDef: systemNoteTypes.locations,
      gameDef: getGame('Game 2'),
      title: `Test Location ${i}`,
      content: [
        {
          id: getFieldId(systemNoteTypes.locations, 'Description'),
          value: `Description for Test Location ${i}`,
        },
      ],
    });
  }

  await Promise.all(
    devNoteDefinitions.map((note) => {
      return createNote(note.user, {
        noteDefId: note.noteDef.noteDefId,
        gameId: note.gameDef.id,
        title: note.title,
        content: note.content.map((data) => ({
          noteFieldDefId: data.id,
          value: data.value,
        })),
      });
    })
  );
};
