import { AppPage } from '../_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { DbWidgetKey } from '@model/widget-key/sql';
import { Page } from '@components/page';
import { Props, NewWidgetDefs } from '@components/pages/widget-defs/new';

const NewWidgetDefsPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="Create new Widget Definition"
      description={`Create new Widget Definition in ${PRODUCT_NAME}.`}
      header={`Create new Widget Definition`}
    >
      <NewWidgetDefs {...props} />
    </Page>
  );
};

NewWidgetDefsPage.defaultProps = {
  namespacesRequired: [],
};

interface Query {
  widgetId: DbWidgetKey['widgetKeyId'];
}

const notValidProps = {
  widgetDefs: [],
} as Props;

export const getServerSideProps = userRequiredServerSideProps<Props, Query>(
  notValidProps,
  async () => {
    const props: Props = {};

    return { props };
  }
);

export default NewWidgetDefsPage;
