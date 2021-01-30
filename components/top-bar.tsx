import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { TOPBAR_Z_INDEX } from '@utils/constants/z-index';
import { PRODUCT_NAME } from '@utils/constants';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from './links/link-to-index';
import logoUrl from '@assets/images/trpg-d20-50px.png';

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
  topLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginRight: 15,
    height: 30,
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
      <LinkToIndex className={styles.topLink}>
        <img className={styles.logo} src={logoUrl} alt="TRPG Logo" />
        <div className={styles.name}>{PRODUCT_NAME}</div>
      </LinkToIndex>
      <ul className={styles.links} />
    </nav>
  );
};
