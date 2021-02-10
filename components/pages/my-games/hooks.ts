import { createNewGame } from '@api/game/client';
import { uploadImage } from '@api/image/client';
import { GameEditorData } from '@components/game-editor';
import { GamePreviewData } from '@model/game';
import { useState } from 'react';
import { Props } from '.';

interface State {
  isCreatorOpen: boolean;
  games: GamePreviewData[] | undefined;
  imageId: number | undefined;
}

export function useMyGames(props: Props) {
  const [state, setState] = useState<State>({
    isCreatorOpen: false,
    games: props.games?.data,
    imageId: undefined,
  });

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
        games: state.games ? [newGame, ...state.games] : [newGame],
        isCreatorOpen: false,
      };
    });
  };

  return {
    toggleCreator,
    createGame,
    onImageChange,
    games: state.games,
    isCreatorOpen: state.isCreatorOpen,
  };
}
