import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from '@components/links/link-to-index';
import { LinkToCharacterNameGenerator } from '@components/links/link-to-character-name-generator';
import { LinkToTreasureGenerator } from '@components/links/link-to-treasure-generator';
import { LinkToMyGames } from '@components/links/link-to-my-games';
import { LinkToMyWidgets } from '@components/links/link-to-my-widgets';

export interface Props {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(90deg, #3c0000 0%, #630000 100%)',
    color: '#ececec',
    borderTop: '1px solid #940000',
    borderBottom: '1px solid #940000',
    fontWeight: 'bold',
    padding: 20,
    '& li': {
      marginTop: 10,
      '&:hover': {
        color: '#fff',
      },
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
        <li>
          <LinkToCharacterNameGenerator />
        </li>
        <li>
          <LinkToTreasureGenerator />
        </li>
        <li>
          <LinkToMyGames />
        </li>
        <li>
          <LinkToMyWidgets />
        </li>
      </ul>
    </nav>
  );
};
