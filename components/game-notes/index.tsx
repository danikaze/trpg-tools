import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { Paginated } from '@utils/mysql';
import { DbGame } from '@model/game/sql';
import { RetrievedNoteDefinition } from '@model/note-definition';
import { NoteData } from '@model/note';
import { ApiKeyData } from '@model/api-key';
import { Button } from '@components/user-input/button';
import { GameNoteTypes } from '@components/game-note-types';
import { GameNote } from '@components/game-note';
import { useGameNotes } from './hooks';

export interface Props {
  gameId: DbGame['gameId'];
  noteDefinitions: RetrievedNoteDefinition[];
  selectednoteDefId?: RetrievedNoteDefinition['noteDefId'] | null;
  notes: Paginated<NoteData>;
  apiKeys: ApiKeyData<'selectNote' | 'updateNote'>[];
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Styles = ReturnType<typeof useStyles>;

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
    toggleNewNoteCreation,
    createNewNote,
    loadMoreNotes,
    noteDefinitions,
    selectednoteDefId,
    notes,
    apiKeys,
    isEditingNewNote,
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
        mode="edit"
        canEdit={true}
        definition={noteDef}
        data={note}
        apiKeySelect={apiKeys[note.noteId]?.selectNote}
        apiKeyUpdate={apiKeys[note.noteId]?.updateNote}
        onDelete={onDelete}
        onUpdate={onUpdateNote}
      />
    ));

  const loadMore = loadMoreNotes && (() => loadMoreNotes(selectednoteDefId));
  const loadMoreButton = loadMoreNotes && (
    <Button onClick={loadMore}>Load more</Button>
  );

  const newNoteEditor = noteDef ? (
    isEditingNewNote ? (
      <GameNote
        mode="create"
        definition={noteDef}
        onSave={createNewNote}
        onCancel={toggleNewNoteCreation}
      />
    ) : (
      <Button onClick={toggleNewNoteCreation}>Create new</Button>
    )
  ) : null;

  return (
    <div className={clsx(styles.root, className)}>
      <GameNoteTypes
        noteDefinitions={noteDefinitions}
        selectednoteDefId={selectednoteDefId!}
        onSelect={selectNoteDefinition}
      />
      <div>
        <h3>{noteDef && noteDef.name}</h3>
        {newNoteEditor}
      </div>
      {noteList}
      {loadMoreButton}
    </div>
  );
};
