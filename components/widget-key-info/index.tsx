import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { WidgetKeyData, WidgetKeyType } from '@model/widget-key';
import { DbWidgetKey } from '@model/widget-key/sql';
import { Button } from '@components/user-input/button';
import { LinkToWidget } from '@components/links/link-to-widget';

export interface Props {
  widgetKey: Omit<WidgetKeyData<WidgetKeyType>, 'userId'>;
  renameWidgetKey?: (widgetKeyId: DbWidgetKey['widgetKeyId']) => void;
  deleteWidgetKey?: (widgetKeyId: DbWidgetKey['widgetKeyId']) => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const WidgetKeyInfo: FunctionComponent<Props> = ({
  widgetKey,
  renameWidgetKey,
  deleteWidgetKey,
  className,
}) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)}>
      <div>
        <LinkToWidget widgetKeyId={widgetKey.widgetKeyId}>
          {widgetKey.name}
        </LinkToWidget>
      </div>
      <div>
        {renderRenameButton(widgetKey, renameWidgetKey)}
        {renderDeleteButton(widgetKey, deleteWidgetKey)}
      </div>
    </div>
  );
};

function renderRenameButton(
  widgetKey: Props['widgetKey'],
  renameWidgetKey?: Props['renameWidgetKey']
): JSX.Element | null {
  if (!renameWidgetKey) return null;

  const handler = () => renameWidgetKey(widgetKey.widgetKeyId);

  return <Button onClick={handler}>Rename</Button>;
}

function renderDeleteButton(
  widgetKey: Props['widgetKey'],
  deleteWidgetKey?: Props['deleteWidgetKey']
): JSX.Element | null {
  if (!deleteWidgetKey) return null;

  const handler = () => deleteWidgetKey(widgetKey.widgetKeyId);

  return <Button onClick={handler}>Delete</Button>;
}
