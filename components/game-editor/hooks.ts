import { createRef, useState } from 'react';
import { GameEditorData, Props } from '.';

interface State {
  data: GameEditorData;
  imageReset: number;
  isWorking: boolean;
}

export function useGameEditor(props: Props) {
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
