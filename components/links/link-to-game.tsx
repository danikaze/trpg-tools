import Link from 'next/link';
import { FunctionComponent, ReactNode } from 'react';
import { DbGame } from '@model/sql/game';

export interface Props {
  gameId: DbGame['id'];
  children: ReactNode;
  className?: string;
}

export const LinkToGame: FunctionComponent<Props> = ({
  gameId,
  children,
  className,
}) => {
  const url = `/game/${gameId}`;

  return (
    <Link href={url}>
      <a className={className}>{children}</a>
    </Link>
  );
};
