import { basename } from 'path';
import {
  createNoteDefinition,
  CreateNoteDefinitionData,
  CreateNoteFieldDefinition,
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

export const NOTE_DEFINITION_NAME_PCS = 'PCs';
export const NOTE_DEFINITION_NAME_NPCS = 'NPCs';
export const NOTE_DEFINITION_NAME_LOCATIONS = 'Locations';

export const NOTE_DEF_FIELD_NAME_IMAGE = 'Image';
export const NOTE_DEF_FIELD_NAME_DESCRIPTION = 'Description';
export const NOTE_DEF_FIELD_NAME_ALIGNMENT = 'Alignment';
export const NOTE_DEF_FIELD_NAME_LOCATION = 'Location';
export const NOTE_DEF_FIELD_NAME_RACE = 'Race';
export const NOTE_DEF_FIELD_NAME_CLASS = 'Class';
export const NOTE_DEF_FIELD_NAME_LEVEL = 'Level';
export const NOTE_DEF_FIELD_NAME_HP = 'Hit Points';
export const NOTE_DEF_FIELD_NAME_HP_MAX = 'Max Hit Points';
export const NOTE_DEF_FIELD_NAME_HP_TEMP = 'Temporary Hit Points';
export const NOTE_DEF_FIELD_NAME_STRENGTH = 'Strength';
export const NOTE_DEF_FIELD_NAME_DEXTERITY = 'Dexterity';
export const NOTE_DEF_FIELD_NAME_CONSTITUTION = 'Constitution';
export const NOTE_DEF_FIELD_NAME_INTELLIGENCE = 'Intelligence';
export const NOTE_DEF_FIELD_NAME_WISDOM = 'Wisdom';
export const NOTE_DEF_FIELD_NAME_CHARISMA = 'Charisma';
export const NOTE_DEF_FIELD_NAME_AC = 'Armor Class';

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
    image: {
      name: NOTE_DEF_FIELD_NAME_IMAGE,
      type: 'image',
    },
    description: {
      name: NOTE_DEF_FIELD_NAME_DESCRIPTION,
      type: 'textarea',
    },
    alignment: {
      name: NOTE_DEF_FIELD_NAME_ALIGNMENT,
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
      name: NOTE_DEF_FIELD_NAME_LOCATION,
      type: 'textfield',
    },
    charRace: {
      name: NOTE_DEF_FIELD_NAME_RACE,
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
      name: NOTE_DEF_FIELD_NAME_CLASS,
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
      name: NOTE_DEF_FIELD_NAME_LEVEL,
      type: 'int',
      options: {
        min: 1,
        max: 20,
      },
    },
    charHp: {
      name: NOTE_DEF_FIELD_NAME_HP,
      type: 'int',
    },
    charMaxHp: {
      name: NOTE_DEF_FIELD_NAME_HP_MAX,
      type: 'int',
    },
    tempHp: {
      name: NOTE_DEF_FIELD_NAME_HP_TEMP,
      type: 'int',
    },
    strength: {
      name: NOTE_DEF_FIELD_NAME_STRENGTH,
      type: 'int',
    },
    dexterity: {
      name: NOTE_DEF_FIELD_NAME_DEXTERITY,
      type: 'int',
    },
    constitution: {
      name: NOTE_DEF_FIELD_NAME_CONSTITUTION,
      type: 'int',
    },
    intelligence: {
      name: NOTE_DEF_FIELD_NAME_INTELLIGENCE,
      type: 'int',
    },
    wisdom: {
      name: NOTE_DEF_FIELD_NAME_WISDOM,
      type: 'int',
    },
    charisma: {
      name: NOTE_DEF_FIELD_NAME_CHARISMA,
      type: 'int',
    },
    armorClass: {
      name: NOTE_DEF_FIELD_NAME_AC,
      type: 'int',
    },
  };

  /**
   * Descriptions for the system note types
   */
  const systemNoteTypeDefinitions: CreateNoteDefinitionData[] = [
    {
      name: NOTE_DEFINITION_NAME_LOCATIONS,
      fields: [
        systemNoteFieldDefinitions.description,
        systemNoteFieldDefinitions.alignment,
      ],
    },
    {
      name: NOTE_DEFINITION_NAME_NPCS,
      fields: [
        systemNoteFieldDefinitions.image,
        systemNoteFieldDefinitions.description,
        systemNoteFieldDefinitions.alignment,
        systemNoteFieldDefinitions.location,
      ],
    },
    {
      name: NOTE_DEFINITION_NAME_PCS,
      fields: [
        systemNoteFieldDefinitions.image,
        systemNoteFieldDefinitions.description,
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
  ];

  await Promise.all(
    Object.values(systemNoteTypeDefinitions).map((def) =>
      createNoteDefinition(SYSTEM_USER, def)
    )
  );
};
