import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';

export interface Props {
  className?: string;
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'inline-block',
    margin: 10,
    padding: '7px 15px',
    fontWeight: 'bold',
    borderRadius: 5,
  },
  enabled: {
    cursor: 'pointer',
    color: '#3d3d6d',
    background: '#eaf5ff',
    '&:hover': {
      color: '#31344a',
      background: '#d7ebfd',
    },
  },
  disabled: {
    color: '#a7a79b',
    background: '#e3eaf1',
  },
}));

export const Button: FunctionComponent<Props> = ({
  className,
  title,
  onClick,
  children,
  disabled,
}) => {
  const styles = useStyles();
  const classes = clsx(
    styles.root,
    disabled ? styles.disabled : styles.enabled,
    className
  );

  return (
    <div
      className={classes}
      title={title}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};
