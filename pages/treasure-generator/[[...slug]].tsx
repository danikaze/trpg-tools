import { AppPage } from '../_app';
import { Page } from '@components/page';
import { TreasureGenerator, Props } from '@components/pages/treasure-generator';

const TreasureGeneratorPage: AppPage<Props> = (props) => {
  return (
    <Page
      title="Treasure Generator"
      description="Treasure generator for Dungeons & Dragons 5e"
      header="Treasure Generator"
    >
      <TreasureGenerator {...props} />
    </Page>
  );
};

TreasureGeneratorPage.defaultProps = {
  namespacesRequired: [],
};

export default TreasureGeneratorPage;
