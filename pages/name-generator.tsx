import { AppPage } from './_app';
import { Page } from '@components/page';
import { NameGenerator, Props } from '@components/pages/name-generator';

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
