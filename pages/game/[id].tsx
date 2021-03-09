import { AppPage, GetServerSideProps } from '../_app';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { Game, Props } from '@components/pages/game';
import { selectGameDetails } from '@model/game';
import { userRequired } from '@utils/auth';
import { DbGame } from '@model/game/sql';
import { getUserNoteDefinitions } from '@model/note-definition';
import { selectNotes } from '@model/note';

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
  id: DbGame['id'];
}

const notValidProps = {
  props: {
    noteDefinitions: null,
    game: null,
    selectednoteDefId: null,
    notes: null,
  },
} as { props: Props };

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
  ctx
) => {
  if (userRequired(ctx) || !ctx.req.user) {
    return notValidProps;
  }

  const {
    req: { user },
  } = ctx;
  const gameId = ctx.params?.id;

  const [game, noteDefinitions] = await Promise.all([
    (user && gameId && selectGameDetails(user, gameId)) || null,
    (user && gameId && getUserNoteDefinitions(user)) || null,
  ]);
  if (!game || !noteDefinitions) return notValidProps;

  const selectednoteDefId = noteDefinitions[0].noteDefId || null;
  const notes =
    selectednoteDefId && gameId
      ? await selectNotes(user, selectednoteDefId, gameId, 0)
      : null;

  const props: Props = {
    noteDefinitions,
    notes,
    selectednoteDefId,
    game: game || null,
  };

  return {
    props,
  };
};

export default GameDetailPage;
