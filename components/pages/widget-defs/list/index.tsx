import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { SelectAllWidgetDefData } from '@model/widget-def';
import { LinkToMyWidgetDefs } from '@components/links/link-to-my-widget-defs';
import { WidgetDefInfo } from '@components/widget-def-info';
import { useWidgetDefs } from './hooks';
import { useUserData } from '@utils/auth';

export interface Props {
  widgetDefs: SelectAllWidgetDefData[];
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  creator: {},
  hidden: {
    display: 'none',
  },
  widgetDefList: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const WidgetDefs: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const user = useUserData();
  const { widgetDefs, editWidget, deleteWidgetDef } = useWidgetDefs(props);

  if (!widgetDefs) {
    return renderNoWidgetDefs();
  }

  const listElem = widgetDefs.map((def) => (
    <WidgetDefInfo
      key={def.widgetDefId}
      widgetDef={def}
      onEdit={editWidget}
      onDelete={(def.userId === user?.userId && deleteWidgetDef) || undefined}
    />
  ));

  return (
    <div className={styles.root}>
      <LinkToMyWidgetDefs createNew />
      <div className={styles.widgetDefList}>{listElem}</div>
    </div>
  );
};

function renderNoWidgetDefs(): JSX.Element {
  return <div>There are no widgets definitions.</div>;
}
