import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';

export interface Props {
  className?: string;
  required?: boolean;
}

const useStyles = makeStyles(() => ({
  root: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
  },
}));

export const Label: FunctionComponent<Props> = ({
  className,
  required,
  children,
}) => {
  const styles = useStyles();
  const text = required ? `${children} *` : children;

  return <div className={clsx(styles.root, className)}>{text}</div>;
};
