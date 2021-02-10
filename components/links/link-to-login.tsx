import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToLogin: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href={AUTH_LOGIN_PAGE}>
      <a className={className}>{children || 'Log In'}</a>
    </Link>
  );
};
