import { useEffect, useState } from 'react';
import { callGetNoteOpenApi } from '@api/v1/note/client';
import { NoteData } from '@model/note';
import { WIDGET_UPDATE_INTERVAL } from '@utils/constants';
import { Props } from '.';

interface State {
  note?: NoteData;
}

export function useWidget(props: Props) {
  useEffect(() => {
    if (!props.widgetId) return;

    const handler = setInterval(async () => {
      const res = await callGetNoteOpenApi(props.widgetId!);
      setState((state) => ({
        ...state,
        note: res.note,
      }));
    }, WIDGET_UPDATE_INTERVAL);

    return () => {
      clearInterval(handler);
    };
  }, []);

  const [state, setState] = useState<State>({ note: props.initialData });

  return {
    note: state.note,
    fields: props.fields,
  };
}
