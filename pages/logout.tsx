import Head from 'next/head';
import { logoutRequiredServerSideProps } from '@utils/auth';
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

const props = { user: false };
export const getServerSideProps = logoutRequiredServerSideProps(
  props,
  async () => ({ props })
);

export default Logout;
