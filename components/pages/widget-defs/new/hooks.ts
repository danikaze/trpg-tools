import { Props } from '.';
import { CreateWidgetDefData } from '@model/widget-def';
import { callCreateWidgetDef } from '@api/widget-def/client';
import { useRouter } from 'next/router';

export function useNewWidgetDefs(props: Props) {
  const router = useRouter();

  async function createWidgetDef(widgetDef: CreateWidgetDefData) {
    const res = await callCreateWidgetDef(widgetDef);
    if (res && res.widgetDefId) {
      router.push(`/widget-defs/${res.widgetDefId}`);
    }
  }

  return {
    createWidgetDef,
  };
}
