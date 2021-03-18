import { basename } from 'path';
import {
  createNoteDefinition,
  CreateNoteDefinitionData,
  CreateNoteFieldDefinition,
  NoteDefinition,
} from '.';
import { SYSTEM_USER } from '../user';
import {
  FIELD_COL_NAME_MAX_LENGTH,
  FIELD_TEXT_MAX_LENGTH,
  NOTE_TYPE_COL_NAME_MAX_LENGTH,
} from '../../utils/constants';
import { DbInitFunction } from '../../utils/mysql';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '../constants/sql';

export const systemNoteTypes = {} as Record<
  'locations' | 'npcs' | 'pcs',
  NoteDefinition
>;

export const initNoteDefinition: DbInitFunction = async (db) => {
  await initNoteDefinitionTables(db);
  await initNoteDefinitionData(db);
};

const initNoteDefinitionTables: DbInitFunction = async (db) => {
  const sql = [
    // Definition of different types of notes (NPCs, Cities, etc.)
    `
    CREATE TABLE IF NOT EXISTS notes_def (
      noteDefId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      name VARCHAR(${NOTE_TYPE_COL_NAME_MAX_LENGTH}) NOT NULL DEFAULT '',
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
    // Definition of fields for a type of note
    `
    CREATE TABLE IF NOT EXISTS notes_fields_def (
      noteFieldDefId ${MYSQL_TYPE_INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
      noteDefId ${MYSQL_TYPE_PUBLIC_ID},
      position TINYINT UNSIGNED NOT NULL,
      name VARCHAR(${FIELD_COL_NAME_MAX_LENGTH}) NOT NULL DEFAULT '',
      type ${MYSQL_TYPE_ENUM} NOT NULL,
      options VARCHAR(${FIELD_TEXT_MAX_LENGTH}),

      INDEX position_idx (position),

      FOREIGN KEY (noteDefId)
        REFERENCES notes_def(noteDefId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};

const initNoteDefinitionData: DbInitFunction = async () => {
  /**
   * Descriptions for the fields used in the system note types
   */
  const systemNoteFieldDefinitions: Record<
    string,
    CreateNoteFieldDefinition
  > = {
    description: {
      name: 'Description',
      type: 'textarea',
    },
    alignment: {
      name: 'Alignment',
      type: 'select',
      options: {
        required: false,
        options: [
          { value: 'LG', label: 'Lawful-Good' },
          { value: 'NG', label: 'Neutral-Good' },
          { value: 'CG', label: 'Chaotic-Good' },
          { value: 'LN', label: 'Lawful-Neutral' },
          { value: 'NN', label: 'Neutral-Neutral' },
          { value: 'CN', label: 'Chaotic-Neutral' },
          { value: 'LE', label: 'Lawful-Evil' },
          { value: 'NE', label: 'Neutral-Evil' },
          { value: 'CE', label: 'Chaotic-Evil' },
        ],
      },
    },
    location: {
      name: 'Location',
      type: 'textfield',
    },
    charRace: {
      name: 'Race',
      type: 'select',
      options: {
        options: [
          // PHB
          { value: 'dwarf', label: 'Dwarf' },
          { value: 'elf', label: 'Elf' },
          { value: 'halfling', label: 'Halfling' },
          { value: 'human', label: 'Human' },
          { value: 'dragonborn', label: 'Dragonborn' },
          { value: 'gnome', label: 'Gnome' },
          { value: 'half-elf', label: 'Half-Elf' },
          { value: 'half-orc', label: 'Half-Orc' },
          { value: 'tiefling', label: 'Tiefling' },
          // VOLO
          { value: 'aasimar', label: 'Aasimar' },
          { value: 'firbolg', label: 'Firbolg' },
          { value: 'goliath', label: 'Goliath' },
          { value: 'kenku', label: 'Kenku' },
          { value: 'lizardfolk', label: 'Lizardfolk' },
          { value: 'tabaxi', label: 'Tabaxi' },
          { value: 'triton', label: 'Triton' },
        ],
      },
    },
    charClass: {
      name: 'Class',
      type: 'select',
      options: {
        options: [
          // TASHA
          { value: 'artificer', label: 'Artificer' },
          // PHB
          { value: 'barbarian', label: 'Barbarian' },
          { value: 'bard', label: 'Bard' },
          { value: 'cleric', label: 'Cleric' },
          { value: 'druid', label: 'Druid' },
          { value: 'fighter', label: 'Fighter' },
          { value: 'monk', label: 'Monk' },
          { value: 'paladin', label: 'Paladin' },
          { value: 'ranger', label: 'Ranger' },
          { value: 'rogue', label: 'Rogue' },
          { value: 'sorcerer', label: 'Sorcerer' },
          { value: 'warlock', label: 'Warlock' },
          { value: 'wizard', label: 'Wizard' },
        ],
      },
    },
    charLevel: {
      name: 'Level',
      type: 'int',
      options: {
        min: 1,
        max: 20,
      },
    },
    charHp: {
      name: 'Hit Points',
      type: 'int',
    },
    charMaxHp: {
      name: 'Max Hit Points',
      type: 'int',
    },
    tempHp: {
      name: 'Temporary Hit Points',
      type: 'int',
    },
    strength: {
      name: 'Strength',
      type: 'int',
    },
    dexterity: {
      name: 'Dexterity',
      type: 'int',
    },
    constitution: {
      name: 'Constitution',
      type: 'int',
    },
    intelligence: {
      name: 'Intelligence',
      type: 'int',
    },
    wisdom: {
      name: 'Wisdom',
      type: 'int',
    },
    charisma: {
      name: 'Charisma',
      type: 'int',
    },
    armorClass: {
      name: 'ArmorClass',
      type: 'int',
    },
  };

  /**
   * Descriptions for the system note types
   */
  const systemNoteTypeDefinitions: Record<
    keyof typeof systemNoteTypes,
    CreateNoteDefinitionData
  > = {
    locations: {
      name: 'Locations',
      fields: [
        systemNoteFieldDefinitions.description,
        systemNoteFieldDefinitions.alignment,
      ],
    },
    npcs: {
      name: 'NPCs',
      fields: [
        systemNoteFieldDefinitions.description,
        systemNoteFieldDefinitions.alignment,
        systemNoteFieldDefinitions.location,
      ],
    },
    pcs: {
      name: 'PCs',
      fields: [
        systemNoteFieldDefinitions.alignment,
        systemNoteFieldDefinitions.charRace,
        systemNoteFieldDefinitions.charClass,
        systemNoteFieldDefinitions.charLevel,
        systemNoteFieldDefinitions.charHp,
        systemNoteFieldDefinitions.charMaxHp,
        systemNoteFieldDefinitions.tempHp,
        systemNoteFieldDefinitions.strength,
        systemNoteFieldDefinitions.dexterity,
        systemNoteFieldDefinitions.constitution,
        systemNoteFieldDefinitions.intelligence,
        systemNoteFieldDefinitions.wisdom,
        systemNoteFieldDefinitions.charisma,
        systemNoteFieldDefinitions.armorClass,
      ],
    },
  };

  await Promise.all(
    Object.entries(systemNoteTypeDefinitions).map(async ([key, def]) => {
      const note = await createNoteDefinition(SYSTEM_USER, def);
      systemNoteTypes[key as keyof typeof systemNoteTypes] = note;
    })
  );
};
