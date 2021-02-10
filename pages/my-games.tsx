import { AppPage, GetServerSideProps } from './_app';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { MyGames, Props } from '@components/pages/my-games';
import { selectUserGames } from '@model/game';
import { userRequired } from '@utils/auth';

const MyGamesPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="My Games"
      description={`My games in ${PRODUCT_NAME}.`}
      header={`My Games`}
    >
      <MyGames {...props} />
    </Page>
  );
};

MyGamesPage.defaultProps = {
  namespacesRequired: [],
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  userRequired(ctx);
  const {
    req: { user },
  } = ctx;

  const props: Props = {};
  if (user) {
    props.games = await selectUserGames(user.id);
  }

  return {
    props,
  };
};

export default MyGamesPage;
