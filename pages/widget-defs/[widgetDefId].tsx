import { AppPage } from '../_app';
import { DbWidgetKey } from '@model/widget-key/sql';
import { selectWidgetDef } from '@model/widget-def';
import { DbWidgetDef } from '@model/widget-def/sql';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { Page } from '@components/page';
import { Props, EditWidgetDef } from '@components/pages/widget-defs/edit';

const EditWidgetDefPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="My Widget Definitions"
      description={`My Widget Definitions in ${PRODUCT_NAME}.`}
      header={`My Widget Definitions`}
    >
      <EditWidgetDef {...props} />
    </Page>
  );
};

EditWidgetDefPage.defaultProps = {
  namespacesRequired: [],
};

interface Query {
  widgetId: DbWidgetKey['widgetKeyId'];
}

const notValidProps = {
  widgetDefs: [],
} as Props;

export const getServerSideProps = userRequiredServerSideProps<
  Props,
  Query & { widgetDefId: DbWidgetDef['widgetDefId'] }
>(notValidProps, async (ctx) => {
  const { user } = ctx.req;
  const { widgetDefId } = ctx.query;
  const props: Props = {};

  try {
    props.widgetDef = await selectWidgetDef(user, widgetDefId as string);
  } catch (e) {}

  return { props };
});

export default EditWidgetDefPage;
