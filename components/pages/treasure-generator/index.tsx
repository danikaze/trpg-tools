import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { useTreasureGenerator } from './hooks';
import { TreasureForm } from '@components/treasure-form';

export type Props = {};

const useStyles = makeStyles(() => ({
  root: {},
}));

export const TreasureGenerator: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const { generate, treasure } = useTreasureGenerator(props);

  return <TreasureForm treasure={treasure} onSubmit={generate} />;
};
