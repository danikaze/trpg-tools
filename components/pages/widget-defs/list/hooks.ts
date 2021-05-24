import { useState } from 'react';
import { useRouter } from 'next/router';
import { DbWidgetDef } from '@model/widget-def/sql';
import { Props } from '.';
import { callDeleteWidgetDefApi } from '@api/widget-def/client';

interface State {
  widgetDefs: Props['widgetDefs'];
}

export function useWidgetDefs(props: Props) {
  const router = useRouter();
  const [state, setState] = useState<State>({
    widgetDefs: props.widgetDefs,
  });

  async function deleteWidgetDef(
    widgetDefId: DbWidgetDef['widgetDefId']
  ): Promise<void> {
    const def = state.widgetDefs.find((def) => def.widgetDefId === widgetDefId);
    if (!def) return;
    const doIt = confirm(`Delete widget definition "${def.name}"?`);
    if (!doIt) return;

    try {
      await callDeleteWidgetDefApi(widgetDefId);
    } catch (e) {
      return;
    }
    const widgetDefs = [...state.widgetDefs];
    const i = widgetDefs.findIndex((def) => def.widgetDefId === widgetDefId);
    if (i === -1) return;
    widgetDefs.splice(i, 1);
    setState((state) => ({
      ...state,
      widgetDefs,
    }));
  }

  function editWidget(widgetDefId: DbWidgetDef['widgetDefId']) {
    router.push(`/widget-defs/${widgetDefId}`);
  }

  return {
    editWidget,
    deleteWidgetDef,
    widgetDefs: state.widgetDefs,
  };
}
