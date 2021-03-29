import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from '@components/links/link-to-index';
import { NoteData } from '@model/note';
import { CharacterSheet } from '@components/widgets/character-sheet';
import { NoteFieldDefinition } from '@model/note-definition';
import { useWidget } from './hooks';

export interface Props {
  widgetId?: string;
  initialData?: NoteData;
  fields?: Record<string, NoteFieldDefinition['noteFieldDefId']>;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const Widget: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const { note, fields } = useWidget(props);

  if (!note || !fields) {
    return renderNotFound();
  }

  return (
    <div className={styles.root}>
      <CharacterSheet note={note} fields={fields} />
    </div>
  );
};

function renderNotFound(): JSX.Element {
  return (
    <div>
      Widget not found. <LinkToIndex>Back to the Index page</LinkToIndex>.
    </div>
  );
}
