import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { NotesByGameData } from '@model/note';
import { WidgetKeyData, WidgetKeyType } from '@model/widget-key';
import { Button } from '@components/user-input/button';
import { Select } from '@components/user-input/select';
import { useWidgetKeyEditor } from './hooks';

export interface Props {
  notesByGame: NotesByGameData;
  onCreate: (widgetKey: Omit<WidgetKeyData<WidgetKeyType>, 'userId'>) => void;
  onCancel?: () => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {},
  actions: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const WidgetKeyEditor: FunctionComponent<Props> = ({
  className,
  ...props // tslint:disable-line: trailing-comma
}) => {
  const styles = useStyles();
  const {
    selectGame,
    selectNote,
    createGame,
    selectType,
    createDisabled,
    gameOptions,
    noteOptions,
    widgetOptions,
    selectedGame,
    selectedNote,
    selectedType,
  } = useWidgetKeyEditor(props);

  const createButton = (
    <Button onClick={createGame} disabled={createDisabled}>
      Create
    </Button>
  );

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.title}>Create Widget Key</div>
      <div>
        Type:{' '}
        <Select
          required
          defaultValue={selectedType}
          onChange={selectType}
          options={widgetOptions}
        />
      </div>
      <div>
        For note:{' '}
        <Select
          required
          defaultValue={selectedGame}
          onChange={selectGame}
          options={gameOptions}
        />
        <Select
          required
          defaultValue={selectedNote}
          onChange={selectNote}
          options={noteOptions}
        />
      </div>
      <div className={styles.actions}>{createButton}</div>
    </div>
  );
};
