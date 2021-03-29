import { useState } from 'react';
import { Paginated } from '@utils/mysql';
import {
  callCreateNoteApi,
  callDeleteNoteApi,
  callUpdateNoteApi,
} from '@api/game/note/client';
import { getNotes } from '@api/game/client';
import { UpdateNoteData, NoteData, CreateNoteData } from '@model/note';
import { RetrievedNoteDefinition } from '@model/note-definition';
import { Props } from '.';
import { ApiKeyData } from '@model/api-key';

interface State {
  noteDefinitions: RetrievedNoteDefinition[];
  selectednoteDefId: RetrievedNoteDefinition['noteDefId'];
  notes: Record<RetrievedNoteDefinition['noteDefId'], Paginated<NoteData>>;
  apiKeys: Record<
    NoteData['noteId'],
    {
      selectNote?: ApiKeyData<'selectNote'>;
      updateNote?: ApiKeyData<'updateNote'>;
    }
  >;
  isEditingNewNote: boolean;
}

export function useGameNotes(props: Props) {
  if (!props.selectednoteDefId) return;

  const [state, setState] = useState<State>({
    noteDefinitions: props.noteDefinitions,
    selectednoteDefId: props.selectednoteDefId,
    notes: {
      [props.selectednoteDefId]: props.notes,
    },
    apiKeys: props.apiKeys.reduce((acc, apiKey) => {
      const { noteId } = apiKey.data;
      if (!acc[noteId]) {
        acc[noteId] = {};
      }
      acc[noteId][apiKey.type as 'updateNote'] = apiKey as ApiKeyData<
        'updateNote'
      >;
      return acc;
    }, {} as State['apiKeys']),
    isEditingNewNote: false,
  });

  async function onDelete(
    noteDefId: RetrievedNoteDefinition['noteDefId'],
    noteId: NoteData['noteId']
  ): Promise<void> {
    const noteList = state.notes[noteDefId].data;
    const index = noteList.findIndex((note) => note.noteId === noteId);
    const title = noteList[index].title;

    const confirmed = confirm(`Delete note "${title}"?`);
    if (!confirmed) return;

    const res = await callDeleteNoteApi(props.gameId, noteId);
    if (!res) return;

    setState(() => {
      const newNoteList = [...noteList];
      newNoteList.splice(index, 1);

      return {
        ...state,
        notes: {
          ...state.notes,
          [noteDefId]: {
            ...state.notes[noteDefId],
            data: newNoteList,
          },
        },
      };
    });
  }

  async function onUpdateNote(note: UpdateNoteData): Promise<boolean> {
    const { noteDefId, noteId } = note;
    const noteIndex = state.notes[noteDefId].data.findIndex(
      (n) => n.noteId === noteId
    );
    if (noteIndex === -1) return false;
    const currentNote = state.notes[noteDefId].data[noteIndex];
    const lastUpdate = currentNote.updatedOn;

    const res = await callUpdateNoteApi(props.gameId, noteId, lastUpdate, note);
    if (!res) return false;

    const newNote: NoteData = {
      noteId,
      title: note.title,
      updatedOn: res.updatedOn,
      createdOn: currentNote.createdOn,
      content: note.content,
    };

    setState((state) => {
      const newNoteList = state.notes[noteDefId].data;
      newNoteList.splice(noteIndex, 1, newNote);

      return {
        ...state,
        notes: {
          ...state.notes,
          [noteDefId]: {
            ...state.notes[noteDefId],
            data: newNoteList,
          },
        },
      };
    });

    return true;
  }

  async function selectNoteDefinition(
    noteDefId: RetrievedNoteDefinition['noteDefId']
  ): Promise<void> {
    let notes = state.notes;
    let selectedNotes = state.notes[noteDefId];
    if (!selectedNotes) {
      selectedNotes = await getNotes(props.gameId, noteDefId, 0);
      notes = {
        ...state.notes,
        [noteDefId]: selectedNotes,
      };
    }

    setState((state) => ({
      ...state,
      notes,
      selectednoteDefId: noteDefId,
    }));
  }

  async function loadMoreNotes(
    noteDefId: RetrievedNoteDefinition['noteDefId']
  ): Promise<void> {
    const selectedNotes = state.notes[noteDefId];
    if (!selectedNotes.moreResults) return;

    const newNotes = await getNotes(
      props.gameId,
      noteDefId,
      selectedNotes.page + 1
    );
    setState((state) => ({
      ...state,
      notes: {
        ...state.notes,
        [noteDefId]: {
          ...newNotes,
          data: [...selectedNotes.data, ...newNotes.data],
        },
      },
      selectednoteDefId: noteDefId,
    }));
  }

  function toggleNewNoteCreation() {
    setState((state) => ({
      ...state,
      isEditingNewNote: !state.isEditingNewNote,
    }));
  }

  async function createNewNote(note: Omit<CreateNoteData, 'gameId'>) {
    const createdNoteData = await callCreateNoteApi(props.gameId, note);

    setState((state) => {
      const newNote = { ...note, ...createdNoteData };
      const currentNotes = state.notes[state.selectednoteDefId];
      return {
        ...state,
        isEditingNewNote: !state.isEditingNewNote,
        notes: {
          ...state.notes,
          [state.selectednoteDefId]: {
            ...currentNotes,
            data: [newNote, ...currentNotes.data],
          },
        },
      };
    });
  }

  return {
    onDelete,
    onUpdateNote,
    selectNoteDefinition,
    toggleNewNoteCreation,
    createNewNote,
    loadMoreNotes: state.notes[state.selectednoteDefId].moreResults
      ? loadMoreNotes
      : undefined,
    noteDefinitions: state.noteDefinitions,
    selectednoteDefId: state.selectednoteDefId,
    notes: state.notes[state.selectednoteDefId].data,
    apiKeys: state.apiKeys,
    isEditingNewNote: state.isEditingNewNote,
  };
}
