import { jsHeader } from '../../constants';

export const js = `${jsHeader}

const FLASH_ANIMATION_TIME = 3000;
const FLASH_DELAY_BEFORE_ANIMATION_STARTS = 20;
const FLASH_INITIAL_OPACITY = 0.5;
const FLASH_HEAL_COLOR = 'green';
const FLASH_DMG_COOLR = 'rgba(120,0,0,1)';
const DAMAGE_SHOW_THRESHOLD_RATIO = 0.5;

let status = undefined;
const elems = {
  container: document.querySelector('.container'),
  damage: document.querySelector('.damage'),
  down: document.querySelector('.down'),
  vignetee: document.querySelector('.vignetee'),
  flash: document.querySelector('.flash'),
};

function getValues(note, fields) {
  const values = {
    title: note.title,
    fields: Object.entries(fields).reduce((res, [key, fieldId]) => {
      const value = note.content[fieldId];
      const numeric = Number(value);
      res[key] = isNaN(numeric) ? value : numeric;
      return res;
    }, {}),
  };

  return {
    hpCurrent: values.fields.hp || 0,
    hpMax: values.fields.hpMax || 0,
    hpTemp: values.fields.hpTemp || 0,
    totalHp: (values.fields.hp || 0) + (values.fields.hpTemp || 0),
  }
}

function handler(type, data) {
  console.log(type, data);
  const { note, fields } = data;

  const newValues = getValues(note, fields);
  handleDmg(status, newValues);
  handleFlash(status, newValues);
  status = newValues;
}

function init(type, data) {
  const { note, fields } = data;

  status = getValues(note, fields);
  elems.container.removeChild(elems.flash);

  handler(type, data);
}

function handleFlash(old, current) {
  if (current.totalHp > old.totalHp) {
    showFlash(FLASH_HEAL_COLOR);
  } else if (current.totalHp < old.totalHp) {
    showFlash(FLASH_DMG_COOLR);
  }
}

function showFlash(color) {
  elems.flash.style.background = color;
  elems.flash.style.opacity = FLASH_INITIAL_OPACITY;
  elems.container.appendChild(elems.flash);

  setTimeout(() => {
    elems.flash.style.opacity = 0;

    setTimeout(() => {
      elems.container.removeChild(elems.flash);
    }, FLASH_ANIMATION_TIME);
  }, FLASH_DELAY_BEFORE_ANIMATION_STARTS);
}

function hideFlash() {

}

function handleDmg(old, current) {
  const showDmgThreshold = current.hpMax * DAMAGE_SHOW_THRESHOLD_RATIO;
  const hp = current.totalHp;
  const damageOpacity = hp > 0 && hp < showDmgThreshold
    ? 1 - hp / showDmgThreshold
    : 0;
  const downOpacity = hp > 0 ? 0 : 1;

  elems.damage.style.opacity = damageOpacity;
  elems.down.style.opacity = downOpacity;
  elems.vignetee.style.opacity = downOpacity;
}

onDataLoad(init);
onDataUpdate(handler);
`;
