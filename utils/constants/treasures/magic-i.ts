import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller, TableRollerDef } from '@utils/table-roller';

// DMG page 149
const magicArmor = new WeightedOptions([
  { weight: 2, data: 'Magic armor, +2 half plate' },
  { weight: 2, data: 'Magic armor, +2 plate' },
  { weight: 2, data: 'Magic armor, +3 studder leather' },
  { weight: 2, data: 'Magic armor, +3 breastplate' },
  { weight: 2, data: 'Magic armor, +3 splint' },
  { weight: 1, data: 'Magic armor, +3 half plate' },
  { weight: 1, data: 'Magic armor, +3 plate' },
]);

export const magicItemTableI = new TableRoller<TableRollerDef<string>>({
  options: new WeightedOptions<TableRollerDef<string>>([
    { weight: 5, data: 'Defender' },
    { weight: 5, data: 'Hammer of thunderbolts' },
    { weight: 5, data: 'Luck blade' },
    { weight: 5, data: 'Sword of answering' },
    { weight: 3, data: 'Holy avenger' },
    { weight: 3, data: 'Ring of djinni summoning' },
    { weight: 3, data: 'Ring of invisibility' },
    { weight: 3, data: 'Ring of spell turning' },
    { weight: 3, data: 'Ring of lordly might' },
    { weight: 3, data: 'Staff of the magi' },
    { weight: 3, data: 'Vorpal sword' },
    { weight: 2, data: 'Belt of cloud giant strength' },
    { weight: 2, data: 'Armor, +2 breastplate' },
    { weight: 2, data: 'Armor, +2 chain mail' },
    { weight: 2, data: 'Armor, +3 chain shirt' },
    { weight: 2, data: 'Cloak of invisibility' },
    { weight: 2, data: 'Crystal ball (legendary version)' },
    { weight: 2, data: 'Armor, +1 half plate' },
    { weight: 2, data: 'Iron flask' },
    { weight: 2, data: 'Armor, +3 leather' },
    { weight: 2, data: 'Armor, +1 plate' },
    { weight: 2, data: 'Robe of the archmagi' },
    { weight: 2, data: 'Rod of resurrection' },
    { weight: 2, data: 'Armor, +1 scale mail' },
    { weight: 2, data: 'Scarab of protection' },
    { weight: 2, data: 'Armor, +2 splint' },
    { weight: 2, data: 'Armor, +2 studded leather' },
    { weight: 2, data: 'Well of many worlds' },
    { weight: 1, data: { quantity: 1, options: magicArmor } },
    { weight: 1, data: 'Apparatus of Kwalish' },
    { weight: 1, data: 'Armor of invulnerability' },
    { weight: 1, data: 'Belt of storm giant strength' },
    { weight: 1, data: 'Cubc gate' },
    { weight: 1, data: 'Deck of many things' },
    { weight: 1, data: 'Efreeti chain' },
    { weight: 1, data: 'Armor of resistance (half plate)' },
    { weight: 1, data: 'Horn of Valhalla (iron)' },
    { weight: 1, data: 'Instrument of the bards (Ollamh harp)' },
    { weight: 1, data: 'Ioun stone (greater absorption)' },
    { weight: 1, data: 'Ioun stone (mastery)' },
    { weight: 1, data: 'Ioun stone (regeneration)' },
    { weight: 1, data: 'Plate armor of etherealness' },
    { weight: 1, data: 'Plate armor of resistance' },
    { weight: 1, data: 'Ring of air elemental command' },
    { weight: 1, data: 'Ring of earth elemental command' },
    { weight: 1, data: 'Ring of fire elemental command' },
    { weight: 1, data: 'Ring of three wishes' },
    { weight: 1, data: 'Ring of water elemental command' },
    { weight: 1, data: 'Sphere of annihilation' },
    { weight: 1, data: 'Talisman of pure good' },
    { weight: 1, data: 'Talisman of the sphere' },
    { weight: 1, data: 'Talisman of ultimate evil' },
    { weight: 1, data: 'Tome of the stilled tongue' },
  ]),
});
