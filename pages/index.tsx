import { AppPage } from '@_app';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { Index, Props } from '@components/pages/index';

const IndexPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="Index"
      description={`Index page of ${PRODUCT_NAME}.`}
      header={`${PRODUCT_NAME} Index`}
    >
      <Index {...props} />
    </Page>
  );
};

IndexPage.defaultProps = {
  namespacesRequired: [],
};

export default IndexPage;
