import { TableRoller } from '@utils/table-roller';
import { art250gp } from './art250';
import { art750gp } from './art750';
import { gems1000gp } from './gems1000';
import { gems500gp } from './gems500';
import { magicItemTableA } from './magic-a';
import { magicItemTableB } from './magic-b';
import { magicItemTableC } from './magic-c';
import { magicItemTableD } from './magic-d';
import { magicItemTableE } from './magic-e';
import { magicItemTableF } from './magic-f';
import { magicItemTableG } from './magic-g';
import { magicItemTableH } from './magic-h';
import { magicItemTableI } from './magic-i';

// Treasure Hoard: Challenge 11-16 (DMG page 138)
const coins = [
  { quantity: '4d6 * 1000', data: 'gp' },
  { quantity: '5d6 * 100', data: 'pp' },
];

export const hoard11 = new TableRoller<string>({
  table: [
    { weight: 3, data: coins },
    { weight: 3, data: [...coins, { quantity: '2d4', pick: art250gp }] },
    { weight: 3, data: [...coins, { quantity: '2d4', pick: art750gp }] },
    { weight: 3, data: [...coins, { quantity: '3d6', pick: gems500gp }] },
    { weight: 3, data: [...coins, { quantity: '3d6', pick: gems1000gp }] },
    {
      weight: 4, // 16-19
      data: [
        ...coins,
        { quantity: '2d6', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableA },
        { quantity: '1d6', roll: magicItemTableB },
      ],
    },
    {
      weight: 4, // 20-23
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: '1d4', roll: magicItemTableA },
        { quantity: '1d6', roll: magicItemTableB },
      ],
    },
    {
      weight: 3, // 24-26
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: '1d4', roll: magicItemTableA },
        { quantity: '1d6', roll: magicItemTableB },
      ],
    },
    {
      weight: 3, // 27-29
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableA },
        { quantity: '1d6', roll: magicItemTableB },
      ],
    },
    {
      weight: 6, // 30-35
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d6', roll: magicItemTableC },
      ],
    },
    {
      weight: 5, // 36-40
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: '1d6', roll: magicItemTableC },
      ],
    },
    {
      weight: 5, // 41-45
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: '1d6', roll: magicItemTableC },
      ],
    },
    {
      weight: 5, // 46-50
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d6', roll: magicItemTableC },
      ],
    },
    {
      weight: 4, // 51-54
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableD },
      ],
    },
    {
      weight: 4, // 55-58
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: '1d4', roll: magicItemTableD },
      ],
    },
    {
      weight: 4, // 59-62
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: '1d4', roll: magicItemTableD },
      ],
    },
    {
      weight: 4, // 63-66
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableD },
      ],
    },
    {
      weight: 2, // 67-68
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: 1, roll: magicItemTableE },
      ],
    },
    {
      weight: 2, // 69-70
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: 1, roll: magicItemTableE },
      ],
    },
    {
      weight: 2, // 71-72
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: 1, roll: magicItemTableE },
      ],
    },
    {
      weight: 2, // 73-74
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: 1, roll: magicItemTableE },
      ],
    },
    {
      weight: 2, // 75-76
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: 1, roll: magicItemTableF },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 2, // 77-78
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: 1, roll: magicItemTableF },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 2, // 79-80
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: 1, roll: magicItemTableF },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 2, // 81-82
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: 1, roll: magicItemTableF },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 3, // 83-85
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 3, // 86-88
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 89-90
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 91-92
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: '1d4', roll: magicItemTableH },
      ],
    },
    {
      weight: 2, // 93-94
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: 1, roll: magicItemTableI },
      ],
    },
    {
      weight: 2, // 95-96
      data: [
        ...coins,
        { quantity: '2d4', pick: art750gp },
        { quantity: 1, roll: magicItemTableI },
      ],
    },
    {
      weight: 2, // 97-98
      data: [
        ...coins,
        { quantity: '3d6', pick: gems500gp },
        { quantity: 1, roll: magicItemTableI },
      ],
    },
    {
      weight: 2, // 99-00
      data: [
        ...coins,
        { quantity: '3d6', pick: gems1000gp },
        { quantity: 1, roll: magicItemTableI },
      ],
    },
  ],
});
