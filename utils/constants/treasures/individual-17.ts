import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// Individual Treasure: Challenge 17+ (DMG page 136)
export const individual17 = new TableRoller<string>({
  options: new WeightedOptions([
    {
      weight: 15,
      data: [
        { quantity: '2d6 * 1000', data: 'ep' },
        { quantity: '8d6 * 100', data: 'gp' },
      ],
    },
    {
      weight: 40,
      data: [
        { quantity: '1d6 * 1000', data: 'gp' },
        { quantity: '1d6 * 100', data: 'pp' },
      ],
    },
    {
      weight: 45,
      data: [
        { quantity: '1d6 * 100', data: 'gp' },
        { quantity: '2d6 * 100', data: 'pp' },
      ],
    },
  ]),
});
