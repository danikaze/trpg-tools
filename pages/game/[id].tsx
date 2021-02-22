import { AppPage, GetServerSideProps } from '../_app';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { Game, Props } from '@components/pages/game';
import { selectGameDetails } from '@model/game';
import { userRequired } from '@utils/auth';
import { DbGame } from '@model/sql/game';

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

export const getServerSideProps: GetServerSideProps<Props, Query> = async (
  ctx
) => {
  userRequired(ctx);
  const {
    req: { user },
  } = ctx;
  const gameId = ctx.params?.id;

  const props: Props = {
    game: (user && gameId && (await selectGameDetails(user, gameId))) || null,
  };

  return {
    props,
  };
};

export default GameDetailPage;
