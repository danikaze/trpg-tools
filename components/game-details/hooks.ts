import { useState } from 'react';
import { useRouter } from 'next/router';
import { uploadImage } from '@api/image/client';
import { deleteGame, updateGame } from '@api/game/client';
import { GameEditorData } from '@components/game-editor';
import { GameDetailsData, GameUpdateData } from '@model/game';
import { Props } from './';

interface State {
  isEditingGame: boolean;
  newImage:
    | undefined
    | {
        imageId: number;
        path: string;
      };
  game: GameDetailsData;
}

export function useGameDetails(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<State>({
    isEditingGame: false,
    newImage: undefined,
    game: props.game!,
  });

  function toggleEditGame() {
    setState((state) => ({
      ...state,
      isEditingGame: !state.isEditingGame,
    }));
  }

  async function onImageChange(image: File | null) {
    if (!image) {
      setState({
        ...state,
        newImage: undefined,
      });
      return;
    }

    const uploadedImage = await uploadImage(['game'], image);
    const imageUrl = uploadedImage.thumbnails.find(
      (img) => img.type === 'gameBanner'
    )!.path;
    setState({
      ...state,
      newImage: { imageId: uploadedImage.imageId, path: imageUrl },
    });
  }

  async function submitEditGame(data: GameEditorData) {
    const game = props.game!;
    const updateData: GameUpdateData = {
      name: data.name,
      description: data.description,
    };
    if (state.newImage !== undefined) {
      updateData.imageId = state.newImage.imageId;
    }
    const res = await updateGame(
      game.gameId,
      state.game.updatedOn as number,
      updateData
    );
    if (!res) return;

    setState((state) => ({
      ...state,
      isEditingGame: false,
      game: {
        ...state.game,
        name: data.name,
        description: data.description,
        updatedOn: res.updatedOn,
        imageUrl: state.newImage ? state.newImage.path : state.game.imageUrl,
      },
    }));
  }

  async function confirmAndDelete() {
    const doIt = confirm('Delete game? This is a permanent action.');
    if (!doIt) return;

    try {
      await deleteGame(state.game.gameId);
      router.push('/my-games');
    } catch (e) {}
  }

  return {
    toggleEditGame,
    submitEditGame,
    onImageChange,
    deleteGame: confirmAndDelete,
    game: state.game,
    isEditingGame: state.isEditingGame,
    className: props.className,
  };
}
