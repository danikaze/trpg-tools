import { FunctionComponent } from 'react';
import { Paginated } from '@utils/mysql';
import { makeStyles } from '@utils/styles';
import { GameDetailsData } from '@model/game';
import { NoteData } from '@model/note';
import { ApiKeyData } from '@model/api-key';
import { RetrievedNoteDefinition } from '@model/note-definition';
import { GameDetails } from '@components/game-details';
import { LinkToMyGames } from '@components/links/link-to-my-games';
import { GameNotes } from '@components/game-notes';

export interface Props {
  game: GameDetailsData | null;
  noteDefinitions: RetrievedNoteDefinition[] | null;
  selectednoteDefId: RetrievedNoteDefinition['noteDefId'] | null;
  notes: Paginated<NoteData> | null;
  apiKeys: ApiKeyData<'selectNote' | 'updateNote'>[];
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gameDetails: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const Game: FunctionComponent<Props> = (props) => {
  const styles = useStyles();

  if (!props.game || !props.noteDefinitions || !props.notes) {
    return renderNotFound();
  }

  return (
    <div className={styles.root}>
      <GameDetails game={props.game} />
      <GameNotes
        gameId={props.game.gameId}
        noteDefinitions={props.noteDefinitions}
        selectednoteDefId={props.selectednoteDefId}
        notes={props.notes}
        apiKeys={props.apiKeys}
      />
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
