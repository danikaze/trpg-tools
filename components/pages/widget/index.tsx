import { FunctionComponent } from 'react';
import { WidgetKeyType, WidgetProps } from '@model/widget-def/interface';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from '@components/links/link-to-index';
import { useWidget } from './hooks';
import { createWidget } from '@components/widgets';

export interface Props<T extends WidgetKeyType = WidgetKeyType> {
  widgetId?: string;
  type?: T;
  initialData?: WidgetProps[T];
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const Widget: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const { type, data } = useWidget(props);

  if (!type || !data) {
    return renderNotFound();
  }

  return <div className={styles.root}>{createWidget(type, data)}</div>;
};

function renderNotFound(): JSX.Element {
  return (
    <div>
      Widget not found. <LinkToIndex>Back to the Index page</LinkToIndex>.
    </div>
  );
}
