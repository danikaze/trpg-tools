import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// DMG page 144
export const magicItemTableA = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 50, data: 'Potion of healing' },
    { weight: 10, data: 'Spell scroll (cantrip)' },
    { weight: 10, data: 'Potion of climbing' },
    { weight: 20, data: 'Spell scroll (1st level)' },
    { weight: 4, data: 'Spell scroll (2nd level)' },
    { weight: 4, data: 'Potion of greater healing' },
    { weight: 1, data: 'Bag of holding' },
    { weight: 1, data: 'Driftglobe' },
  ]),
});
