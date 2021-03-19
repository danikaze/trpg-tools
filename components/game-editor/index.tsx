import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { GAME_DESC_MAX_CHARS, GAME_NAME_MAX_CHARS } from '@utils/constants';
import { makeStyles } from '@utils/styles';
import { ImageDropInput } from '@components/user-input/image-drop-input';
import { TextInput } from '@components/user-input/text-input';
import { TextArea } from '@components/user-input/text-area';
import { Button } from '@components/user-input/button';
import { useGameEditor } from './hooks';

export interface GameEditorData {
  name: string;
  description: string;
  image: string | File | null;
}

export interface GameDefaultData {
  name: string;
  description: string;
  imageUrl?: string | null;
}

export interface Props {
  mode: 'edit' | 'create';
  game?: GameDefaultData;
  className?: string;
  onDataChange?: (data: Omit<GameEditorData, 'image'>) => Promise<void>;
  onImageChange?: (image: File | null) => Promise<void>;
  onSubmit: (data: GameEditorData) => Promise<void>;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#505050',
    marginBottom: 10,
  },
  info: {
    display: 'flex',
  },
  image: {},
  details: {},
  longText: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

export const GameEditor: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    submit,
    imageChangeHandler,
    dataChangeHandler,
    nameRef,
    descriptionRef,
    editorData,
    imageReset,
    submitDisabled,
    titleText,
    submitText,
    reset,
  } = useGameEditor(props);

  const resetButton = reset ? <Button onClick={reset}>Reset</Button> : null;

  return (
    <div className={clsx(styles.root, props.className)}>
      <div className={styles.title}>{titleText}</div>
      <div className={styles.info}>
        <div className={styles.image}>
          <ImageDropInput
            maxBytes={GAME_IMAGE_MAX_SIZE_B}
            allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
            onChange={imageChangeHandler}
            reset={imageReset}
            defaultImage={props.game?.imageUrl}
          />
        </div>
        <div className={styles.details}>
          <TextInput
            required={true}
            label="Game Name"
            maxLength={GAME_NAME_MAX_CHARS}
            inputRef={nameRef}
            value={editorData.name}
            onChange={dataChangeHandler}
          />
          <TextArea
            label="Game Description"
            maxLength={GAME_DESC_MAX_CHARS}
            inputRef={descriptionRef}
            value={editorData.description}
            onChange={dataChangeHandler}
          />
        </div>
      </div>
      <div>
        <Button onClick={submit} disabled={submitDisabled}>
          {submitText}
        </Button>
        {resetButton}
      </div>
    </div>
  );
};
