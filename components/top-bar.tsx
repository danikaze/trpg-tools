import { FunctionComponent } from 'react';
import clsx from 'clsx';
import { TOPBAR_Z_INDEX } from '@utils/constants/z-index';
import { PRODUCT_NAME } from '@utils/constants';
import { makeStyles } from '@utils/styles';
import { useUserData } from '@utils/auth';
import logoUrl from '@assets/images/trpg-d20-50px.png';
import { LinkToIndex } from './links/link-to-index';
import { LinkToLogin } from './links/link-to-login';
import { LinkToLogout } from './links/link-to-logout';

export const TOPBAR_HEIGHT = 40;

export interface Props {
  className?: string;
}

const useStyles = makeStyles(({ boxShadow, breakpoints }) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
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
  userData: {},
}));

export const TopBar: FunctionComponent<Props> = ({ className }) => {
  const styles = useStyles();
  const user = getUserElement(styles);

  return (
    <nav className={clsx(className, styles.root)}>
      <LinkToIndex className={styles.topLink}>
        <img
          className={styles.logo}
          src={logoUrl}
          alt={`${PRODUCT_NAME} logo`}
        />
        <div className={styles.name}>{PRODUCT_NAME}</div>
      </LinkToIndex>
      <ul className={styles.links} />
      {user}
    </nav>
  );
};

function getUserElement(
  styles: ReturnType<typeof useStyles>
): JSX.Element | void {
  const user = useUserData();
  if (user) {
    return (
      <div className={styles.userData}>
        {user.username} (<LinkToLogout />)
      </div>
    );
  }
  return <LinkToLogin className={styles.userData} />;
}
