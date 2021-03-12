import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// DMG page 145
export const magicItemTableC = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 15, data: 'Potion of superior healing' },
    { weight: 7, data: 'Spell scroll (4th level)' },
    { weight: 5, data: 'Ammunition, + 2' },
    { weight: 5, data: 'Potion of clairvoyance' },
    { weight: 5, data: 'Potion of diminution' },
    { weight: 5, data: 'Potion of gaseous form' },
    { weight: 5, data: 'Potion of frost giant strength' },
    { weight: 5, data: 'Potion of stone giant strength' },
    { weight: 5, data: 'Potion of heroism' },
    { weight: 5, data: 'Potion of invulnerability' },
    { weight: 5, data: 'Potion of mind reading' },
    { weight: 5, data: 'Spell scroll (5th level)' },
    { weight: 3, data: 'Elixir of health' },
    { weight: 3, data: 'Oil of etherealness' },
    { weight: 3, data: 'Potion of fire giant strength' },
    { weight: 3, data: `Quall's feather token` },
    { weight: 3, data: 'Scroll of protection' },
    { weight: 2, data: 'Bag of beans' },
    { weight: 2, data: 'Bead of force' },
    { weight: 1, data: 'Chime of opening' },
    { weight: 1, data: 'Decanter of endless water' },
    { weight: 1, data: 'Eyes of minute seeing' },
    { weight: 1, data: 'Folding boat' },
    { weight: 1, data: `Heward's handy haversack` },
    { weight: 1, data: 'Horseshoes of speed' },
    { weight: 1, data: 'Necklace of fireballs' },
    { weight: 1, data: 'Periapt of health' },
    { weight: 1, data: 'Sending stones' },
  ]),
});
