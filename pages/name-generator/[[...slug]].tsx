import { AppPage, GetServerSideProps } from '../_app';
import { Page } from '@components/page';
import { NameGenerator, Props } from '@components/pages/name-generator';
import { getNameList } from '@api/names/get';
import { namesByRace } from '@utils/constants/names';
import { NameType, Race } from '@utils/generate-name';
import { getFirstKey } from '@utils/get-first-key';

const NameGeneratorPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="Character Name Generator"
      description="Fantasy name generator for your characters"
      header="Character Name Generator"
    >
      <NameGenerator {...props} />
    </Page>
  );
};

NameGeneratorPage.defaultProps = {
  namespacesRequired: [],
};

export default NameGeneratorPage;

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { defaultRace, defaultType } = getParams(ctx.req.url!);
  const defaultNames = getNameList(defaultRace, defaultType);

  const races = Object.entries(namesByRace).map(([key, def]) => ({
    key: key as Race,
    name: def.race,
    description: def.description,
    types: Object.entries(def.types).map(([typeKey, typeDef]) => ({
      key: typeKey,
      name: typeDef.description,
    })),
  }));

  return {
    props: {
      races,
      defaultRace,
      defaultType,
      defaultNames,
    },
  };
};

function getParams(url: string) {
  // tslint:disable:no-magic-numbers
  // url is something like '/name-generator/race/type' in server side
  // and in client side it would be like
  // '/_next/data/development/name-generator/race/type.json?slug=race&slug=type'
  const match = /name-generator\/([^/]+)(\/([^/.]*))?/.exec(url);
  let defaultRace = (match && match[1]) as Race;
  let defaultType = (match && match[3]) as NameType<Race>;

  if (!namesByRace[defaultRace as Race]) {
    defaultRace = 'human';
  }
  if (
    !namesByRace[defaultRace] ||
    !namesByRace[defaultRace].types[defaultType]
  ) {
    defaultType = getFirstKey(
      namesByRace[defaultRace as Race].types
    ) as NameType<Race>;
  }

  return {
    defaultRace,
    defaultType,
  };
}
