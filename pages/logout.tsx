import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { logoutRequired } from '@utils/auth';
import { AppPage } from './_app';

const Logout: AppPage = () => {
  return (
    <>
      <div>
        <Head>
          <title>
            {PACKAGE_NAME} - {PACKAGE_VERSION} ({COMMIT_HASH_SHORT})
          </title>
        </Head>

        <main>
          <h3>Logged out</h3>
        </main>
        <div>PRODUCTION: {IS_PRODUCTION ? 'true' : 'false'}</div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  logoutRequired(ctx);

  return {
    props: {
      user: false,
    },
  };
};

export default Logout;
