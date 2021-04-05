import { NoteDefinition } from '../note-definition';
import { DbInitFunction } from '../../utils/mysql';
import { UserAuthData } from '../user';
import { devUsers } from '../user/mock';
import { CreatedNoteData, createNote, CreateNoteData } from '.';
import { basename } from 'path';
import { devGames } from '../game/mock';
import { GamePreviewData } from '../game';
import { getSystemNoteDefinitions } from '../global';
import { noteDefinitionsDevData } from '../note-definition/mock';
import {
  NOTE_DEF_FIELD_NAME_DESCRIPTION,
  NOTE_DEF_FIELD_NAME_ALIGNMENT,
  NOTE_DEF_FIELD_NAME_LOCATION,
  NOTE_DEF_FIELD_NAME_RACE,
  NOTE_DEF_FIELD_NAME_CLASS,
  NOTE_DEF_FIELD_NAME_LEVEL,
  NOTE_DEF_FIELD_NAME_HP,
  NOTE_DEF_FIELD_NAME_HP_MAX,
  NOTE_DEF_FIELD_NAME_STRENGTH,
  NOTE_DEF_FIELD_NAME_DEXTERITY,
  NOTE_DEF_FIELD_NAME_CONSTITUTION,
  NOTE_DEF_FIELD_NAME_INTELLIGENCE,
  NOTE_DEF_FIELD_NAME_WISDOM,
  NOTE_DEF_FIELD_NAME_CHARISMA,
  NOTE_DEF_FIELD_NAME_AC,
  NOTE_DEF_FIELD_NAME_IMAGE,
} from '../note-definition/init';
import { devImages } from '../image/mock';

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
      const file = `${basename(__dirname)}/${basename(__filename)}`;
      throw new Error(
        `Field ${noteDef.name}.${fieldName} not found in ${file}`
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

  const systemNoteDefinitions = await getSystemNoteDefinitions();
  const devNoteDefinitions: NoteDef[] = [
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.npcs,
      gameDef: getGame('Game 1'),
      title: 'Amira Shadowhorn',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
          value: 'Tiefling woman with a pale purple skil tone.',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'NN',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LOCATION,
          value: 'Eseneas',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.npcs,
      gameDef: getGame('Game 1'),
      title: 'Kashak, Kobold Shaman',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'CE',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LOCATION,
          value: 'Lewick/Malnia',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.locations,
      gameDef: getGame('Game 1'),
      title: 'Lewick',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
          value: 'Farming town close to the Black Forest',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.npcs,
      gameDef: getGame('Game 2'),
      title: 'Grog',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
          value: `Goliath Barbarian`,
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.locations,
      gameDef: getGame('Game 2'),
      title: 'Emon',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
          value: `Goliath Barbarian`,
        },
      ],
    },
    {
      user: devUsers.user2,
      noteDef: systemNoteDefinitions.npcs,
      gameDef: getGame('Game 3'),
      title: 'Placeholder NPC',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
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
      noteDef: systemNoteDefinitions.pcs,
      gameDef: getGame('Game 1'),
      title: 'Rungret Ironfist',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_IMAGE,
          value: String(devImages['rungret'].imageId),
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'LG',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_RACE,
          value: 'dwarf',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CLASS,
          value: 'cleric',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LEVEL,
          value: '2',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP,
          value: '15',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP_MAX,
          value: '15',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_STRENGTH,
          value: '12',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DEXTERITY,
          value: '8',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CONSTITUTION,
          value: '13',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_INTELLIGENCE,
          value: '10',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_WISDOM,
          value: '18',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CHARISMA,
          value: '14',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_AC,
          value: '18',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.pcs,
      gameDef: getGame('Game 1'),
      title: 'Ghorax Alxiac',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'LG',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_RACE,
          value: 'dragonborn',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CLASS,
          value: 'monk',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LEVEL,
          value: '2',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP,
          value: '12',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP_MAX,
          value: '12',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.pcs,
      gameDef: getGame('Game 1'),
      title: 'Cornelius Woodscar',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'CG',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_RACE,
          value: 'aasimar',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CLASS,
          value: 'paladin',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LEVEL,
          value: '2',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP,
          value: '16',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP_MAX,
          value: '16',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.pcs,
      gameDef: getGame('Game 1'),
      title: 'Sylna Nask',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'NG',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_RACE,
          value: 'half-elf',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CLASS,
          value: 'druid',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LEVEL,
          value: '2',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP,
          value: '15',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP_MAX,
          value: '15',
        },
      ],
    },
    {
      user: devUsers.user1,
      noteDef: systemNoteDefinitions.pcs,
      gameDef: getGame('Game 1'),
      title: 'Indar',
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_ALIGNMENT,
          value: 'CG',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_RACE,
          value: 'half-elf',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_CLASS,
          value: 'rogue',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_LEVEL,
          value: '2',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP,
          value: '19',
        },
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_HP_MAX,
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
      noteDef: systemNoteDefinitions.locations,
      gameDef: getGame('Game 2'),
      title: `Test Location ${i}`,
      content: [
        {
          noteFieldName: NOTE_DEF_FIELD_NAME_DESCRIPTION,
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
