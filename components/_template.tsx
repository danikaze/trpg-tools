import clsx from 'clsx';
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

export const TemplateElement: FunctionComponent<Props> = ({ className }) => {
  const styles = useStyles();

  return <div className={clsx(styles.root, className)}>Template</div>;
};
