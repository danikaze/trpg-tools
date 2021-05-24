import { useState } from 'react';
import { CreateWidgetDefData, SelectWidgetDefData } from '@model/widget-def';
import { Props } from '.';
import { callUpdateWidgetDefApi } from '@api/widget-def/client';

interface State {
  widgetDef: SelectWidgetDefData;
}

export function useEditWidgetDef(props: Props) {
  const [state, setState] = useState<State>({
    widgetDef: props.widgetDef!,
  });

  async function updateWidgetDef(widgetDef: CreateWidgetDefData) {
    if (!state.widgetDef) return;

    try {
      const res = await callUpdateWidgetDefApi(
        state.widgetDef.widgetDefId,
        widgetDef,
        state.widgetDef.updatedOn
      );

      setState((state) => ({
        ...state,
        widgetDef: {
          ...state.widgetDef,
          widgetDef,
          updatedOn: res.updatedOn,
        },
      }));
    } catch (e) {}
  }

  return {
    updateWidgetDef,
    widgetDef: state.widgetDef,
  };
}
