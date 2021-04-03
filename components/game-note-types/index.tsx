import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { NoteDefinition } from '@model/note-definition';
import { Button } from '@components/user-input/button';

export interface Props {
  noteDefinitions: NoteDefinition[];
  selectednoteDefId?: NoteDefinition['noteDefId'];
  className?: string;
  onSelect?: (noteId: NoteDefinition['noteDefId']) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const GameNoteTypes: FunctionComponent<Props> = ({
  noteDefinitions,
  onSelect,
  className,
}) => {
  const styles = useStyles();
  const listItems = noteDefinitions.map((def) => {
    const select = onSelect && (() => onSelect(def.noteDefId));
    return (
      <Button key={def.noteDefId} onClick={select}>
        {def.name}
      </Button>
    );
  });

  return <div className={clsx(styles.root, className)}>{listItems}</div>;
};
