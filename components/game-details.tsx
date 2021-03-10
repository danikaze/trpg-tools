import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { GameDetailsData, GameUpdateData } from '@model/game';
import { uploadImage } from '@api/image/client';
import { deleteGame, updateGame } from '@api/game/client';
import {
  GameEditor,
  GameEditorData,
  Props as GameEditorProps,
} from './game-editor';

export interface Props {
  game: GameDetailsData;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  // actions
  actions: {},
  editButton: {},
  deleteButton: {},
  // game
  game: {
    width: 620,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {},
  image: {},
  description: {},
}));

type Styles = ReturnType<typeof useStyles>;

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

export const GameDetails: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    toggleEditGame,
    submitEditGame,
    onImageChange,
    deleteGame,
    game,
    isEditingGame,
    className,
  } = useGameDetails(props);

  const actionButtons = renderActionButtons(
    styles,
    isEditingGame,
    game.permission,
    toggleEditGame,
    deleteGame
  );
  const gameDetails = isEditingGame
    ? renderGameEditor(game, submitEditGame, onImageChange)
    : renderGameDetails(styles, game);

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.actions}>{actionButtons}</div>
      <div className={styles.game}>{gameDetails}</div>
    </div>
  );
};

function getImage(
  styles: Styles,
  imageUrl?: Props['game']['imageUrl']
): JSX.Element | undefined {
  if (!imageUrl) return;
  return <img className={styles.image} src={imageUrl} />;
}

function renderGameDetails(styles: Styles, game: GameDetailsData): JSX.Element {
  return (
    <>
      <div className={styles.name}>{game.name}</div>
      <div className={styles.info}>
        {getImage(styles, game.imageUrl)}
        <div className={styles.description}>{game.description}</div>
      </div>
    </>
  );
}

function renderActionButtons(
  styles: Styles,
  isEditingGame: boolean,
  permission: GameDetailsData['permission'],
  toggleEdit: () => void,
  deleteGame: () => Promise<void>
): JSX.Element | undefined {
  if (permission !== 'owner' && permission !== 'edit') return;
  return (
    <div className={styles.actions}>
      <button className={styles.editButton} onClick={toggleEdit}>
        {isEditingGame ? 'Cancel' : 'Edit'}
      </button>
      <button className={styles.deleteButton} onClick={deleteGame}>
        Delete
      </button>
    </div>
  );
}

function renderGameEditor(
  game: GameDetailsData,
  submitEditGame: GameEditorProps['onSubmit'],
  onImageChange: (image: File | null) => Promise<void>
): JSX.Element {
  return (
    <GameEditor
      mode="edit"
      game={game}
      onSubmit={submitEditGame}
      onImageChange={onImageChange}
    />
  );
}
