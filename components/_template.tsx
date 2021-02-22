import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';

export interface Props {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const TemplateElement: FunctionComponent<Props> = () => {
  const styles = useStyles();

  return <div className={styles.root}>Template</div>;
};
