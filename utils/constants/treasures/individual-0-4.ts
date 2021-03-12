import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// Individual Treasure: Challenge 0-4 (DMG page 136)
export const individual0 = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 30, data: { quantity: '5d6', data: 'cp' } },
    { weight: 30, data: { quantity: '4d6', data: 'sp' } },
    { weight: 10, data: { quantity: '3d6', data: 'ep' } },
    { weight: 25, data: { quantity: '3d6', data: 'gp' } },
    { weight: 5, data: { quantity: '1d6', data: 'pp' } },
  ]),
});
