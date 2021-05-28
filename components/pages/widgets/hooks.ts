import { useState } from 'react';
import {
  callDeleteWidgetKeyApi,
  callUpdateWidgetKeyApi,
} from '@api/widget-key/client';
import { DbWidgetKey } from '@model/widget-key/sql';
import { Props } from '.';

interface State {
  widgetApiKeys: Props['widgetApiKeys'];
  isCreatorOpen: boolean;
}

export function useWidgets(props: Props) {
  const [state, setState] = useState<State>({
    widgetApiKeys: props.widgetApiKeys,
    isCreatorOpen: false,
  });

  function findWidgetKey(widgetKeyId: DbWidgetKey['widgetKeyId']) {
    if (!state.widgetApiKeys) return;
    const index = state.widgetApiKeys.findIndex(
      (widget) => widget.widgetKeyId === widgetKeyId
    );
    const data = state.widgetApiKeys[index];

    return {
      index,
      data,
    };
  }

  async function renameWidgetKey(widgetKeyId: DbWidgetKey['widgetKeyId']) {
    const widgetKey = findWidgetKey(widgetKeyId);
    if (!widgetKey) return;

    const name = prompt('New name?', widgetKey.data.name);
    if (!name || name === widgetKey.data.name) return;

    const res = await callUpdateWidgetKeyApi(widgetKeyId, name);
    if (!res) return;

    setState((state) => {
      const widgetApiKeys = [...state.widgetApiKeys!];
      widgetApiKeys.splice(widgetKey.index, 1, {
        ...widgetKey.data,
        name,
      });

      return {
        ...state,
        widgetApiKeys,
      };
    });
  }

  async function deleteWidgetKey(
    widgetKeyId: DbWidgetKey['widgetKeyId']
  ): Promise<void> {
    const widgetKey = findWidgetKey(widgetKeyId);
    if (!widgetKey) return;

    const doIt = confirm(`Delete ${widgetKey.data.name}?`);
    if (!doIt) return;

    const res = await callDeleteWidgetKeyApi(widgetKeyId);
    if (!res) return;

    setState((state) => {
      const widgetApiKeys = [...state.widgetApiKeys!];
      widgetApiKeys.splice(widgetKey.index, 1);

      return {
        ...state,
        widgetApiKeys,
      };
    });
  }

  function toggleCreator() {
    setState((state) => ({
      ...state,
      isCreatorOpen: !state.isCreatorOpen,
    }));
  }

  function createWidgetKey(widgetKey: Unarray<State['widgetApiKeys']>) {
    if (!widgetKey) return;

    setState((state) => {
      const widgetApiKeys = state.widgetApiKeys
        ? [widgetKey, ...state.widgetApiKeys]
        : [widgetKey];
      return {
        ...state,
        widgetApiKeys,
      };
    });
  }

  return {
    renameWidgetKey,
    deleteWidgetKey,
    createWidgetKey,
    toggleCreator,
    isCreatorOpen: state.isCreatorOpen,
    widgetApiKeys: state.widgetApiKeys,
  };
}
