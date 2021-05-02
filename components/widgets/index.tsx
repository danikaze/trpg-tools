import { FunctionComponent } from 'react';
import {
  CharacterSheet,
  Props as CharacterSheetProps,
} from './character-sheet';
import {
  CharacterStatus,
  Props as CharacterStatusProps,
} from './character-status';
import {
  CharacterStatusBorders,
  Props as CharacterStatusBordersProps,
} from './character-status-borders';
import { CharacterHp, Props as CharacterHpProps } from './character-hp';

export interface WidgetProps {
  charSheet: CharacterSheetProps;
  charStatus: CharacterStatusProps;
  charStatusBorders: CharacterStatusBordersProps;
  charHp: CharacterHpProps;
}

export type WidgetType = keyof WidgetProps;

export function createWidget<T extends WidgetType>(
  type: T,
  data: WidgetProps[T]
) {
  const widgets: { [type in WidgetType]: FunctionComponent<WidgetProps[T]> } = {
    charSheet: CharacterSheet,
    charStatus: CharacterStatus,
    charStatusBorders: CharacterStatusBorders,
    charHp: CharacterHp,
  };
  const Component = widgets[type] as FunctionComponent<WidgetProps[T]>;

  return <Component {...data} />;
}
