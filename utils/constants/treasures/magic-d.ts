import { TableRoller } from '@utils/table-roller';

// DMG page 145
export const magicItemTableD = new TableRoller<string>({
  table: [
    { weight: 20, data: 'Potion of supreme healing' },
    { weight: 10, data: 'Potion of invisibility' },
    { weight: 10, data: 'Potion of speed' },
    { weight: 10, data: 'Spell scroll (6th level)' },
    { weight: 7, data: 'Spell scroll (7th level)' },
    { weight: 5, data: 'Ammunition, +3' },
    { weight: 5, data: 'Oil of sharpness' },
    { weight: 5, data: 'Potion of flying' },
    { weight: 5, data: 'Potion of cloud giant strength' },
    { weight: 5, data: 'Potion of longevity' },
    { weight: 5, data: 'Potion of vitality' },
    { weight: 5, data: 'Spell scroll (8th level)' },
    { weight: 3, data: 'Horseshoes of a zephyr' },
    { weight: 3, data: `Nolzur's marvelous pigments` },
    { weight: 1, data: 'Bag of devouring' },
    { weight: 1, data: 'Portable hole' },
  ],
});
