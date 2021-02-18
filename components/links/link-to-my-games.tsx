import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
  page?: number;
}

export const LinkToMyGames: FunctionComponent<Props> = ({
  className,
  page,
  children,
}) => {
  const url = page! > 0 ? `/my-games/page/${page! + 1}` : `/my-games`;

  return (
    <Link href={url}>
      <a className={className}>{children || 'My Games'}</a>
    </Link>
  );
};
