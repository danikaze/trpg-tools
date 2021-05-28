import { useState } from 'react';
import { Props } from '.';
import { WidgetKeyType } from '@model/widget-def/interface';
import {
  WIDGET_DEF_CSS_MAX_LENGTH,
  WIDGET_DEF_HTML_MAX_LENGTH,
  WIDGET_DEF_JS_MAX_LENGTH,
  WIDGET_NAME_MAX_LENGTH,
} from '@utils/constants';

export type TabType = 'html' | 'css' | 'js';

interface State {
  name: string;
  type: WidgetKeyType;
  selectedTab: TabType;
  code: Record<TabType, string>;
}

export function useWidgetDefEditor(props: Props) {
  const codeMaxLength = {
    html: WIDGET_DEF_HTML_MAX_LENGTH,
    css: WIDGET_DEF_CSS_MAX_LENGTH,
    js: WIDGET_DEF_JS_MAX_LENGTH,
  };
  const [state, setState] = useState<State>({
    type: 'charNote',
    name: props.data?.name || '',
    selectedTab: 'html',
    code: {
      html: props.data?.html || '',
      css: props.data?.css || '',
      js: props.data?.js || '',
    },
  });

  async function save() {
    props.onSave({
      type: state.type,
      name: state.name,
      html: state.code.html,
      css: state.code.css,
      js: state.code.js,
      images: [],
    });
  }

  function selectTab(tab: TabType) {
    setState({
      ...state,
      selectedTab: tab,
    });
  }

  function updateName(name: string) {
    setState({
      ...state,
      name,
    });
  }

  function updateType(type: WidgetKeyType) {
    setState((state) => ({
      ...state,
      type,
    }));
  }

  function updateCode(code: string) {
    setState({
      ...state,
      code: {
        ...state.code,
        [state.selectedTab]: code,
      },
    });
  }

  return {
    save,
    selectTab,
    updateName,
    updateType,
    updateCode,
    name: state.name,
    saveButtonDisabled: props.readonly || !state.name || !state.type,
    selectedTab: state.selectedTab,
    selectedType: state.type,
    selectedCode: state.code[state.selectedTab],
    nameMaxLength: WIDGET_NAME_MAX_LENGTH,
    codeMaxLength: codeMaxLength[state.selectedTab],
  };
}
