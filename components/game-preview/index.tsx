import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { GamePreviewData } from '@model/game';
import { makeStyles } from '@utils/styles';
import { getDateFromTimestamp, formatDate } from '@utils/date';
import { LinkToUser } from '@components/links/link-to-user';
import { LinkToGame } from '@components/links/link-to-game';

export interface Props {
  game: GamePreviewData;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: '30px 0',
    display: 'flex',
  },
  image: {},
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#505050',
    marginBottom: 10,
  },
  description: {
    flexGrow: 1,
  },
  creation: {
    fontSize: 'small',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const GamePreview: FunctionComponent<Props> = ({ game, className }) => {
  const styles = useStyles();
  const { gameId, name, description, imageUrl } = game;

  return (
    <div className={clsx(styles.root, className)}>
      {getImage(styles, gameId, imageUrl)}
      <div className={styles.details}>
        <LinkToGame gameId={gameId} className={styles.name}>
          {name}
        </LinkToGame>
        <div className={styles.description}>{description}</div>
        {getCreation(styles, game)}
      </div>
    </div>
  );
};

function getImage(
  styles: Styles,
  gameId: GamePreviewData['gameId'],
  imageUrl: string | null
): JSX.Element | undefined {
  if (!imageUrl) return;
  return (
    <LinkToGame gameId={gameId}>
      <img className={styles.image} src={imageUrl} />
    </LinkToGame>
  );
}

function getCreation(
  styles: Styles,
  { userId, username, createdOn, updatedOn }: GamePreviewData
): JSX.Element {
  const creationDate = formatDate(getDateFromTimestamp(createdOn));
  const updateDate =
    updatedOn !== createdOn
      ? formatDate(getDateFromTimestamp(updatedOn))
      : undefined;
  const updatedElem = updateDate && ` Last updated on ${updateDate}`;

  return (
    <div className={styles.creation}>
      Created by <LinkToUser>{username}</LinkToUser> on {creationDate}.
      {updatedElem}
    </div>
  );
}
