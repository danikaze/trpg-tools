import { TableRoller } from '@utils/table-roller';

// DMG page 147
const figurines = {
  table: [
    { weight: 1, data: 'Figurine of wondrous power (Bronze griffon)' },
    { weight: 1, data: 'Figurine of wondrous power (Ebony fly)' },
    { weight: 1, data: 'Figurine of wondrous power (Golden lions)' },
    { weight: 1, data: 'Figurine of wondrous power (Ivory goats)' },
    { weight: 1, data: 'Figurine of wondrous power (Marble elephant)' },
    { weight: 2, data: 'Figurine of wondrous power (Onyx dog)' },
    { weight: 1, data: 'Figurine of wondrous power (Serpentine owl)' },
  ],
};

export const magicItemTableG = new TableRoller<string>({
  table: [
    { weight: 11, data: 'Weapon, +2' },
    { weight: 3, data: figurines },
    { weight: 1, data: 'Adamantine armor (breastplate)' },
    { weight: 1, data: 'Adamantine armor (splint)' },
    { weight: 1, data: 'Amulet of health' },
    { weight: 1, data: 'Armor of vulnerability' },
    { weight: 1, data: 'Arrow-catching shield' },
    { weight: 1, data: 'Belt of dwarvenkind' },
    { weight: 1, data: 'Belt of hill giant strength' },
    { weight: 1, data: 'Berserker axe' },
    { weight: 1, data: 'Boots of levitation' },
    { weight: 1, data: 'Boots of speed' },
    { weight: 1, data: 'Bowl of commanding water elementals' },
    { weight: 1, data: 'Bracers of defense' },
    { weight: 1, data: 'Brazier of commanding fire elementals' },
    { weight: 1, data: 'Cape of the mountebank' },
    { weight: 1, data: 'Censer of controlling air elementals' },
    { weight: 1, data: 'Armor, +1 chain mail' },
    { weight: 1, data: 'Armor of resistance (chain mail)' },
    { weight: 1, data: 'Armor, +1 chain shirt' },
    { weight: 1, data: 'Armor of resistance (chain shirt)' },
    { weight: 1, data: 'Cloak of displacement' },
    { weight: 1, data: 'Cloak of the bat' },
    { weight: 1, data: 'Cube of force' },
    { weight: 1, data: `Daern's instant fortress` },
    { weight: 1, data: 'Dagger of venom' },
    { weight: 1, data: 'Dimensional shackles' },
    { weight: 1, data: 'Dragon slayer' },
    { weight: 1, data: 'Elven chain' },
    { weight: 1, data: 'Flame tongue' },
    { weight: 1, data: 'Gem of seeing' },
    { weight: 1, data: 'Giant slayer' },
    { weight: 1, data: 'Glamoured studded leather' },
    { weight: 1, data: 'Helm of teleportation' },
    { weight: 1, data: 'Horn of blasting' },
    { weight: 1, data: 'Horn of Valhalla (silver or brass)1' },
    { weight: 1, data: 'Instrument of the bards (Canaith mandolin)' },
    { weight: 1, data: 'Instrument of the bards (Cli lyre)' },
    { weight: 1, data: 'Ioun stone (awareness)' },
    { weight: 1, data: 'Ioun stone (protection)' },
    { weight: 1, data: 'Ioun stone (reserve)' },
    { weight: 1, data: 'Ioun stone (sustance)' },
    { weight: 1, data: 'Iron bands of Bilarro' },
    { weight: 1, data: 'Armor, +1 leather' },
    { weight: 1, data: 'Armor of resistance (leather)' },
    { weight: 1, data: 'Mace of disruption' },
    { weight: 1, data: 'Mace of smiting' },
    { weight: 1, data: 'Mace of terror' },
    { weight: 1, data: 'Mantle of spell resistance' },
    { weight: 1, data: 'Necklace of prayer beads' },
    { weight: 1, data: 'Periapt of proof against poison' },
    { weight: 1, data: 'Ring of animal influence' },
    { weight: 1, data: 'Ring of evasion' },
    { weight: 1, data: 'Ring of feather falling' },
    { weight: 1, data: 'Ring of free action' },
    { weight: 1, data: 'Ring of protection' },
    { weight: 1, data: 'Ring of resistance' },
    { weight: 1, data: 'Ring of spell storing' },
    { weight: 1, data: 'Ring of the ram' },
    { weight: 1, data: 'Ring of X-ray vision' },
    { weight: 1, data: 'Robe of eyes' },
    { weight: 1, data: 'Rod of rulership' },
    { weight: 1, data: 'Rod of the pact keeper, +2' },
    { weight: 1, data: 'Rope of entanglement' },
    { weight: 1, data: 'Armor, +1 scale mail' },
    { weight: 1, data: 'Armor of resistance (scale mail)' },
    { weight: 1, data: 'Shield, +2' },
    { weight: 1, data: 'Shield of missile attraction' },
    { weight: 1, data: 'Staff of charming' },
    { weight: 1, data: 'Staff of healing' },
    { weight: 1, data: 'Staff of swarming insects' },
    { weight: 1, data: 'Staff of the woodlands' },
    { weight: 1, data: 'Staff of withering' },
    { weight: 1, data: 'Stone of controlling earth elementals' },
    { weight: 1, data: 'Sun blade' },
    { weight: 1, data: 'Sword of life stealing' },
    { weight: 1, data: 'Sword of wounding' },
    { weight: 1, data: 'Tentacle rod' },
    { weight: 1, data: 'Vicious weapon' },
    { weight: 1, data: 'Wand of binding' },
    { weight: 1, data: 'Wand of enemy detection' },
    { weight: 1, data: 'Wand of fear' },
    { weight: 1, data: 'Wand of fireballs' },
    { weight: 1, data: 'Wand of ligthning bolts' },
    { weight: 1, data: 'Wand of paralysis' },
    { weight: 1, data: 'Wand of the war mage, +2' },
    { weight: 1, data: 'Wand of wonder' },
    { weight: 1, data: 'Wand of flying' },
  ],
});