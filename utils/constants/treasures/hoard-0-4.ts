import { TableRoller } from '@utils/table-roller';
import { WeightedOptions } from '@utils/rng/weighted-options';
import { art25gp } from './art25';
import { gems10gp } from './gems10';
import { gems50gp } from './gems50';
import { magicItemTableA } from './magic-a';
import { magicItemTableB } from './magic-b';
import { magicItemTableC } from './magic-c';
import { magicItemTableF } from './magic-f';
import { magicItemTableG } from './magic-g';

// Treasure Hoard: Challenge 0-4 (DMG page 137)
const coins = [
  { quantity: '6d6 * 100', data: 'cp' },
  { quantity: '3d6 * 100', data: 'sp' },
  { quantity: '2d6 * 10', data: 'gp' },
];

export const hoard0 = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 6, data: coins },
    { weight: 10, data: [...coins, { quantity: '2d6', pick: gems10gp }] },
    { weight: 10, data: [...coins, { quantity: '2d4', pick: art25gp }] },
    { weight: 10, data: [...coins, { quantity: '2d6', pick: gems50gp }] },
    {
      weight: 8, // 37-44
      data: [
        ...coins,
        { quantity: '2d6', pick: gems10gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 8, // 45-52
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 8, // 53-60
      data: [
        ...coins,
        { quantity: '2d6', pick: gems50gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 5, // 61-65
      data: [
        ...coins,
        { quantity: '2d6', pick: gems10gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 5, // 66-70
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 5, // 71-75
      data: [
        ...coins,
        { quantity: '2d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 3, // 76-78
      data: [
        ...coins,
        { quantity: '2d6', pick: gems10gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 2, // 79-80
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 5, // 81-85
      data: [
        ...coins,
        { quantity: '2d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 7, // 86-92
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 5, // 93-97
      data: [
        ...coins,
        { quantity: '2d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 2, // 98-99
      data: [
        ...coins,
        { quantity: '2d6', pick: art25gp },
        { quantity: 1, roll: magicItemTableG },
      ],
    },
    {
      weight: 1, // 00
      data: [
        ...coins,
        { quantity: '2d6', pick: gems50gp },
        { quantity: 1, roll: magicItemTableG },
      ],
    },
  ]),
});
