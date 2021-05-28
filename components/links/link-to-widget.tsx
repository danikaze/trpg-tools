import { DbWidgetKey } from '@model/widget-key/sql';
import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  widgetKeyId: DbWidgetKey['widgetKeyId'];
  className?: string;
}

export const LinkToWidget: FunctionComponent<Props> = ({
  widgetKeyId,
  className,
  children,
}) => {
  return (
    <Link href={`/widget/${widgetKeyId}`}>
      <a className={className}>{children || 'Preview Widget'}</a>
    </Link>
  );
};
