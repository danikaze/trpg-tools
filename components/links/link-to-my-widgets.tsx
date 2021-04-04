import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToMyWidgets: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href="/widgets">
      <a className={className}>{children || 'My Widgets'}</a>
    </Link>
  );
};
