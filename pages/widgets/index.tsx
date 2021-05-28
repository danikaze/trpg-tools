import { AppPage } from '../_app';
import { userRequiredServerSideProps } from '@utils/auth';
import { PRODUCT_NAME } from '@utils/constants';
import { DbWidgetKey } from '@model/widget-key/sql';
import { selectAllUserWidgetKeys } from '@model/widget-key';
import { Page } from '@components/page';
import { Props, Widgets } from '@components/pages/widgets';
import { selectAllUserNotesByType } from '@model/note';
import { getSystemNoteDefinitions } from '@model/global';
import { selectAllUserWidgetDefs } from '@model/widget-def';

const WidgetsPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="My Widgets"
      description={`My Widgets in ${PRODUCT_NAME}.`}
      header={`My Widgets`}
    >
      <Widgets {...props} />
    </Page>
  );
};

WidgetsPage.defaultProps = {
  namespacesRequired: [],
};

interface Query {
  widgetId: DbWidgetKey['widgetKeyId'];
}

const notValidProps = {
  widgetApiKeys: null,
} as Props;

export const getServerSideProps = userRequiredServerSideProps<Props, Query>(
  notValidProps,
  async (ctx) => {
    const { user } = ctx.req;

    const systemNoteDefs = await getSystemNoteDefinitions();
    const noteDefIds = [systemNoteDefs.pcs.noteDefId];
    const notesByGame = await selectAllUserNotesByType(user, noteDefIds);
    const widgetDefs = await selectAllUserWidgetDefs(user);
    const widgetApiKeys = await selectAllUserWidgetKeys(user);

    const props: Props = {
      widgetDefs,
      widgetApiKeys,
      notesByGame,
    };

    return { props };
  }
);

export default WidgetsPage;
