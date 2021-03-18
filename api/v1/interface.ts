import { UpdateNoteData } from '@model/note';

export type AkUpdateNoteResponse = {};
export type AkUpdateNoteQuery = {};
export type AkUpdateNoteBody = {
  note: Omit<UpdateNoteData, 'noteId' | 'noteDefId'>;
};
