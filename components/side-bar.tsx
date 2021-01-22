import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from './links/link-to-index';

export interface Props {
  className?: string;
}

const useStyles = makeStyles(({ breakpoints }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(90deg, #3c0000 0%, #630000 100%)',
    color: '#efefef',
    borderTop: '1px solid #940000',
    borderBottom: '1px solid #940000',
    fontWeight: 'bold',
    width: 250,
    padding: 20,
    '&:hover': {
      color: '#fff',
    },
  },
  links: {},
}));

export const SideBar: FunctionComponent<Props> = ({ className }) => {
  const styles = useStyles();

  return (
    <nav className={clsx(styles.root, className)}>
      <ul className={styles.links}>
        <li>
          <LinkToIndex />
        </li>
      </ul>
    </nav>
  );
};
