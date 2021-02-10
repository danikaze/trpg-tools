import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  className?: string;
}

export const LinkToLogout: FunctionComponent<Props> = ({
  className,
  children,
}) => {
  return (
    <Link href={AUTH_DO_LOGOUT_URL}>
      <a className={className}>{children || 'Log Out'}</a>
    </Link>
  );
};
