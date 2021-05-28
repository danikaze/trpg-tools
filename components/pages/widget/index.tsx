import { FunctionComponent } from 'react';
import { WidgetKeyType, WidgetProps } from '@model/widget-def/interface';
import { SelectWidgetDefData } from '@model/widget-def';
import { makeStyles } from '@utils/styles';
import { LinkToIndex } from '@components/links/link-to-index';
import { useWidget } from './hooks';

export interface Props<T extends WidgetKeyType = WidgetKeyType> {
  widgetId?: string;
  type?: T;
  initialData?: WidgetProps[T];
  html?: string;
  js?: string;
  css?: string;
  images?: SelectWidgetDefData['images'];
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
  const { type, html } = useWidget(props);

  if (!type) {
    return renderNotFound();
  }

  return renderWidgetContainer(styles, html);
};

function renderNotFound(): JSX.Element {
  return (
    <div>
      Widget not found. <LinkToIndex>Back to the Index page</LinkToIndex>.
    </div>
  );
}

function renderWidgetContainer(styles: Styles, html: string): JSX.Element {
  return (
    <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
