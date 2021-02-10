import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToMyGames: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href="/my-games">
      <a className={className}>{children || 'My Games'}</a>
    </Link>
  );
};
