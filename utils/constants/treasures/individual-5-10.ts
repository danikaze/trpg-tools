import { TableRoller } from '@utils/table-roller';

// Individual Treasure: Challenge 5-10 (DMG page 136)
export const individual5 = new TableRoller<string>({
  table: [
    {
      weight: 30,
      data: [
        { quantity: '4d6 * 100', data: 'cp' },
        { quantity: '1d6 * 10', data: 'ep' },
      ],
    },
    {
      weight: 30,
      data: [
        { quantity: '6d6 * 10', data: 'sp' },
        { quantity: '2d6 * 10', data: 'gp' },
      ],
    },
    {
      weight: 10,
      data: [
        { quantity: '3d6 * 10', data: 'ep' },
        { quantity: '2d6 * 10', data: 'gp' },
      ],
    },
    { weight: 25, data: [{ quantity: '4d6 * 10', data: 'gp' }] },
    {
      weight: 5,
      data: [
        { quantity: '2d6 * 10', data: 'gp' },
        { quantity: '3d6', data: 'pp' },
      ],
    },
  ],
});
