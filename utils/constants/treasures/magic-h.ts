import { WeightedOptions } from '@utils/rng/weighted-options';
import { TableRoller } from '@utils/table-roller';

// DMG page 148
export const magicItemTableH = new TableRoller<string>({
  options: new WeightedOptions([
    { weight: 10, data: 'Weapon, +3' },
    { weight: 2, data: 'Amulet of the planes' },
    { weight: 2, data: 'Carpet of flying' },
    { weight: 2, data: 'Crystal ball (very rare version)' },
    { weight: 2, data: 'Ring of regeneration' },
    { weight: 2, data: 'Ring of shooting stars' },
    { weight: 2, data: 'Ring of telekinesis' },
    { weight: 2, data: 'Robe of scintillating colors' },
    { weight: 2, data: 'Robe of stars' },
    { weight: 2, data: 'Rod of absorption' },
    { weight: 2, data: 'Rod of alertness' },
    { weight: 2, data: 'Rod of security' },
    { weight: 2, data: 'Rod of the pact keeper, +3' },
    { weight: 2, data: 'Scimitar of speed' },
    { weight: 2, data: 'Shield, +3' },
    { weight: 2, data: 'Staff of fire' },
    { weight: 2, data: 'Staff of frost' },
    { weight: 2, data: 'Staff of power' },
    { weight: 2, data: 'Staff of striking' },
    { weight: 2, data: 'Staff of thunder and lightning' },
    { weight: 2, data: 'Sword of sharpness' },
    { weight: 2, data: 'Wand of polymorph' },
    { weight: 2, data: 'Wand of the war mage, +3' },
    { weight: 1, data: 'Adamantine armor (half plate)' },
    { weight: 1, data: 'Adamantine armor (plate)' },
    { weight: 1, data: 'Animated shield' },
    { weight: 1, data: 'Belt of fire giant strength' },
    { weight: 1, data: 'Belt of frost (or stone) giant strength' },
    { weight: 1, data: 'Armor, +1 breastplate' },
    { weight: 1, data: 'Armor of resistance (breastplate)' },
    { weight: 1, data: 'Candle of invocation' },
    { weight: 1, data: 'Armor, +2 chain mail' },
    { weight: 1, data: 'Armor, +2 chain shirt' },
    { weight: 1, data: 'Cloak of arachnida' },
    { weight: 1, data: 'Dancing sword' },
    { weight: 1, data: 'Demon armor' },
    { weight: 1, data: 'Dragon scale mail' },
    { weight: 1, data: 'Dwarven plate' },
    { weight: 1, data: 'Dwarven thrower' },
    { weight: 1, data: 'Efreeti bottle' },
    { weight: 1, data: 'Figurine of wondrous power (obsidian steed)' },
    { weight: 1, data: 'Frost brand' },
    { weight: 1, data: 'Helm of brilliance' },
    { weight: 1, data: 'Horn of Valhalla (bronze)' },
    { weight: 1, data: 'Instrument of the bards (Anstruth harp)' },
    { weight: 1, data: 'Ioun stone (absorption)' },
    { weight: 1, data: 'Ioun stone (agility)' },
    { weight: 1, data: 'Ioun stone (fortitude)' },
    { weight: 1, data: 'Ioun stone (insight)' },
    { weight: 1, data: 'Ioun stone (intellect)' },
    { weight: 1, data: 'Ioun stone (leadership)' },
    { weight: 1, data: 'Ioun stone (strength)' },
    { weight: 1, data: 'Armor, +2 leather' },
    { weight: 1, data: 'Manual of bodily health' },
    { weight: 1, data: 'Manual of gainful exercise' },
    { weight: 1, data: 'Manual of golems' },
    { weight: 1, data: 'Manual of quickness of action' },
    { weight: 1, data: 'Mirror of life trapping' },
    { weight: 1, data: 'Nine lives stealer' },
    { weight: 1, data: 'Oathbow' },
    { weight: 1, data: 'Armor, +2 scale mail' },
    { weight: 1, data: 'Spellguard shield' },
    { weight: 1, data: 'Armor, +1 splint' },
    { weight: 1, data: 'Armor of resistance (splint)' },
    { weight: 1, data: 'Armor, +1 studded leather' },
    { weight: 1, data: 'Armor of resistance (studded leather)' },
    { weight: 1, data: 'Tome of clear thought' },
    { weight: 1, data: 'Tome of leadership and influence' },
    { weight: 1, data: 'Tome of understanding' },
  ]),
});
