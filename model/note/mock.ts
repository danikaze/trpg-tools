import { NoteDefinition, RetrievedNoteDefinition } from '../note-definition';
import { DbInitFunction } from '../../utils/mysql';
import { UserAuthData } from '../user';
import { devUsers } from '../user/mock';
import { systemNoteTypes } from '../note-definition/init';
import { createNote } from '.';
import { basename } from 'path';
import { devGames } from '../game/mock';
import { GamePreviewData } from '../game';
import { noteDefinitionsDevData } from '../note-definition/mock';

interface NoteDef {
  user: UserAuthData;
  noteDef: NoteDefinition;
  gameDef: GamePreviewData;
  title: string;
  content: {
    noteFieldDefId: RetrievedNoteDefinition['fields'][0]['noteFieldDefId'];
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
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Description'),
          value: 'Tiefling woman with a pale purple skil tone.',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Alignment'),
          value: 'NN',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Location'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Alignment'),
          value: 'CE',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Location'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.locations, 'Description'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Description'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.locations, 'Description'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.npcs, 'Description'),
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
          noteFieldDefId: getFieldId(
            noteDefinitionsDevData.user1note,
            'Text area'
          ),
          value: 'text area value',
        },
        {
          noteFieldDefId: getFieldId(
            noteDefinitionsDevData.user1note,
            'Select'
          ),
          value: '1',
        },
        {
          noteFieldDefId: getFieldId(
            noteDefinitionsDevData.user1note,
            'Text field'
          ),
          value: 'text field\ntest value',
        },
        {
          noteFieldDefId: getFieldId(
            noteDefinitionsDevData.user1note,
            'Int [0-10]'
          ),
          value: '5',
        },
        {
          noteFieldDefId: getFieldId(
            noteDefinitionsDevData.user1note,
            'Checkbox'
          ),
          value: 'true',
        },
      ],
    },
  ];

  // push enough note to test pagination
  const N_NOTES = 55;
  for (let i = 0; i < N_NOTES; i++) {
    devNoteDefinitions.push({
      user: devUsers.user1,
      noteDef: systemNoteTypes.locations,
      gameDef: getGame('Game 2'),
      title: `Test Location ${i}`,
      content: [
        {
          noteFieldDefId: getFieldId(systemNoteTypes.locations, 'Description'),
          value: `Description for Test Location ${i}`,
        },
      ],
    });
  }

  await Promise.all(
    devNoteDefinitions.map((note) => {
      return createNote(note.user, {
        noteDefId: note.noteDef.noteDefId,
        gameId: note.gameDef.gameId,
        title: note.title,
        content: note.content.map((data) => ({
          noteFieldDefId: data.noteFieldDefId,
          value: data.value,
        })),
      });
    })
  );
};
