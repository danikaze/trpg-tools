import { NoteData, UpdateNoteData } from '../note';
import { NoteFieldDefinition } from '../note-definition';

export type WidgetKeyType = keyof WidgetKeyTypeData;

/*
 * Props required by each kind of widget
 */
export interface WidgetProps {
  charSheet: CharacterSheetProps;
  charStatus: CharacterSheetProps;
}

export interface CharacterSheetProps {
  note: NoteData;
  fields: Record<string, NoteFieldDefinition['noteFieldDefId']>;
}

export interface CharacterStatusProps {
  note: NoteData;
  fields: Record<string, NoteFieldDefinition['noteFieldDefId']>;
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
