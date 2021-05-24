import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { SelectAllWidgetDefData } from '@model/widget-def';
import { makeStyles } from '@utils/styles';
import { Button } from '@components/user-input/button';

export interface Props {
  widgetDef: SelectAllWidgetDefData;
  onEdit?: (widgetDefId: SelectAllWidgetDefData['widgetDefId']) => void;
  onDelete?: (widgetDefId: SelectAllWidgetDefData['widgetDefId']) => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const WidgetDefInfo: FunctionComponent<Props> = ({
  widgetDef,
  onEdit,
  onDelete,
  className,
}) => {
  const styles = useStyles();

  return (
    <div className={clsx(styles.root, className)}>
      <div>{widgetDef.name}</div>
      <div>
        {renderEditButton(widgetDef, onEdit)}
        {renderDeleteButton(widgetDef, onDelete)}
      </div>
    </div>
  );
};

function renderEditButton(
  widgetDef: Props['widgetDef'],
  onEdit?: Props['onEdit']
): JSX.Element | null {
  if (!onEdit) return null;

  const handler = () => onEdit(widgetDef.widgetDefId);

  return <Button onClick={handler}>Edit</Button>;
}

function renderDeleteButton(
  widgetDef: Props['widgetDef'],
  onDelete?: Props['onDelete']
): JSX.Element | null {
  if (!onDelete) return null;

  const handler = () => onDelete(widgetDef.widgetDefId);

  return <Button onClick={handler}>Delete</Button>;
}
