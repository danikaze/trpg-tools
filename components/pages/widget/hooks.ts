import { useEffect } from 'react';
import { NoteData } from '@model/note';
import { WidgetKeyType } from '@model/widget-def/interface';
import { Props } from '.';

interface State<T extends WidgetKeyType = WidgetKeyType> {
  data?: Props<T>['initialData'];
}

export function useWidget<T extends WidgetKeyType = WidgetKeyType>(
  props: Props<T>
) {
  useEffect(() => {
    if (!props.widgetId) return;

    const wsUrl = `ws://${location.hostname}:${WEB_SOCKET_PORT}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ widgetId: props.widgetId }));
    };

    ws.onmessage = (msg) => {
      try {
        const note = JSON.parse(msg.data) as NoteData;
        setState((state) => ({
          ...state,
          data: {
            ...state.data!,
            note,
          },
        }));
      } catch (e) {}
    };

    return () => {
      ws.close();
    };
  }, [props.type, props.widgetId]);

  const [state, setState] = useState<State>({ data: props.initialData });

  return {
    type: props.type,
    data: state.data,
  };
}
