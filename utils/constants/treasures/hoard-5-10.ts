import { art25gp } from './art25';
import { art250gp } from './art250';
import { gems50gp } from './gems50';
import { gems100gp } from './gems100';
import { magicItemTableA } from './magic-a';
import { magicItemTableB } from './magic-b';
import { magicItemTableC } from './magic-c';
import { magicItemTableD } from './magic-d';
import { magicItemTableF } from './magic-f';
import { magicItemTableG } from './magic-g';
import { magicItemTableH } from './magic-h';
import { TableRoller } from '@utils/table-roller';

// Treasure Hoard: Challenge 5-10 (DMG page 137)
const coins = [
  { quantity: '2d6 * 100', data: 'cp' },
  { quantity: '2d6 * 1000', data: 'sp' },
  { quantity: '6d6 * 100', data: 'gp' },
  { quantity: '3d6 * 10', data: 'pp' },
];

export const hoard5 = new TableRoller<string>({
  table: [
    { weight: 4, data: coins },
    { weight: 6, data: [...coins, { quantity: '2d4', pick: art25gp }] },
    { weight: 6, data: [...coins, { quantity: '3d6', pick: gems50gp }] },
    { weight: 6, data: [...coins, { quantity: '3d6', pick: gems100gp }] },
    { weight: 6, data: [...coins, { quantity: '2d4', pick: art25gp }] },
    {
      weight: 4, // 29-32
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 4, // 33-36
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 4, // 37-40
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 4, // 41-44
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d6', roll: magicItemTableA },
      ],
    },
    {
      weight: 5, // 45-49
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 5, // 50-54
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 5, // 55-59
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 4, // 60-63
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableB },
      ],
    },
    {
      weight: 3, // 64-66
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 3, // 67-69
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 3, // 70-72
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 2, // 73-74
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableC },
      ],
    },
    {
      weight: 2, // 75-76
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: 1, roll: magicItemTableD },
      ],
    },
    {
      weight: 2, // 77-78
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: 1, roll: magicItemTableD },
      ],
    },
    {
      weight: 1, // 79
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: 1, roll: magicItemTableD },
      ],
    },
    {
      weight: 1, // 80
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: 1, roll: magicItemTableD },
      ],
    },
    {
      weight: 4, // 81-84
      data: [
        ...coins,
        { quantity: '2d4', pick: art25gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 4, // 85-88
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 3, // 89-91
      data: [
        ...coins,
        { quantity: '3d6', pick: gems50gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 3, // 92-94
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableF },
      ],
    },
    {
      weight: 2, // 95-96
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 2, // 97-98
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: '1d4', roll: magicItemTableG },
      ],
    },
    {
      weight: 1, // 99
      data: [
        ...coins,
        { quantity: '3d6', pick: gems100gp },
        { quantity: 1, roll: magicItemTableH },
      ],
    },
    {
      weight: 1, // 00
      data: [
        ...coins,
        { quantity: '2d4', pick: art250gp },
        { quantity: 1, roll: magicItemTableH },
      ],
    },
  ],
});
