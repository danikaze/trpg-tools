import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { WidgetKeyData, WidgetKeyType } from '@model/widget-key';
import { useWidgets } from './hooks';
import { WidgetKeyInfo } from '@components/widget-key-info';
import { WidgetKeyEditor } from '@components/widget-key-editor';
import { Button } from '@components/user-input/button';
import { NotesByGameData } from '@model/note';

export interface Props {
  widgetApiKeys: Omit<WidgetKeyData<WidgetKeyType>, 'userId'>[] | null;
  notesByGame: NotesByGameData | null;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  creator: {},
  hidden: {
    display: 'none',
  },
  widgetKeysList: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const Widgets: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    renameWidgetKey,
    deleteWidgetKey,
    createWidgetKey,
    toggleCreator,
    isCreatorOpen,
    widgetApiKeys,
  } = useWidgets(props);

  if (!widgetApiKeys) {
    return renderNoWidgets();
  }

  const widgetElems = widgetApiKeys.map((widget) => (
    <WidgetKeyInfo
      key={widget.widgetKeyId}
      widgetKey={widget}
      renameWidgetKey={renameWidgetKey}
      deleteWidgetKey={deleteWidgetKey}
    />
  ));

  const toggleCreatorButton = (
    <Button onClick={toggleCreator}>
      {isCreatorOpen ? 'Cancel' : 'Create New Widget Key'}
    </Button>
  );

  const editorElem = props.notesByGame ? (
    <WidgetKeyEditor
      notesByGame={props.notesByGame}
      onCancel={toggleCreator}
      onCreate={createWidgetKey}
    />
  ) : (
    'You need to have some Game before creating a Widget!'
  );

  return (
    <div className={styles.root}>
      {toggleCreatorButton}
      <div className={clsx(styles.creator, isCreatorOpen ? '' : styles.hidden)}>
        {editorElem}
      </div>
      <div className={styles.widgetKeysList}>{widgetElems}</div>
    </div>
  );
};

function renderNoWidgets(): JSX.Element {
  return <div>There are no widgets.</div>;
}
