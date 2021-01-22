import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { TOPBAR_Z_INDEX } from '@utils/constants/z-index';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from './links/link-to-index';
import { PRODUCT_NAME } from '@utils/constants';

export const TOPBAR_HEIGHT = 40;

export interface Props {
  className?: string;
}

const useStyles = makeStyles(({ boxShadow, breakpoints }) => ({
  root: {
    display: 'flex',
    position: 'sticky',
    top: 0,
    zIndex: TOPBAR_Z_INDEX,
    height: TOPBAR_HEIGHT,
    boxShadow: boxShadow.full,
    alignItems: 'center',
    padding: 0,
    background: 'linear-gradient(0deg, #202020 0%, #404040 100%)',
    color: '#efefef',
    fontWeight: 'bold',
    '&:hover': {
      color: '#fff',
    },
    [breakpoints.up('sm')]: {
      padding: '0 20px',
    },
  },
  name: {
    color: '#ff0000',
    marginRight: 20,
  },
  links: {
    '& li': {
      display: 'inline-block',
      marginRight: 20,
    },
  },
}));

export const TopBar: FunctionComponent<Props> = ({ className }) => {
  const styles = useStyles();

  return (
    <nav className={clsx(className, styles.root)}>
      <div className={styles.name}>{PRODUCT_NAME}</div>
      <ul className={styles.links}>
        <li>
          <LinkToIndex />
        </li>
      </ul>
    </nav>
  );
};
