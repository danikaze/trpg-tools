import { getUserNoteDefinitions, NoteDefinition } from '@model/note-definition';
import { DbNoteFieldDefinition } from '@model/note-definition/sql';
import {
  NOTE_DEFINITION_NAME_LOCATIONS,
  NOTE_DEFINITION_NAME_NPCS,
  NOTE_DEFINITION_NAME_PCS,
  NOTE_DEF_FIELD_NAME_AC,
  NOTE_DEF_FIELD_NAME_ALIGNMENT,
  NOTE_DEF_FIELD_NAME_CHARISMA,
  NOTE_DEF_FIELD_NAME_CLASS,
  NOTE_DEF_FIELD_NAME_CONSTITUTION,
  NOTE_DEF_FIELD_NAME_DESCRIPTION,
  NOTE_DEF_FIELD_NAME_DEXTERITY,
  NOTE_DEF_FIELD_NAME_HP,
  NOTE_DEF_FIELD_NAME_HP_MAX,
  NOTE_DEF_FIELD_NAME_HP_TEMP,
  NOTE_DEF_FIELD_NAME_IMAGE,
  NOTE_DEF_FIELD_NAME_INTELLIGENCE,
  NOTE_DEF_FIELD_NAME_LEVEL,
  NOTE_DEF_FIELD_NAME_RACE,
  NOTE_DEF_FIELD_NAME_STRENGTH,
  NOTE_DEF_FIELD_NAME_WISDOM,
} from '@model/note-definition/init';
import { SYSTEM_USER } from '@model/user';
import { getSystemNoteDefinitions } from '.';

export type SystemNoteDefinitions = Record<
  'pcs' | 'npcs' | 'locations',
  NoteDefinition
>;

export type PcNoteFields = Record<
  | 'image'
  | 'description'
  | 'alignment'
  | 'race'
  | 'class'
  | 'level'
  | 'hp'
  | 'hpMax'
  | 'hpTemp'
  | 'str'
  | 'dex'
  | 'con'
  | 'int'
  | 'wis'
  | 'cha'
  | 'ac',
  DbNoteFieldDefinition['noteFieldDefId']
>;

export async function fetchSystemNoteDefinitions(): Promise<
  SystemNoteDefinitions
> {
  const data = await getUserNoteDefinitions(SYSTEM_USER);

  return {
    locations: data.find((def) => def.name === NOTE_DEFINITION_NAME_LOCATIONS)!,
    npcs: data.find((def) => def.name === NOTE_DEFINITION_NAME_NPCS)!,
    pcs: data.find((def) => def.name === NOTE_DEFINITION_NAME_PCS)!,
  };
}

export async function mapPcNoteFields(): Promise<PcNoteFields> {
  const fieldNames: Record<keyof PcNoteFields, string> = {
    image: NOTE_DEF_FIELD_NAME_IMAGE,
    description: NOTE_DEF_FIELD_NAME_DESCRIPTION,
    alignment: NOTE_DEF_FIELD_NAME_ALIGNMENT,
    race: NOTE_DEF_FIELD_NAME_RACE,
    class: NOTE_DEF_FIELD_NAME_CLASS,
    level: NOTE_DEF_FIELD_NAME_LEVEL,
    hp: NOTE_DEF_FIELD_NAME_HP,
    hpMax: NOTE_DEF_FIELD_NAME_HP_MAX,
    hpTemp: NOTE_DEF_FIELD_NAME_HP_TEMP,
    str: NOTE_DEF_FIELD_NAME_STRENGTH,
    dex: NOTE_DEF_FIELD_NAME_DEXTERITY,
    con: NOTE_DEF_FIELD_NAME_CONSTITUTION,
    int: NOTE_DEF_FIELD_NAME_INTELLIGENCE,
    wis: NOTE_DEF_FIELD_NAME_WISDOM,
    cha: NOTE_DEF_FIELD_NAME_CHARISMA,
    ac: NOTE_DEF_FIELD_NAME_AC,
  };

  const pcNoteFields = (await getSystemNoteDefinitions()).pcs.fields;
  return Object.entries(fieldNames).reduce((fields, [key, fieldName]) => {
    const field = pcNoteFields.find((field) => field.name === fieldName)!;
    fields[key as keyof PcNoteFields] = field.noteFieldDefId;
    return fields;
  }, {} as PcNoteFields);
}
