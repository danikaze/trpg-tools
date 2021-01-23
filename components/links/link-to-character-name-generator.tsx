import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToCharacterNameGenerator: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href="/name-generator">
      <a className={className}>{children || 'Character Name Generator'}</a>
    </Link>
  );
};
