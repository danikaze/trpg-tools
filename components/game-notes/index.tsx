import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { Paginated } from '@utils/mysql';
import { DbGame } from '@model/game/sql';
import { RetrievedNoteDefinition } from '@model/note-definition';
import { NoteData } from '@model/note';
import { Button } from '@components/user-input/button';
import { GameNoteTypes } from '@components/game-note-types';
import { GameNote } from '@components/game-note';
import { useGameNotes } from './hooks';

export interface Props {
  gameId: DbGame['gameId'];
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
      <GameNoteTypes
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
