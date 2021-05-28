import { NoteData, UpdateNoteData } from '@model/note';

export type AkGetNoteResponse = {
  note: NoteData;
};
export type AkGetNoteQuery = {};
export type AkGetNoteBody = {};

export type AkUpdateNoteResponse = {};
export type AkUpdateNoteQuery = {};
export type AkUpdateNoteBody = {
  note: Omit<UpdateNoteData, 'noteId' | 'noteDefId'>;
};
