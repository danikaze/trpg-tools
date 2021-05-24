import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { SelectWidgetDefData } from '@model/widget-def';
import { WidgetDefEditor } from '@components/widget-def-editor';
import { useEditWidgetDef } from './hooks';
import { useUserData } from '@utils/auth';

export interface Props {
  widgetDef?: SelectWidgetDefData;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const EditWidgetDef: FunctionComponent<Props> = (props) => {
  const user = useUserData();
  const styles = useStyles();
  const { widgetDef, updateWidgetDef } = useEditWidgetDef(props);

  if (!widgetDef) {
    return renderNoWidgetDefs();
  }

  const isReadOnly = widgetDef.userId !== user?.userId;

  return (
    <div className={styles.root}>
      <WidgetDefEditor
        mode="edit"
        data={widgetDef}
        onSave={updateWidgetDef}
        readonly={isReadOnly}
      />
      {isReadOnly && '[READONLY]'}
    </div>
  );
};

function renderNoWidgetDefs(): JSX.Element {
  return <div>There are no widgets definition with that ID.</div>;
}
