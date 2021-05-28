import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { WidgetDefEditor } from '@components/widget-def-editor';
import { useNewWidgetDefs } from './hooks';

export type Props = {};

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

export const NewWidgetDefs: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const { createWidgetDef } = useNewWidgetDefs(props);

  return (
    <div className={styles.root}>
      <WidgetDefEditor mode="create" onSave={createWidgetDef} />
    </div>
  );
};
