import { AppPage } from '@_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { Game, Props } from '@components/pages/game';
import { selectGameDetails } from '@model/game';
import { DbGame } from '@model/game/sql';
import { getUserNoteDefinitions } from '@model/note-definition';
import { selectNotes } from '@model/note';
import { selectUserKeys } from '@model/api-key';

const GameDetailPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="Game Details"
      description={`Game Details in ${PRODUCT_NAME}.`}
      header={`Game Details`}
    >
      <Game {...props} />
    </Page>
  );
};

GameDetailPage.defaultProps = {
  namespacesRequired: [],
};

interface Query {
  gameId: DbGame['gameId'];
}

const notValidProps = {
  noteDefinitions: null,
  game: null,
  selectednoteDefId: null,
  notes: null,
} as Props;

export const getServerSideProps = userRequiredServerSideProps<Props, Query>(
  notValidProps,
  async (ctx) => {
    const {
      req: { user },
    } = ctx;
    const gameId = ctx.params?.gameId;

    const [game, noteDefinitions, apiKeys] = await Promise.all([
      (user && gameId && selectGameDetails(user, gameId)) || null,
      (user && gameId && getUserNoteDefinitions(user)) || null,
      (user && selectUserKeys(user, ['updateNote'])) || null,
    ]);
    if (!game || !noteDefinitions) return { props: notValidProps };

    const selectednoteDefId = noteDefinitions[0].noteDefId || null;
    const notes =
      selectednoteDefId && gameId
        ? await selectNotes(user, selectednoteDefId, gameId, 0)
        : null;

    const props: Props = {
      noteDefinitions,
      notes,
      selectednoteDefId,
      game,
      apiKeys,
    };

    return {
      props,
    };
  }
);

export default GameDetailPage;
