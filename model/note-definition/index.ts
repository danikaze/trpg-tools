import { DbNoteDefinition, DbNoteFieldDefinition, FieldType, sql } from './sql';
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
    await sql.insertNoteDefinition(db, {
      noteDefId,
      userId: user.userId,
      name: definition.name,
    });

    // create its fields
    const promises = definition.fields.map((field, position) => {
      return sql.insertNoteFieldDefinition(db, {
        noteDefId,
        position,
        name: field.name,
        type: field.type,
        options: field.options ? JSON.stringify(field.options) : '',
      });
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
): Promise<boolean> {
  const db = await getDb();

  const res = await sql.deleteNoteDefinition(db, {
    noteDefId,
    userId: user.userId,
  });
  return res.affectedRows > 0;
}

export async function editNoteDefinition(): Promise<void> {}

export async function getUserNoteDefinitions(
  user: UserAuthData
): Promise<RetrievedNoteDefinition[]> {
  const db = await getDb();

  // get the note definitions
  const noteDefinitionResult = await sql.selectUserNoteDefinitions(db, {
    userId: user.userId,
  });

  // get the field types
  const noteDefIds = noteDefinitionResult.map((n) => n.noteDefId);
  const fieldDefs = await sql.selectNoteFieldsDefinitions(db, { noteDefIds });

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
