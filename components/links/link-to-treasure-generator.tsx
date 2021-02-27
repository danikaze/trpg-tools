import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToTreasureGenerator: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href="/treasure-generator">
      <a className={className}>{children || 'Treasure Generator'}</a>
    </Link>
  );
};
