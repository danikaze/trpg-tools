import { AppPage, GetServerSideProps } from './_app';
import { Page } from '@components/page';
import { NameGenerator, Props } from '@components/pages/name-generator';
import { getNameList } from '@api/names/get';
import { namesByRace } from '@utils/constants/names';
import { Race } from '@utils/generate-name';

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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const defaultRace = 'human';
  const defaultType = 'male';
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
