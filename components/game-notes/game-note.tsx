import clsx from 'clsx';
import { FunctionComponent, ReactNode, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Button } from '@components/user-input/button';
import {
  NoteFieldDefinition,
  RetrievedNoteDefinition,
} from '@model/note-definition';
import { NoteContentData, NoteData, UpdateNoteData } from '@model/note';
import {
  UserInput,
  UserInputType,
  UserInputTypeProps,
} from '@components/user-input';
import { TextInput } from '@components/user-input/text-input';

export interface Props {
  canEdit: boolean;
  definition: RetrievedNoteDefinition;
  data: NoteData;
  className?: string;
  onDelete?: (
    noteDefId: RetrievedNoteDefinition['noteDefId'],
    noteId: NoteData['noteId']
  ) => void;
  onUpdate?: (note: UpdateNoteData) => Promise<boolean>;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: 10,
    margin: 10,
    background: '#fffee2',
  },
  title: {
    fontWeight: 'bold',
  },
  actions: {},
  contents: {
    flexGrow: 1,
  },
  contentField: {},
  contentFieldName: {
    fontWeight: 'bold',
  },
}));

type Styles = ReturnType<typeof useStyles>;

type State = {
  fields: NoteFieldDefinition[];
  isEditing: boolean;
  title: UpdateNoteData['title'];
  content: UpdateNoteData['content'];
};

function useGameNote(props: Props) {
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

export const GameNote: FunctionComponent<Props> = ({ className, ...props }) => {
  const hookData = useGameNote(props);
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)}>
      {renderActions(styles, hookData)}
      {renderContents(styles, hookData)}
    </div>
  );
};

function renderActions(
  styles: Styles,
  {
    isEditing,
    toggleEdit,
    saveUpdate,
    confirmAndDeleteNote,
  }: ReturnType<typeof useGameNote>
): JSX.Element {
  const updateButton = isEditing && saveUpdate && (
    <Button onClick={saveUpdate}>Save</Button>
  );

  const editButton = toggleEdit && (
    <Button onClick={toggleEdit}>{isEditing ? 'Cancel' : 'Edit'}</Button>
  );

  const deleteButton = confirmAndDeleteNote && (
    <Button onClick={confirmAndDeleteNote}>Delete</Button>
  );

  return (
    <div className={styles.actions}>
      {updateButton}
      {editButton}
      {deleteButton}
    </div>
  );
}

function renderContents(
  styles: Styles,
  hookData: ReturnType<typeof useGameNote>
): JSX.Element {
  const { isEditing, definition, contents, title, updateTitle } = hookData;

  const titleElem = isEditing ? (
    <TextInput defaultValue={title} onChange={updateTitle} />
  ) : (
    title
  );

  const fields = definition.fields.map((field) => {
    const value = contents[field.noteFieldDefId];
    const fieldContent = isEditing
      ? renderEditingField(styles, field, value, hookData.updateField)
      : renderField(styles, field, value);

    return (
      <div key={field.noteFieldDefId} className={styles.contentField}>
        {' '}
        {fieldContent}
      </div>
    );
  });

  return (
    <div className={styles.contents}>
      <div className={styles.title}>{titleElem}</div>
      {fields}
    </div>
  );
}

function renderField(
  styles: Styles,
  field: NoteFieldDefinition,
  data: NoteContentData['value']
): ReactNode {
  return (
    <>
      <span className={styles.contentFieldName}>{field.name}:</span> {data}
    </>
  );
}

function renderEditingField(
  styles: Styles,
  field: NoteFieldDefinition,
  data: string | undefined,
  updateField: (
    noteDefId: NoteFieldDefinition['noteFieldDefId'],
    value: string
  ) => void
): ReactNode {
  const props = {
    ...field.options,
    defaultValue: data,
    type: field.type,
  } as UserInputTypeProps[UserInputType];

  const changeHandler = (value: string | boolean) => {
    updateField(field.noteFieldDefId, value as string);
  };

  return (
    <UserInput
      key={field.noteFieldDefId}
      className={styles.contentField}
      onChange={changeHandler}
      label={field.name}
      {...props}
    />
  );
}
