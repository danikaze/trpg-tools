import { jsHeader, tweenClass } from '../../constants';

export const js = `${jsHeader}

${tweenClass}

const tween = {};

function loadHandler(type, data) {
  console.log(type, data);
  const { note, fields } = data;

  tween.hp = initTween(note, fields, 'hp');
  tween.hpMax = initTween(note, fields, 'hpMax');
  tween.hpTemp = initTween(note, fields, 'hpTemp', positiveValue);
}

function updateHandler(type, data) {
  console.log(type, data);
  const { note, fields } = data;

  tween.hp.tweenTo(note.content[fields.hp] || 0);
  tween.hpMax.tweenTo(note.content[fields.hpMax] || 0);
  tween.hpTemp.tweenTo(note.content[fields.hpTemp] || 0);
}

function initTween(note, fields, fieldName, postTransform) {
  const selector = '[data-field="' + fieldName + '"]';
  const initialValue = note.content[fields[fieldName]] || 0;
  updateValue(selector, initialValue, postTransform);

  return new Tween(initialValue)
    .transform(Math.round)
    .onChange((value) => updateValue(selector, value, postTransform));
}

function positiveValue(value) {
  return value > 0 ? '+' + value : '';
}

function updateValue(selector, value, postTransform) {
  Array.from(document.querySelectorAll(selector)).forEach(elem => {
    const innerText = postTransform ? postTransform(value) : value;
    elem.innerText = innerText;
  });
}

onDataLoad(loadHandler);
onDataUpdate(updateHandler);
`;
