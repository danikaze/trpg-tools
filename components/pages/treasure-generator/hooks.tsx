import { callGenerateTreasures } from '@api/treasures/client';
import {
  QuantifiedCr,
  Treasure,
  TreasureGeneratorType,
} from '@utils/constants/treasures';
import { useState } from 'react';
import { Props } from '.';

interface State {
  treasure: readonly Treasure[][];
}

export function useTreasureGenerator({}: Props) {
  const [state, setState] = useState<State>({
    treasure: [],
  });

  const generate = async (
    type: TreasureGeneratorType,
    crs: QuantifiedCr[]
  ): Promise<boolean> => {
    setState((state) => ({
      ...state,
      treasure: [],
    }));
    const treasure = await callGenerateTreasures(type, crs);

    if (!treasure) {
      setState((state) => ({
        treasure: [],
      }));
      return false;
    }

    setState((state) => ({
      treasure,
    }));
    return true;
  };

  return {
    generate,
    treasure: state.treasure,
  };
}
