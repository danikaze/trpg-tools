import { DbNoteFieldDefinition } from '@model/note-definition/sql';
import { NoteData, UpdateNoteData } from '../note';

export type WidgetKeyType = keyof WidgetKeyTypeData;

/*
 * Props required by each kind of widget
 */
export interface WidgetProps {
  charSheet: CharacterSheetProps;
  charStatus: CharacterStatusProps;
  charStatusBorders: CharacterStatusBordersProps;
}

export interface CharacterSheetProps {
  note: NoteData;
  fields: Record<string, DbNoteFieldDefinition['noteFieldDefId']>;
}

export interface CharacterStatusProps {
  note: NoteData;
  fields: Record<string, DbNoteFieldDefinition['noteFieldDefId']>;
}

export interface CharacterStatusBordersProps {
  note: NoteData;
  fields: Record<string, DbNoteFieldDefinition['noteFieldDefId']>;
}

/*
 * Data required to be stored for each widget
 */
export type WidgetKeyCharSheetData = { noteId: UpdateNoteData['noteId'] };
export type WidgetKeyCharStatusData = { noteId: UpdateNoteData['noteId'] };

export interface WidgetKeyTypeData {
  charSheet: WidgetKeyCharSheetData;
  charStatus: WidgetKeyCharStatusData;
}
