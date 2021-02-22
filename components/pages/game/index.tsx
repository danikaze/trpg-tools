import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { GameDetailsData } from '@model/game';
import { GameDetails } from '@components/game-details';
import { LinkToMyGames } from '@components/links/link-to-my-games';

export interface Props {
  game: GameDetailsData | null;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  gameDetails: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const Game: FunctionComponent<Props> = (props) => {
  const styles = useStyles();

  if (!props.game) return renderNotFound();

  return (
    <div className={styles.root}>
      <GameDetails game={props.game} />
    </div>
  );
};

function renderNotFound(): JSX.Element {
  return (
    <div>
      Game not found. <LinkToMyGames>Back to My Games</LinkToMyGames>.
    </div>
  );
}
