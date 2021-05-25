import { useEffect } from 'react';
import { NoteData } from '@model/note';
import { WidgetKeyType } from '@model/widget-def/interface';
import { Props } from '.';

interface State<T extends WidgetKeyType = WidgetKeyType> {
  data?: Props<T>['initialData'];
}

type WidgetWindow = Window & {
  _onDataLoad?: (callback: Function) => void;
  _onDataUpdate?: (callback: Function) => void;
};

export function useWidget<T extends WidgetKeyType = WidgetKeyType>(
  props: Props<T>
) {
  useEffect(() => {
    if (!props.widgetId) return;

    let style: HTMLStyleElement | undefined;
    let script: HTMLScriptElement | undefined;
    const win = window as WidgetWindow;
    const dataLoadListeners: Function[] = [];
    const dataUpdateListeners: Function[] = [];

    const wsUrl = `ws://${location.hostname}:${WEB_SOCKET_PORT}/ws`;
    const ws = new WebSocket(wsUrl);
    const images = (props.images || []).reduce((res, img) => {
      res[img.name] = img.path;
      return res;
    }, {} as Record<string, string>);

    // events are not triggered in a standard way (triggerEvent) so we can
    // control that there is no listener left unmounted
    win._onDataLoad = (callback) => {
      dataLoadListeners.push(callback);
    };
    win._onDataUpdate = (callback) => {
      dataUpdateListeners.push(callback);
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ widgetId: props.widgetId }));
    };

    ws.onmessage = (msg) => {
      try {
        const note = JSON.parse(msg.data) as NoteData;
        triggerEvent(dataUpdateListeners, 'widgetdataupdate', {
          images,
          note,
          fields: props.initialData?.fields,
        });
      } catch (e) {}
    };

    if (props.css) {
      style = document.createElement('style');
      style.innerHTML = (props.images || []).reduce((css, img) => {
        // String.replaceAll is not available in the Chrome version used by OBS
        const imageName = `#${img.name}#`;
        let res = css;
        while (res.indexOf(imageName) !== -1) {
          res = res.replace(imageName, img.path);
        }
        return res;
      }, props.css);
      style.dataset.meta = 'widget';
      document.head.appendChild(style);
    }

    if (props.js) {
      script = document.createElement('script');
      // wrapping the script is necessary so constants don't get declared in
      // the global namespace because it would trigger an error if the page
      // gets reloaded
      script.innerHTML = `
((onDataLoad, onDataUpdate) => {
${props.js}
})(window._onDataLoad, window._onDataUpdate);`;
      script.dataset.meta = 'widget';
      document.body.appendChild(script);
    }

    triggerEvent(dataLoadListeners, 'widgetdataload', {
      images,
      fields: props.initialData?.fields,
      note: props.initialData?.note,
    });

    return () => {
      ws.close();
      style && style.parentElement?.removeChild(style);
      script && script.parentElement?.removeChild(script);
      delete win._onDataLoad;
      delete win._onDataUpdate;
      while (dataLoadListeners.length) {
        dataLoadListeners.pop();
      }
      while (dataUpdateListeners.length) {
        dataUpdateListeners.pop();
      }
    };
  }, [props.type, props.widgetId]);

  return {
    type: props.type,
    html: props.html || '',
  };
}

function triggerEvent<T extends {}>(
  callbacks: Function[],
  type: string,
  data: T
): void {
  callbacks.forEach((callback) => callback(type, data));
}
