import { DbWidgetDef } from '@model/widget-def/sql';
import Link from 'next/link';
import { FunctionComponent } from 'react';

export interface Props {
  createNew?: boolean;
  widgetDefId?: DbWidgetDef['widgetDefId'];
  className?: string;
}

export const LinkToMyWidgetDefs: FunctionComponent<Props> = ({
  createNew,
  widgetDefId,
  className,
  children,
}) => {
  if (createNew) {
    return (
      <Link href="/widget-defs/new">
        <a className={className}>
          {children || 'Create new Widget Definition'}
        </a>
      </Link>
    );
  }

  return (
    <Link href={`/widget-defs${widgetDefId ? widgetDefId : ''}`}>
      <a className={className}>{children || 'My Widget Definitions'}</a>
    </Link>
  );
};
