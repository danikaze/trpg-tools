import {
  fetchSystemNoteDefinitions,
  mapPcNoteFields,
  PcNoteFields,
  SystemNoteDefinitions,
} from './note-definition';

let systemNoteDefinitions: SystemNoteDefinitions;
let systemNotePcFields: PcNoteFields;

export async function getSystemNoteDefinitions(): Promise<
  SystemNoteDefinitions
> {
  if (!systemNoteDefinitions) {
    systemNoteDefinitions = await fetchSystemNoteDefinitions();
  }

  return systemNoteDefinitions;
}

export async function getSystemNotePcFields(): Promise<PcNoteFields> {
  if (!systemNotePcFields) {
    systemNotePcFields = await mapPcNoteFields();
  }

  return systemNotePcFields;
}
