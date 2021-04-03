import {
  CharacterSheet,
  Props as CharacterSheetProps,
} from './character-sheet';

export interface WidgetProps {
  charSheet: CharacterSheetProps;
  charStatus: CharacterSheetProps;
}

export type WidgetType = keyof WidgetProps;

export function createWidget<T extends WidgetType>(
  type: T,
  data: WidgetProps[T]
) {
  return <CharacterSheet {...data} />;
}
