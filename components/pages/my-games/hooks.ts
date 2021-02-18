import { useEffect, useState } from 'react';
import { createNewGame } from '@api/game/client';
import { uploadImage } from '@api/image/client';
import { GameEditorData } from '@components/game-editor';
import { GamePreviewData } from '@model/game';
import { Paginated } from '@utils/mysql';
import { Props } from '.';

interface State {
  isCreatorOpen: boolean;
  pages: Paginated<GamePreviewData> | undefined;
  imageId: number | undefined;
}

export function useMyGames(props: Props) {
  const [state, setState] = useState<State>({
    isCreatorOpen: false,
    pages: props.pages,
    imageId: undefined,
  });

  // need to update the state on page change
  useEffect(() => {
    setState((state) => ({
      ...state,
      pages: props.pages,
    }));
  }, [props.pages?.page]);

  const toggleCreator = () =>
    setState({
      ...state,
      isCreatorOpen: !state.isCreatorOpen,
    });

  const onImageChange = async (image: File | null) => {
    let imageId: number | undefined;
    if (image) {
      const uploadedImage = await uploadImage(['game'], image);
      imageId = uploadedImage.id;
    }

    setState({
      ...state,
      imageId,
    });
  };

  const createGame = async (data: GameEditorData) => {
    const newGame = await createNewGame({
      name: data.name,
      description: data.description,
      imageId: state.imageId,
    });

    setState((state) => {
      return {
        ...state,
        isCreatorOpen: false,
        pages: state.pages
          ? {
              ...state.pages,
              data: [newGame, ...state.pages.data],
            }
          : undefined,
      };
    });
  };

  return {
    toggleCreator,
    createGame,
    onImageChange,
    pages: state.pages,
    isCreatorOpen: state.isCreatorOpen,
  };
}
