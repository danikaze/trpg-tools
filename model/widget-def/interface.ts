import { DbNoteFieldDefinition } from '@model/note-definition/sql';
import { NoteData, UpdateNoteData } from '../note';

export type WidgetKeyType = keyof WidgetKeyTypeData;

/*
 * Props required by each kind of widget
 */
export interface WidgetProps {
  charNote: CharacterSheetProps;
}

export interface CharacterSheetProps {
  note: NoteData;
  fields: Record<string, DbNoteFieldDefinition['noteFieldDefId']>;
}

/*
 * Data required to be stored for each widget
 */
export type WidgetKeyCharSheetData = { noteId: UpdateNoteData['noteId'] };

export interface WidgetKeyTypeData {
  charNote: WidgetKeyCharSheetData;
}
