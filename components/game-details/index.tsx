import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { GameDetailsData } from '@model/game';
import { GameEditor, Props as GameEditorProps } from '@components/game-editor';
import { useGameDetails } from './hooks';

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
