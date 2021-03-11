import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { PRODUCT_NAME } from '@utils/constants';
import { makeStyles } from '@utils/styles';

export const FOOTER_HEIGHT = 30;

export interface Props {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: FOOTER_HEIGHT,
    fontSize: 'smaller',
    color: '#efefef',
    background: 'linear-gradient(0deg, #202020 0%, #404040 100%)',
  },
}));

export const Footer: FunctionComponent<Props> = ({ className }) => {
  const styles = useStyles();

  return (
    <footer className={clsx(styles.root, className)}>
      {PRODUCT_NAME} {PACKAGE_VERSION}
    </footer>
  );
};
