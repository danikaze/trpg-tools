import {
  createNoteDefinition,
  CreateNoteDefinitionData,
  CreateNoteFieldDefinition,
  NoteDefinition,
} from '../../note-definition';
import { SYSTEM_USER } from '../../user';
import { basename } from 'path';
import {
  FIELD_COL_NAME_MAX_LENGTH,
  FIELD_TEXT_MAX_LENGTH,
  NOTE_TYPE_COL_NAME_MAX_LENGTH,
} from '../../../utils/constants';
import { DbInitFunction } from '../../../utils/mysql';
import { EDIT_TIME_COLS, ENUM_TYPE, INTERNAL_ID, PUBLIC_ID } from './constants';

export const systemNoteTypes = {} as Record<
  'locations' | 'npcs',
  NoteDefinition
>;

export const initNoteDefinition: DbInitFunction = async (db) => {
  await initNoteDefinitionTables(db);
  await initNoteDefinitionData(db);
};

const initNoteDefinitionTables: DbInitFunction = async (db) => {
  await Promise.all(
    [
      // Definition of different types of notes (NPCs, Cities, etc.)
      `
      CREATE TABLE IF NOT EXISTS notes_def (
        noteDefId ${PUBLIC_ID} PRIMARY KEY,
        userId ${INTERNAL_ID} NOT NULL,
        name VARCHAR(${NOTE_TYPE_COL_NAME_MAX_LENGTH}) NOT NULL DEFAULT '',
        ${EDIT_TIME_COLS},

        FOREIGN KEY (userId)
          REFERENCES users(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
      `,
      // Definition of fields for a type of note
      `
      CREATE TABLE IF NOT EXISTS notes_fields_def (
        noteFieldDefId ${INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
        noteDefId ${PUBLIC_ID},
        position TINYINT UNSIGNED NOT NULL,
        name VARCHAR(${FIELD_COL_NAME_MAX_LENGTH}) NOT NULL DEFAULT '',
        type ${ENUM_TYPE} NOT NULL,
        options VARCHAR(${FIELD_TEXT_MAX_LENGTH}),

        INDEX position_idx (position),

        FOREIGN KEY (noteDefId)
          REFERENCES notes_def(noteDefId)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
      `,
    ].map(async (sql, i) => {
      db.logger!.debug(`Executing ${basename(__filename)}: ${i}`);
      try {
        await db.execute(sql);
      } catch (e) {
        db.logger!.error(
          `Error while executing ${basename(__filename)}[${i}]`,
          sql,
          (e as Error).message
        );
      }
    })
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
    fieldDescription: {
      name: 'Description',
      type: 'textarea',
    },
    fieldAlignment: {
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
    fieldLocation: {
      name: 'Location',
      type: 'textfield',
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
        systemNoteFieldDefinitions.fieldDescription,
        systemNoteFieldDefinitions.fieldAlignment,
      ],
    },
    npcs: {
      name: 'NPCs',
      fields: [
        systemNoteFieldDefinitions.fieldDescription,
        systemNoteFieldDefinitions.fieldAlignment,
        systemNoteFieldDefinitions.fieldLocation,
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
