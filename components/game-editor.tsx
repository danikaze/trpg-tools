import clsx from 'clsx';
import { createRef, FunctionComponent, useState } from 'react';
import { GAME_DESC_MAX_CHARS, GAME_NAME_MAX_CHARS } from '@utils/constants';
import { makeStyles } from '@utils/styles';
import { ImageDropInput } from './user-input/image-drop-input';
import { TextInput } from './user-input/text-input';
import { TextArea } from './user-input/textarea';
import { Button } from './user-input/button';

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

interface State {
  data: GameEditorData;
  imageReset: number;
  isWorking: boolean;
}

function useGameEditor(props: Props) {
  const { game } = props;
  const [state, setState] = useState<State>({
    data: {
      name: (game && game.name) || '',
      description: (game && game.description) || '',
      image: (game && game.imageUrl) || null,
    },
    imageReset: 0,
    isWorking: false,
  });

  function setEditorData(data: Partial<State['data']>, working?: boolean) {
    setState((state) => ({
      ...state,
      isWorking: working === undefined ? state.isWorking : working,
      data: {
        ...state.data,
        ...data,
      },
    }));
  }

  function setWorking(working: boolean) {
    setState((state) => ({
      ...state,
      isWorking: working,
    }));
  }

  function resetEditor() {
    setState((state) => ({
      ...state,
      data: {
        name: (game && game.name) || '',
        description: (game && game.description) || '',
        image: (game && game.imageUrl) || null,
      },
      imageReset: state.imageReset + 1,
      isWorking: false,
    }));
  }

  const submit = async () => {
    setWorking(true);
    await props.onSubmit(state.data);
    resetEditor();
  };

  const imageChangeHandler = async (image: File | null) => {
    if (image === state.data.image) return;
    setEditorData({ image }, true);
    props.onImageChange && (await props.onImageChange(image));
    setWorking(false);
  };

  const dataChangeHandler = async () => {
    const newData = {
      name: nameRef.current!.value,
      description: descriptionRef.current!.value,
    };
    setEditorData(newData);
    props.onDataChange && (await props.onDataChange(newData));
    setWorking(false);
  };

  const nameRef = createRef<HTMLInputElement>();
  const descriptionRef = createRef<HTMLTextAreaElement>();

  return {
    submit,
    imageChangeHandler,
    dataChangeHandler,
    nameRef,
    descriptionRef,
    editorData: state.data,
    imageReset: state.imageReset,
    submitDisabled: state.isWorking,
    titleText: props.mode === 'create' ? 'Create New Game' : 'Edit Game',
    submitText: props.mode === 'create' ? 'Create' : 'Update',
    reset: props.mode === 'create' ? undefined : resetEditor,
  };
}

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
