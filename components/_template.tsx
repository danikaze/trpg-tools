import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
}));

export const TemplateElement: FunctionComponent = () => {
  const styles = useStyles();

  return <div className={styles.root}>Template</div>;
};
