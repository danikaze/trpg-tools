import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// Individual Treasure: Challenge 11-16 (DMG page 136)
export const individual11 = new TableRoller<string>({
  options: new WeightedOptions([
    {
      weight: 20,
      data: [
        { quantity: '4d6 * 100', data: 'sp' },
        { quantity: '1d6 * 100', data: 'gp' },
      ],
    },
    {
      weight: 15,
      data: [
        { quantity: '1d6 * 100', data: 'ep' },
        { quantity: '1d6 * 100', data: 'gp' },
      ],
    },
    {
      weight: 40,
      data: [
        { quantity: '2d6 * 100', data: 'gp' },
        { quantity: '1d6 * 10', data: 'pp' },
      ],
    },
    {
      weight: 25,
      data: [
        { quantity: '2d6 * 100', data: 'gp' },
        { quantity: '2d6 * 10', data: 'pp' },
      ],
    },
  ]),
});
