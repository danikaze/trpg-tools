import { NoteDefinition } from '../note-definition';
import { DbInitFunction } from '../../utils/mysql';
import { UserAuthData } from '../user';
import { devUsers } from '../user/mock';
import { systemNoteTypes } from '../note-definition/init';
import { CreatedNoteData, createNote, CreateNoteData } from '.';
import { basename } from 'path';
import { devGames } from '../game/mock';
import { GamePreviewData } from '../game';
import { noteDefinitionsDevData } from '../note-definition/mock';

export const devNotes: {
  [noteDefId: string]: (NoteDef & CreatedNoteData)[];
} = {};

interface NoteDef {
  user: UserAuthData;
  noteDef: NoteDefinition;
  gameDef: GamePreviewData;
  title: string;
  content: {
    noteFieldName: string;
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
          noteFieldName: 'Description',
          value: 'Tiefling woman with a pale purple skil tone.',
        },
        {
          noteFieldName: 'Alignment',
          value: 'NN',
        },
        {
          noteFieldName: 'Location',
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
          noteFieldName: 'Alignment',
          value: 'CE',
        },
        {
          noteFieldName: 'Location',
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
          noteFieldName: 'Description',
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
          noteFieldName: 'Description',
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
          noteFieldName: 'Description',
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
          noteFieldName: 'Description',
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
          noteFieldName: 'Text area',
          value: 'text area value',
        },
        {
          noteFieldName: 'Select',
          value: '1',
        },
        {
          noteFieldName: 'Text field',
          value: 'text field\ntest value',
        },
        {
          noteFieldName: 'Int [0-10]',
          value: '5',
        },
        {
          noteFieldName: 'Checkbox',
          value: 'true',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Rungret Ironfist',
      content: [
        {
          noteFieldName: 'Alignment',
          value: 'LG',
        },
        {
          noteFieldName: 'Race',
          value: 'dwarf',
        },
        {
          noteFieldName: 'Class',
          value: 'cleric',
        },
        {
          noteFieldName: 'Level',
          value: '2',
        },
        {
          noteFieldName: 'Hit Points',
          value: '15',
        },
        {
          noteFieldName: 'Max Hit Points',
          value: '15',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Ghorax Alxiac',
      content: [
        {
          noteFieldName: 'Alignment',
          value: 'LG',
        },
        {
          noteFieldName: 'Race',
          value: 'dragonborn',
        },
        {
          noteFieldName: 'Class',
          value: 'monk',
        },
        {
          noteFieldName: 'Level',
          value: '2',
        },
        {
          noteFieldName: 'Hit Points',
          value: '12',
        },
        {
          noteFieldName: 'Max Hit Points',
          value: '12',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Cornelius Woodscar',
      content: [
        {
          noteFieldName: 'Alignment',
          value: 'CG',
        },
        {
          noteFieldName: 'Race',
          value: 'aasimar',
        },
        {
          noteFieldName: 'Class',
          value: 'paladin',
        },
        {
          noteFieldName: 'Level',
          value: '2',
        },
        {
          noteFieldName: 'Hit Points',
          value: '16',
        },
        {
          noteFieldName: 'Max Hit Points',
          value: '16',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Sylna Nask',
      content: [
        {
          noteFieldName: 'Alignment',
          value: 'NG',
        },
        {
          noteFieldName: 'Race',
          value: 'half-elf',
        },
        {
          noteFieldName: 'Class',
          value: 'druid',
        },
        {
          noteFieldName: 'Level',
          value: '2',
        },
        {
          noteFieldName: 'Hit Points',
          value: '15',
        },
        {
          noteFieldName: 'Max Hit Points',
          value: '15',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Indar',
      content: [
        {
          noteFieldName: 'Alignment',
          value: 'CG',
        },
        {
          noteFieldName: 'Race',
          value: 'half-elf',
        },
        {
          noteFieldName: 'Class',
          value: 'rogue',
        },
        {
          noteFieldName: 'Level',
          value: '2',
        },
        {
          noteFieldName: 'Hit Points',
          value: '19',
        },
        {
          noteFieldName: 'Max Hit Points',
          value: '19',
        },
      ],
    },
  ];

  // push enough notes to test pagination
  const N_NOTES = 55;
  for (let i = 0; i < N_NOTES; i++) {
    devNoteDefinitions.push({
      user: devUsers.user1,
      noteDef: systemNoteTypes.locations,
      gameDef: getGame('Game 2'),
      title: `Test Location ${i}`,
      content: [
        {
          noteFieldName: 'Description',
          value: `Description for Test Location ${i}`,
        },
      ],
    });
  }

  const notes = await Promise.all(
    devNoteDefinitions.map((note) => {
      return createNote(note.user, {
        noteDefId: note.noteDef.noteDefId,
        gameId: note.gameDef.gameId,
        title: note.title,
        content: note.content.reduce((content, { noteFieldName, value }) => {
          const noteFieldDefId = getFieldId(note.noteDef, noteFieldName);
          content[noteFieldDefId] = value;
          return content;
        }, {} as CreateNoteData['content']),
      });
    })
  );

  notes.forEach((newNoteData, i) => {
    const fullNote = { ...devNoteDefinitions[i], ...newNoteData };
    if (!devNotes[fullNote.noteDef.noteDefId]) {
      devNotes[fullNote.noteDef.noteDefId] = [];
    }
    devNotes[fullNote.noteDef.noteDefId].push(fullNote);
  });
};
