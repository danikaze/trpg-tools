import clsx from 'clsx';
import { FunctionComponent, ReactNode } from 'react';
import { makeStyles } from '@utils/styles';
import { Button } from '@components/user-input/button';
import { NoteFieldDefinition, NoteDefinition } from '@model/note-definition';
import {
  CreateNoteData,
  NoteContentData,
  NoteData,
  UpdateNoteData,
} from '@model/note';
import { ApiKeyData } from '@model/api-key';
import {
  UserInput,
  UserInputType,
  UserInputTypeProps,
} from '@components/user-input';
import { TextInput } from '@components/user-input/text-input';
import { useGameNote } from './hooks';

interface BaseProps {
  definition: NoteDefinition;
  className?: string;
}

export interface EditProps extends BaseProps {
  mode: 'edit';
  canEdit: boolean;
  data: NoteData;
  apiKeyUpdate?: ApiKeyData<'updateNote'> | undefined;
  onDelete?: (
    noteDefId: NoteDefinition['noteDefId'],
    noteId: NoteData['noteId']
  ) => void;
  onUpdate?: (note: UpdateNoteData) => Promise<boolean>;
}

export interface CreateProps extends BaseProps {
  mode: 'create';
  onCancel?: () => void;
  onSave?: (note: Omit<CreateNoteData, 'gameId'>) => void;
}

export type Props = EditProps | CreateProps;

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
  apiKey: {},
  apiKeyIcon: {},
}));

type Styles = ReturnType<typeof useStyles>;

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
    apiKeyUpdate,
    createApiKeyUpdate,
    deleteApiKeyUpdate,
  }: ReturnType<typeof useGameNote>
): JSX.Element {
  // Save/Edit/Delete buttons
  const updateButton = isEditing && saveUpdate && (
    <Button onClick={saveUpdate}>Save</Button>
  );
  const editButton = toggleEdit && (
    <Button onClick={toggleEdit}>{isEditing ? 'Cancel' : 'Edit'}</Button>
  );
  const deleteButton = confirmAndDeleteNote && (
    <Button onClick={confirmAndDeleteNote}>Delete</Button>
  );

  // API Key Update
  const apiKeyUpdateIcon = apiKeyUpdate && (
    <div className={styles.apiKeyIcon}>Update AK: {apiKeyUpdate.apiKeyId}</div>
  );
  const createApiKeyUpdateButton = createApiKeyUpdate && (
    <Button onClick={createApiKeyUpdate}>Create Update AK</Button>
  );
  const deleteApiKeyUpdateButton = deleteApiKeyUpdate && (
    <Button onClick={deleteApiKeyUpdate}>Remove Update AK</Button>
  );

  return (
    <div className={styles.actions}>
      {updateButton}
      {editButton}
      {deleteButton}
      <div className={styles.apiKey}>
        {apiKeyUpdateIcon}
        {createApiKeyUpdateButton}
        {deleteApiKeyUpdateButton}
      </div>
    </div>
  );
}

function renderContents(
  styles: Styles,
  hookData: ReturnType<typeof useGameNote>
): JSX.Element {
  const { isEditing, definition, contents, title, updateTitle } = hookData;

  const titleElem = isEditing ? (
    <TextInput
      defaultValue={title}
      onChange={updateTitle}
      label="Title"
      required={true}
    />
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
