import { useEffect, useState } from 'react';
import {
  TreasureGeneratorType,
  TreasureCr,
  QuantifiedCr,
  Treasure,
} from '@utils/constants/treasures';
import { Props } from '.';

interface State {
  type: TreasureGeneratorType;
  individualCrs: QuantifiedCr[];
  hoardCr: TreasureCr;
  grouping: GroupingType;
  treasure: readonly Treasure[][];
}

export type GroupingType = 'none' | 'each' | 'all';

export const CR_LIST = ['0-4', '5-10', '11-16', '17+'] as TreasureCr[];
export const TYPE_LIST = ['individual', 'hoard'] as TreasureGeneratorType[];

export function useTreasureForm(props: Props) {
  useEffect(() => {
    setState((state) => ({
      ...state,
      treasure: groupTreasures(state.grouping, props.treasure),
    }));
  }, [props.treasure]);

  const [state, setState] = useState<State>({
    type: 'individual',
    individualCrs: [{ cr: CR_LIST[0], quantity: 1 }],
    hoardCr: CR_LIST[0],
    grouping: 'all',
    treasure: groupTreasures('all', props.treasure),
  });

  function updateType(type: TreasureGeneratorType): void {
    setState((state) => ({
      ...state,
      type,
      treasure: [],
    }));
  }

  function addItem() {
    const crs = state.individualCrs;
    const cr = crs.length > 0 ? crs[crs.length - 1].cr : CR_LIST[0];

    setState((state) => ({
      ...state,
      individualCrs: [...crs, { cr, quantity: 1 }],
      treasure: [],
    }));
  }

  function updateCr(index: number, cr: TreasureCr) {
    if (state.type === 'hoard') {
      setState((state) => ({
        ...state,
        hoardCr: cr,
      }));
      return;
    }

    const crs = [...state.individualCrs];
    crs[index] = { cr, quantity: crs[index].quantity };

    setState((state) => ({
      ...state,
      individualCrs: crs,
      treasure: [],
    }));
  }

  function updateQuantity(index: number, quantity: number) {
    const crs = [...state.individualCrs];
    crs[index] = { quantity, cr: crs[index].cr };

    setState((state) => ({
      ...state,
      individualCrs: crs,
      treasure: [],
    }));
  }

  function removeItem(index: number) {
    setState((state) => {
      const crs = [...state.individualCrs];
      crs.splice(index, 1);

      return {
        ...state,
        individualCrs: crs,
        treasure: [],
      };
    });
  }

  async function generate() {
    const crs =
      state.type === 'individual'
        ? state.individualCrs
        : [{ quantity: 1, cr: state.hoardCr }];
    const ok = await props.onSubmit(state.type, crs);
    if (!ok) {
      setState((state) => ({
        ...state,
        individualCrs: [{ cr: CR_LIST[0], quantity: 1 }],
        hoardCr: CR_LIST[0],
        treasure: [],
      }));
    }
    return ok;
  }

  function setGroupingType(grouping: GroupingType) {
    setState((state) => ({
      ...state,
      grouping,
      treasure: groupTreasures(grouping, props.treasure),
    }));
  }

  return {
    setGroupingType,
    updateType,
    updateCr,
    updateQuantity,
    removeItem,
    generate,
    addItem: state.type === 'individual' ? addItem : undefined,
    type: state.type,
    crs: state.type === 'individual' ? state.individualCrs : state.hoardCr,
    treasure: state.treasure,
    grouping: state.grouping,
  };
}

function groupTreasures(
  grouping: GroupingType,
  treasure: readonly Treasure[][]
): readonly Treasure[][] {
  if (grouping === 'none' || treasure.length === 0) return treasure;

  const eachGroup = treasure.map((treasures) =>
    treasures.reduce(addTreasure, [] as Treasure[])
  );

  if (grouping === 'each') return eachGroup;

  return [
    eachGroup.reduce((total, treasures) => {
      treasures.forEach((item) => addTreasure(total, item));
      return total;
    }, [] as Treasure[]),
  ];
}

function addTreasure(treasures: Treasure[], treasure: Treasure): Treasure[] {
  const index = treasures.findIndex((i) => i.data === treasure.data);
  if (index !== -1) {
    const item = treasures[index];
    treasures[index] = {
      data: item.data,
      quantity: item.quantity += treasure.quantity,
    };
  } else {
    treasures.push({ ...treasure });
  }
  return treasures;
}
