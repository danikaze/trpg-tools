import { useState } from 'react';
import {
  callCreateSelectNoteApiKey,
  callDeleteSelectNoteApiKey,
} from '@api/ak/select-note/client';
import {
  callCreateUpdateNoteApiKey,
  callDeleteUpdateNoteApiKey,
} from '@api/ak/update-note/client';
import { UpdateNoteData } from '@model/note';
import { NoteFieldDefinition } from '@model/note-definition';
import { ApiKeyData } from '@model/api-key';
import { UserAuthData } from '@model/user';
import { useUserData } from '@utils/auth';
import { EditProps, Props } from './';

type State = {
  fields: NoteFieldDefinition[];
  isEditing: boolean;
  title: UpdateNoteData['title'];
  content: UpdateNoteData['content'];
  apiKeySelect?: ApiKeyData<'selectNote'>;
  apiKeyUpdate?: ApiKeyData<'updateNote'>;
  user: UserAuthData;
};

function isEditingMode(props: Props): props is EditProps {
  return props.mode === 'edit';
}

export function useGameNote(props: Props) {
  const [state, setState] = useState<State>({
    fields: props.definition.fields,
    isEditing: !isEditingMode(props),
    title: isEditingMode(props) ? props.data.title : '',
    content: isEditingMode(props) ? { ...props.data.content } : {},
    apiKeyUpdate: isEditingMode(props) ? props.apiKeyUpdate : undefined,
    apiKeySelect: isEditingMode(props) ? props.apiKeySelect : undefined,
    user: useUserData()!,
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
    if (!isEditingMode(props) || !props.onUpdate) return;
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

  function saveNewNote() {
    if (isEditingMode(props) || !props.onSave) return;
    props.onSave({
      noteDefId: props.definition.noteDefId,
      title: state.title,
      content: state.content,
    });
  }

  function confirmAndDeleteNote() {
    if (!isEditingMode(props) || !props.onDelete) return;
    props.onDelete(props.definition.noteDefId, props.data.noteId);
  }

  async function createApiKeySelect() {
    if (!isEditingMode(props) || !state.user || state.apiKeySelect) return;

    const apiKeyId = await callCreateSelectNoteApiKey(props.data.noteId);

    setState((state) => ({
      ...state,
      apiKeySelect: {
        apiKeyId,
        type: 'selectNote',
        userId: state.user.userId,
        data: {
          noteId: props.data.noteId,
          noteDefId: props.definition.noteDefId,
        },
      },
    }));
  }

  async function deleteApiKeySelect() {
    if (!state.user || !state.apiKeySelect) return;
    const doIt = confirm(
      `Delete the select API key ${state.apiKeySelect.apiKeyId}?`
    );
    if (!doIt) return;

    await callDeleteSelectNoteApiKey(state.apiKeySelect.apiKeyId);

    setState((state) => ({
      ...state,
      apiKeySelect: undefined,
    }));
  }

  async function createApiKeyUpdate() {
    if (!isEditingMode(props) || !state.user || state.apiKeyUpdate) return;

    const apiKeyId = await callCreateUpdateNoteApiKey(
      props.data.noteId,
      props.definition.noteDefId
    );

    setState((state) => ({
      ...state,
      apiKeyUpdate: {
        apiKeyId,
        type: 'updateNote',
        userId: state.user.userId,
        data: {
          noteId: props.data.noteId,
          noteDefId: props.definition.noteDefId,
        },
      },
    }));
  }

  async function deleteApiKeyUpdate() {
    if (!state.user || !state.apiKeyUpdate) return;
    const doIt = confirm(
      `Delete the update API key ${state.apiKeyUpdate.apiKeyId}?`
    );
    if (!doIt) return;

    await callDeleteUpdateNoteApiKey(state.apiKeyUpdate.apiKeyId);

    setState((state) => ({
      ...state,
      apiKeyUpdate: undefined,
    }));
  }

  return {
    updateTitle,
    updateField,
    saveUpdate: isEditingMode(props)
      ? props.onUpdate && saveUpdate
      : props.onSave && saveNewNote,
    confirmAndDeleteNote:
      isEditingMode(props) && props.onDelete && confirmAndDeleteNote,
    createApiKeySelect:
      isEditingMode(props) &&
      state.user &&
      !state.apiKeySelect &&
      createApiKeySelect,
    deleteApiKeySelect: state.user && state.apiKeySelect && deleteApiKeySelect,
    createApiKeyUpdate:
      isEditingMode(props) &&
      state.user &&
      !state.apiKeyUpdate &&
      createApiKeyUpdate,
    deleteApiKeyUpdate: state.user && state.apiKeyUpdate && deleteApiKeyUpdate,
    isEditing: state.isEditing,
    toggleEdit:
      (isEditingMode(props) && props.canEdit && toggleEdit) || undefined,
    contents: state.content,
    title: state.title,
    definition: props.definition,
    apiKeySelect: state.apiKeySelect,
    apiKeyUpdate: state.apiKeyUpdate,
  };
}
