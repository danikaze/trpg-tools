import { FunctionComponent } from 'react';
import { GamePreviewData } from '@model/game';
import { makeStyles } from '@utils/styles';
import { GameEditor } from '@components/game-editor';
import { useMyGames } from './hooks';
import { GamePreview } from '@components/game-preview';

export interface Props {
  games: GamePreviewData[];
}

const useStyles = makeStyles(() => ({
  root: {},
  button: {
    display: 'inline-block',
    cursor: 'pointer',
  },
  hidden: {
    display: 'none',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const MyGames: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    games,
    isCreatorOpen,
    toggleCreator,
    createGame,
    onImageChange,
  } = useMyGames(props);

  const gameList =
    games.length > 0 ? renderGameList(styles, games) : renderEmptyList(styles);

  return (
    <div className={styles.root}>
      <div className={styles.button} onClick={toggleCreator}>
        Create new game
      </div>
      <GameEditor
        mode="create"
        className={(!isCreatorOpen && styles.hidden) || ''}
        onSubmit={createGame}
        onImageChange={onImageChange}
      />
      {gameList}
    </div>
  );
};

function renderEmptyList(styles: Styles): JSX.Element {
  return <div>No games yet.</div>;
}

function renderGameList(styles: Styles, games: GamePreviewData[]): JSX.Element {
  const list = games.map((game) => <GamePreview key={game.id} game={game} />);
  return <div>{list}</div>;
}
