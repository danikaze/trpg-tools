import { DbInitFunction } from '../../utils/mysql';
import {
  createNoteDefinition,
  CreateNoteDefinitionData,
  CreateNoteFieldDefinition,
  NoteDefinition,
} from '.';
import { devUsers } from '../user/mock';

export const noteDefinitionsDevData = {} as Record<'user1note', NoteDefinition>;

export const noteDefinitionDevData: DbInitFunction = async () => {
  /**
   * Descriptions for the fields used in the dev data
   */
  const fields: Record<string, CreateNoteFieldDefinition> = {
    fieldTextArea: {
      name: 'Text area',
      type: 'textarea',
    },
    fieldSelect: {
      name: 'Select',
      type: 'select',
      options: {
        required: true,
        options: [
          { value: '1', label: 'Value 1' },
          { value: '2', label: 'Value 2' },
          { value: '3', label: 'Value 3' },
        ],
      },
    },
    fieldTextfield: {
      name: 'Text field',
      type: 'textfield',
    },
    fieldInt: {
      name: 'Int [0-10]',
      type: 'int',
      options: {
        min: 0,
        max: 10,
      },
    },
    fieldCheckbox: {
      name: 'Checkbox',
      type: 'checkbox',
    },
  };

  /**
   * Descriptions for the dev note types
   */
  const systemNoteTypeDefinitions: Record<
    keyof typeof noteDefinitionsDevData,
    CreateNoteDefinitionData
  > = {
    user1note: {
      name: 'User 1 custom',
      fields: [
        fields.fieldTextArea,
        fields.fieldSelect,
        fields.fieldTextfield,
        fields.fieldInt,
        fields.fieldCheckbox,
      ],
    },
  };

  await Promise.all(
    Object.entries(systemNoteTypeDefinitions).map(async ([key, def]) => {
      const note = await createNoteDefinition(devUsers.user1, def);
      noteDefinitionsDevData[key as keyof typeof noteDefinitionsDevData] = note;
    })
  );
};
