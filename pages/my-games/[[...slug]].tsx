import { AppPage } from '../_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { MyGames, Props } from '@components/pages/my-games';
import { selectUserGames } from '@model/game';

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

export const getServerSideProps = userRequiredServerSideProps<Props>(
  {},
  async (ctx) => {
    const {
      req: { user, url },
    } = ctx;
    const { page } = getParams(url!);

    const props: Props = {
      pages: await selectUserGames(user, page),
    };

    return {
      props,
    };
  }
);

function getParams(url: string) {
  // url is something like '/my-games/page/2' in server side
  // and '/_next/data/development/my-games/page/3.json?slug=page&slug=3'
  // in client side
  const match = /page\/(\d+)/.exec(url);
  return {
    page: ((match && Number(match[1])) || 1) - 1,
  };
}

export default MyGamesPage;
