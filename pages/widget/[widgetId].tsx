import { AppPage, GetServerSideProps } from '../_app';
import { PRODUCT_NAME } from '@utils/constants';
import { EmptyPage } from '@components/page-empty';
import { Widget, Props } from '@components/pages/widget';
import { UserAuthData } from '@model/user';
import { getWidgetData, selectWidgetKey } from '@model/widget-key';

const WidgetPage: AppPage<Props> = (props) => {
  return (
    <EmptyPage
      title="TRPG Widget"
      description={`My widget in ${PRODUCT_NAME}.`}
    >
      <Widget {...props} />
    </EmptyPage>
  );
};

WidgetPage.defaultProps = {
  namespacesRequired: [],
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const props: Props = await getParams(ctx);

  return {
    props,
  };
};

async function getParams(ctx: Parameters<typeof getServerSideProps>[0]) {
  try {
    const widgetId = ctx.query.widgetId as string;
    if (!widgetId) return {};

    const widget = await selectWidgetKey(widgetId);
    if (!widget) return {};

    const user = { userId: widget.userId } as UserAuthData;
    const { type } = widget;

    const initialData = await getWidgetData(user, type, widget.data);
    if (!initialData) return {};

    return {
      widgetId,
      type,
      initialData,
    };
  } catch (e) {
    return {};
  }
}

export default WidgetPage;
