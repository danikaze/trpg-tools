import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Paginated } from '@utils/mysql';
import { callDeleteNoteApi, callUpdateNoteApi } from '@api/game/note/client';
import { getNotes } from '@api/game/client';
import { DbGame } from '@model/sql/game';
import { RetrievedNoteDefinition } from '@model/note-definition';
import { UpdateNoteData, NoteData } from '@model/note';
import { Button } from '@components/user-input/button';
import { GameNotesTypes } from './game-notes-types';
import { GameNote } from './game-note';

export interface Props {
  gameId: DbGame['id'];
  noteDefinitions: RetrievedNoteDefinition[];
  selectednoteDefId?: RetrievedNoteDefinition['noteDefId'] | null;
  notes: Paginated<NoteData>;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Styles = ReturnType<typeof useStyles>;

interface State {
  noteDefinitions: RetrievedNoteDefinition[];
  selectednoteDefId: RetrievedNoteDefinition['noteDefId'];
  notes: Record<RetrievedNoteDefinition['noteDefId'], Paginated<NoteData>>;
}

function useGameNotes(props: Props) {
  if (!props.selectednoteDefId) return;

  const [state, setState] = useState<State>({
    noteDefinitions: props.noteDefinitions,
    selectednoteDefId: props.selectednoteDefId,
    notes: {
      [props.selectednoteDefId]: props.notes,
    },
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

  return {
    onDelete,
    onUpdateNote,
    selectNoteDefinition,
    loadMoreNotes: state.notes[state.selectednoteDefId].moreResults
      ? loadMoreNotes
      : undefined,
    noteDefinitions: state.noteDefinitions,
    selectednoteDefId: state.selectednoteDefId,
    notes: state.notes[state.selectednoteDefId].data,
  };
}

export const GameNotes: FunctionComponent<Props> = ({
  className,
  ...props // tslint:disable-line: trailing-comma
}) => {
  const componentHookData = useGameNotes(props);
  if (!componentHookData) return null;
  const styles = useStyles();
  const {
    onDelete,
    onUpdateNote,
    selectNoteDefinition,
    loadMoreNotes,
    noteDefinitions,
    selectednoteDefId,
    notes,
  } = componentHookData;

  const noteDef = noteDefinitions.find(
    (note) => note.noteDefId === selectednoteDefId
  );
  const noteList =
    noteDef &&
    notes &&
    notes.map((note) => (
      <GameNote
        key={note.noteId}
        canEdit={true}
        definition={noteDef}
        data={note}
        onDelete={onDelete}
        onUpdate={onUpdateNote}
      />
    ));

  const loadMore = loadMoreNotes && (() => loadMoreNotes(selectednoteDefId));
  const loadMoreButton = loadMoreNotes && (
    <Button onClick={loadMore}>Load more</Button>
  );

  return (
    <div className={clsx(styles.root, className)}>
      <GameNotesTypes
        noteDefinitions={noteDefinitions}
        selectednoteDefId={selectednoteDefId!}
        onSelect={selectNoteDefinition}
      />
      <h3>{noteDef && noteDef.name}</h3>
      {noteList}
      {loadMoreButton}
    </div>
  );
};
