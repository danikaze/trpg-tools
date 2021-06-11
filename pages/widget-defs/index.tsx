import { AppPage } from '@_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { DbWidgetKey } from '@model/widget-key/sql';
import { Page } from '@components/page';
import { Props, WidgetDefs } from '@components/pages/widget-defs/list';
import { selectAllUserWidgetDefs } from '@model/widget-def';

const WidgetDefsPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="My Widget Definitions"
      description={`My Widget Definitions in ${PRODUCT_NAME}.`}
      header={`My Widget Definitions`}
    >
      <WidgetDefs {...props} />
    </Page>
  );
};

WidgetDefsPage.defaultProps = {
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
  async (ctx) => {
    const { user } = ctx.req;

    const widgetDefs = await selectAllUserWidgetDefs(user);

    const props: Props = {
      widgetDefs,
    };

    return { props };
  }
);

export default WidgetDefsPage;
