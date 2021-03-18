import { NoteDefinition, RetrievedNoteDefinition } from '../note-definition';
import { DbInitFunction } from '../../utils/mysql';
import { UserAuthData } from '../user';
import { devUsers } from '../user/mock';
import { systemNoteTypes } from '../note-definition/init';
import { CreatedNoteData, createNote } from '.';
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
    {
      user: devUsers.user1,
      noteDef: systemNoteTypes.pcs,
      gameDef: getGame('Game 1'),
      title: 'Rungret Ironfist',
      content: [
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Alignment'),
          value: 'LG',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Race'),
          value: 'dwarf',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Class'),
          value: 'cleric',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Level'),
          value: '2',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Hit Points'),
          value: '15',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Max Hit Points'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Alignment'),
          value: 'LG',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Race'),
          value: 'dragonborn',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Class'),
          value: 'monk',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Level'),
          value: '2',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Hit Points'),
          value: '12',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Max Hit Points'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Alignment'),
          value: 'CG',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Race'),
          value: 'aasimar',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Class'),
          value: 'paladin',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Level'),
          value: '2',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Hit Points'),
          value: '16',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Max Hit Points'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Alignment'),
          value: 'NG',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Race'),
          value: 'half-elf',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Class'),
          value: 'druid',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Level'),
          value: '2',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Hit Points'),
          value: '15',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Max Hit Points'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Alignment'),
          value: 'CG',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Race'),
          value: 'half-elf',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Class'),
          value: 'rogue',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Level'),
          value: '2',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Hit Points'),
          value: '19',
        },
        {
          noteFieldDefId: getFieldId(systemNoteTypes.pcs, 'Max Hit Points'),
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
          noteFieldDefId: getFieldId(systemNoteTypes.locations, 'Description'),
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
        content: note.content.map((data) => ({
          noteFieldDefId: data.noteFieldDefId,
          value: data.value,
        })),
      });
    })
  );

  notes.forEach(({ noteId }, i) => {
    const fullNote = { ...devNoteDefinitions[i], noteId };
    if (!devNotes[fullNote.noteDef.noteDefId]) {
      devNotes[fullNote.noteDef.noteDefId] = [];
    }
    devNotes[fullNote.noteDef.noteDefId].push(fullNote);
  });
};
