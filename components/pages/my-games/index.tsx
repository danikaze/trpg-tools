import { FunctionComponent } from 'react';
import { GamePreviewData } from '@model/game';
import { makeStyles } from '@utils/styles';
import { Paginated } from '@utils/mysql';
import { GameEditor } from '@components/game-editor';
import { useMyGames } from './hooks';
import { GamePreview } from '@components/game-preview';
import { Pagination } from '@components/pagination';
import { LinkToMyGames } from '@components/links/link-to-my-games';

export interface Props {
  pages?: Paginated<GamePreviewData>;
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
    pages,
    isCreatorOpen,
    toggleCreator,
    createGame,
    onImageChange,
  } = useMyGames(props);

  const gameList = pages
    ? renderGameList(styles, pages)
    : renderEmptyList(styles);

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

function renderGameList(
  styles: Styles,
  pages: Paginated<GamePreviewData>
): JSX.Element {
  const games = pages.data;
  const list = games.map((game) => (
    <GamePreview key={game.gameId} game={game} />
  ));
  const pagination = (
    <Pagination
      page={pages.page}
      totalPages={pages.totalPages}
      LinkElem={LinkToMyGames}
    />
  );

  return (
    <>
      <div>{list}</div>
      {pagination}
    </>
  );
}
