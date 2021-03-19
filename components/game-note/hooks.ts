import { useState } from 'react';
import { UpdateNoteData } from '@model/note';
import { NoteFieldDefinition } from '@model/note-definition';
import { Props } from './';

type State = {
  fields: NoteFieldDefinition[];
  isEditing: boolean;
  title: UpdateNoteData['title'];
  content: UpdateNoteData['content'];
};

export function useGameNote(props: Props) {
  const [state, setState] = useState<State>({
    fields: props.definition.fields,
    isEditing: false,
    title: props.data.title,
    content: { ...props.data.content },
  });

  function toggleEdit() {
    setState((state) => ({
      ...state,
      isEditing: !state.isEditing,
    }));
  }

  function updateTitle(title: string) {
    setState((state) => ({
      ...state,
      title,
    }));
  }

  function updateField(
    noteContentId: NoteFieldDefinition['noteFieldDefId'],
    value: string
  ) {
    setState((state) => ({
      ...state,
      content: {
        ...state.content,
        [noteContentId]: value,
      },
    }));
  }

  async function saveUpdate() {
    if (!props.onUpdate) return;
    const success = await props.onUpdate({
      noteDefId: props.definition.noteDefId,
      noteId: props.data.noteId,
      title: state.title,
      content: state.content,
    });

    if (success) {
      setState((state) => ({
        ...state,
        isEditing: false,
      }));
    }
  }

  function confirmAndDeleteNote() {
    if (!props.onDelete) return;
    props.onDelete(props.definition.noteDefId, props.data.noteId);
  }

  return {
    updateTitle,
    updateField,
    saveUpdate: props.onUpdate && saveUpdate,
    confirmAndDeleteNote: props.onDelete && confirmAndDeleteNote,
    isEditing: state.isEditing,
    toggleEdit: (props.canEdit && toggleEdit) || undefined,
    contents: state.content,
    title: state.title,
    definition: props.definition,
  };
}
