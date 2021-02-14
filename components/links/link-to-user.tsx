// import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToUser: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    // <Link href="/">
    <a className={className}>{children}</a>
    // </Link>
  );
};
