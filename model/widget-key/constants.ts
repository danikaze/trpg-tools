import { NoteFieldDefinition } from '@model/note-definition';

// tslint:disable:no-magic-numbers
export const pcNoteFields = {
  alignment: 6,
  race: 7,
  class: 8,
  level: 9,
  hp: 10,
  hpMax: 11,
  hpTemp: 12,
  str: 13,
  dex: 14,
  con: 15,
  int: 16,
  wis: 17,
  cha: 18,
  ac: 19,
} as Record<string, NoteFieldDefinition['noteFieldDefId']>;
