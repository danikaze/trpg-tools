import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// DMG page 145
export const magicItemTableE = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 30, data: 'Spell scroll (8th level)' },
    { weight: 25, data: 'Potion of storm giant strength' },
    { weight: 15, data: 'Potion of supreme healing' },
    { weight: 15, data: 'Spell scroll (9th level)' },
    { weight: 8, data: 'Universal solvent' },
    { weight: 5, data: 'Arrow of slaying' },
    { weight: 2, data: 'Sovereign glue' },
  ]),
});
