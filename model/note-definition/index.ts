import {
  DbNoteDefinition,
  DbNoteFieldDefinition,
  FieldType,
  sql,
} from '../sql/note-definition';
import { SYSTEM_USER, UserAuthData } from '../user';
import { generateUniqueId, getDb, getTimestamp } from '../../utils/db';

interface NoteFieldDefinitionBase {
  noteFieldDefId: DbNoteFieldDefinition['noteFieldDefId'];
  name: string;
  type: FieldType;
}

interface NoteFieldDefinitionInt extends NoteFieldDefinitionBase {
  type: 'int';
  options?: {
    defaultValue?: number;
    required?: boolean;
    min?: number;
    max?: number;
  };
}

interface NoteFieldDefinitionTextfield extends NoteFieldDefinitionBase {
  type: 'textfield';
  options?: {
    defaultValue?: string;
    required?: boolean;
    maxLength?: number;
  };
}

interface NoteFieldDefinitionTextarea extends NoteFieldDefinitionBase {
  type: 'textarea';
  options?: {
    defaultValue?: string;
    required?: boolean;
    maxLength?: number;
  };
}

interface NoteFieldDefinitionCheckbox extends NoteFieldDefinitionBase {
  type: 'checkbox';
  options?: {
    defaultValue?: boolean;
    required?: boolean;
  };
}

interface NoteFieldDefinitionSelect extends NoteFieldDefinitionBase {
  type: 'select';
  options: {
    defaultValue?: string;
    required?: boolean;
    options: {
      label: string;
      value: string;
    }[];
  };
}

export type NoteFieldDefinition =
  | NoteFieldDefinitionInt
  | NoteFieldDefinitionTextfield
  | NoteFieldDefinitionTextarea
  | NoteFieldDefinitionCheckbox
  | NoteFieldDefinitionSelect;

export type CreateNoteFieldDefinition = Omit<
  NoteFieldDefinition,
  'noteFieldDefId'
>;
export interface CreateNoteDefinitionData {
  name: string;
  fields: CreateNoteFieldDefinition[];
}

export interface NoteDefinition {
  noteDefId: DbNoteDefinition['noteDefId'];
  name: DbNoteDefinition['name'];
  fields: NoteFieldDefinition[];
}

export interface RetrievedNoteDefinition {
  noteDefId: DbNoteDefinition['noteDefId'];
  name: string;
  fields: NoteFieldDefinition[];
}

export async function createNoteDefinition(
  user: UserAuthData,
  definition: CreateNoteDefinitionData
): Promise<NoteDefinition> {
  // create the note
  const db = await getDb();
  const res = await db.transaction<NoteDefinition>(async () => {
    const noteDefId = generateUniqueId();
    const now = getTimestamp();
    await db.insertOne<DbNoteDefinition>(sql.createNoteDefinition, {
      noteDefId,
      userId: user.id,
      name: definition.name,
      createdOn: now,
      updatedOn: now,
    });

    // create its fields
    const promises = definition.fields.map((field, position) => {
      return db.insertOne<Omit<DbNoteFieldDefinition, 'noteFieldDefId'>>(
        sql.createNoteFieldDefinition,
        {
          noteDefId,
          position,
          name: field.name,
          type: field.type,
          options: field.options ? JSON.stringify(field.options) : '',
        }
      );
    });

    // construct the result
    const fieldRes = await Promise.all(promises);
    const fields = fieldRes.map(
      (res, order) =>
        ({
          ...definition.fields[order],
          noteFieldDefId: res.insertId,
        } as NoteDefinition['fields'][0])
    );

    return {
      noteDefId,
      fields,
      name: definition.name,
    };
  });

  if (!res) {
    throw new Error();
  }

  return res;
}

export async function deleteNoteDefinition(
  user: UserAuthData,
  noteDefId: DbNoteDefinition['noteDefId']
): Promise<void> {}

export async function editNoteDefinition(): Promise<void> {}

export async function getUserNoteDefinitions(
  user: UserAuthData
): Promise<RetrievedNoteDefinition[]> {
  const db = await getDb();

  // get the note definitions
  const noteDefinitionResult = await db.query<DbNoteDefinition>(
    sql.selectUserNoteDefinitions,
    { systemUserId: SYSTEM_USER.id, userId: user.id }
  );

  // get the field types
  const noteDefIds = noteDefinitionResult.map((n) => n.noteDefId);
  const fieldDefs = await db.query<DbNoteFieldDefinition>(
    sql.selectNoteFieldsDefinitions,
    {
      noteDefIds,
    }
  );

  const noteFields = fieldDefs.reduce(
    (all, field) => {
      const fieldObject = {
        noteFieldDefId: field.noteFieldDefId,
        position: field.position,
        name: field.name,
        type: field.type,
      } as DbNoteFieldDefinition;
      if (field.options) {
        fieldObject.options = JSON.parse(field.options);
      }
      all[field.noteDefId].push(fieldObject);
      return all;
    },
    noteDefinitionResult.reduce((all, note) => {
      all[note.noteDefId] = [];
      return all;
    }, {} as Record<DbNoteDefinition['noteDefId'], DbNoteFieldDefinition[]>)
  );

  const noteDefinitions = noteDefinitionResult.map((note) => {
    return {
      noteDefId: note.noteDefId,
      name: note.name,
      fields: noteFields[note.noteDefId],
    } as RetrievedNoteDefinition;
  });

  return noteDefinitions;
}
