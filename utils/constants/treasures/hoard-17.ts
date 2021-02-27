import { TableRoller } from '@utils/table-roller';
import { art2500gp } from './art2500';
import { art7500gp } from './art7500';
import { gems1000gp } from './gems1000';
import { gems5000gp } from './gems5000';
import { magicItemTableC } from './magic-c';
import { magicItemTableD } from './magic-d';
import { magicItemTableE } from './magic-e';
import { magicItemTableG } from './magic-g';
import { magicItemTableH } from './magic-h';
import { magicItemTableI } from './magic-i';

// Treasure Hoard: Challenge 17+ (DMG page 139)
const coins = [
  { quantity: '12d6 * 1000', data: 'gp' },
  { quantity: '8d6 * 1000', data: 'pp' },
];

export const hoard17 = new TableRoller<string>({
  table: [
    { weight: 2, data: coins }, // 01-02
    {
      weight: 3, // 03-05
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d8', roll: magicItemTableC },
      ],
    },
    {
      weight: 3, // 06-08
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d8', roll: magicItemTableC },
      ],
    },
    {
      weight: 3, // 09-11
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d8', roll: magicItemTableC },
      ],
    },
    {
      weight: 3, // 12-14
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d8', roll: magicItemTableC },
      ],
    },
    {
      weight: 8, // 15-22,
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d6', roll: magicItemTableD },
      ],
    },
    {
      weight: 8, // 23-30,
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d6', roll: magicItemTableD },
      ],
    },
    {
      weight: 8, // 31-38,
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d6', roll: magicItemTableD },
      ],
    },
    {
      weight: 8, // 39-46,
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d6', roll: magicItemTableD },
      ],
    },
    {
      weight: 6, // 47-52
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d6', roll: magicItemTableE },
      ],
    },
    {
      weight: 6, // 53-58
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d6', roll: magicItemTableE },
      ],
    },
    {
      weight: 5, // 59-63
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d6', roll: magicItemTableE },
      ],
    },
    {
      weight: 5, // 64-68
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d6', roll: magicItemTableE },
      ],
    },
    {
      weight: 1, // 69
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 1, // 70
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 1, // 71
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 1, // 72
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 2, // 73-74
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 75-76
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 77-78
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 79-80
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 5, // 81-85
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableI },
      ],
    },
    {
      weight: 5, // 86-90
      data: [
        ...coins,
        { quantity: '1d10', pick: art2500gp },
        { quantity: '1d4', roll: magicItemTableI },
      ],
    },
    {
      weight: 5, // 91-95
      data: [
        ...coins,
        { quantity: '1d4', pick: art7500gp },
        { quantity: '1d4', roll: magicItemTableI },
      ],
    },
    {
      weight: 5, // 96-00
      data: [
        ...coins,
        { quantity: '1d8', pick: gems5000gp },
        { quantity: '1d4', roll: magicItemTableI },
      ],
    },
  ],
});
