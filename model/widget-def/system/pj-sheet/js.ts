import { jsHeader, tweenClass } from '../../constants';

export const js = `${jsHeader}

${tweenClass}

const elems = {};
const tween = {};

function loadHandler(type, data) {
  console.log(type, data);
  const { note, fields } = data;

  elems.hp = document.getElementById('hpCurrent');
  elems.hpMax = document.getElementById('hpMax');
  elems.hpTemp = document.getElementById('hpTemp');
  elems.barHpCurrent = document.getElementById('hpBarCurrent');
  elems.barHpTemp = document.getElementById('hpBarTemp');

  tween.hp = initTween(note, fields, 'hp');
  tween.hpMax = initTween(note, fields, 'hpMax');
  tween.hpTemp = initTween(note, fields, 'hpTemp', positiveValue);

  updateHandler(type, data);
}

function updateHandler(type, data) {
  console.log(type, data);
  const { note, fields } = data;

  const values = Object.entries(fields).reduce((values, [key, id]) => {
    const value = note.content[id];
    if (key in tween) {
      tween[key].tweenTo(value);
    } else {
      values[key] = value;
    }
    return values;
  }, {});

  values.strMod = getMod(values.str);
  values.dexMod = getMod(values.dex);
  values.conMod = getMod(values.con);
  values.intMod = getMod(values.int);
  values.wisMod = getMod(values.wis);
  values.chaMod = getMod(values.cha);

  updateHpBar(
    Number(note.content[fields.hp]) || 0,
    Number(note.content[fields.hpMax]) || 0,
    Number(note.content[fields.hpTemp]) || 0
  );

  /*
   * Set the innerText of the elements with the [data-field="FIELD_NAME"]
   * attribute to the actual value of the PJ field
   */
  Object.entries(values).forEach(([key, value]) => {
    const selector = '[data-field="' + key + '"]';
    updateValue(selector, value);
  });

  /*
   * Set the style.background of the elements with the
   * [data-field-bg-image="FIELD_NAME"]
   * attribute to the actual value of the PJ field
   */
  Object.entries(values).forEach(([key, value]) => {
    const selector = '[data-field-bg-image="' + key + '"]';
    Array.from(document.querySelectorAll(selector)).forEach(elem => {
      elem.style.backgroundImage = 'url(' + value + ')';
    });
  });

  /*
   * Set the innerText of the elements with the [data-note="title"]
   * attribute to the actual name of the note
   */
  Array.from(document.querySelectorAll('[data-note="title"]'))
    .forEach(elem => {
      elem.innerText = note.title;
    });
}

function initTween(note, fields, fieldName, postTransform) {
  const selector = '[data-field="' + fieldName + '"]';
  const initialValue = note.content[fields[fieldName]] || 0;
  updateValue(selector, initialValue, postTransform);

  return new Tween(initialValue)
    .transform(Math.round)
    .onChange((value) => updateValue(selector, value, postTransform));
}

function getMod(value) {
  const mod = Math.floor((Number(value) - 10) / 2);
  return addSign(mod);
}

function positiveValue(value) {
  return value > 0 ? '+' + value : '';
}

function addSign(value) {
  if (isNaN(value)) return '';
  return value > 0 ? '+' + value : value;
}

function updateValue(selector, value, postTransform) {
  Array.from(document.querySelectorAll(selector)).forEach(elem => {
    const innerText = postTransform ? postTransform(value) : value;
    elem.innerText = innerText === undefined ? '' : innerText;
  });
}

function updateHpBar(hp, hpMax, hpTemp) {
  const hpTotal = hpMax + hpTemp;
  const currentPctg = ((hp / hpTotal) * 100).toFixed(2);
  const tempPctg =
    hpTemp > 0 && hp + hpTotal === hpTotal
      ? hp > 0
        ? 100 - Number(currentPctg)
        : ((hpTemp / hpMax) * 100).toFixed(2)
      : ((hpTemp / hpTotal) * 100).toFixed(2);

  elems.barHpCurrent.style.width = currentPctg  + '%';
  elems.barHpTemp.style.width = tempPctg  + '%';
}

onDataLoad(loadHandler);
onDataUpdate(updateHandler);
`;
