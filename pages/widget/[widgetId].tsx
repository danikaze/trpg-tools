import { AppPage, GetServerSideProps } from '../_app';
import { PRODUCT_NAME } from '@utils/constants';
import { EmptyPage } from '@components/page-empty';
import { Widget, Props } from '@components/pages/widget';
import { selectApiKey } from '@model/api-key';
import { selectNote } from '@model/note';
import { UserAuthData } from '@model/user';

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

// tslint:disable:no-magic-numbers
const fields = {
  alignment: 6,
  race: 7,
  class: 8,
  level: 9,
  hp: 10,
  hpMax: 11,
  hpTemp: 12,
  str: 13,
  dex: 14,
  con: 15,
  int: 16,
  wis: 17,
  cha: 18,
  ac: 19,
};
// tslint:enable:no-magic-numbers

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

    const apiKey = await selectApiKey('selectNote', widgetId);
    if (!apiKey) return {};

    const user = { userId: apiKey.userId } as UserAuthData;
    const initialData = await selectNote(user, apiKey.data.noteId);
    if (!initialData) return {};

    return {
      widgetId,
      initialData,
      fields,
    };
  } catch (e) {
    return {};
  }
}

export default WidgetPage;
