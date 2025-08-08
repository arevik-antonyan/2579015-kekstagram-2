import {findInArray, addEventListeners, removeEventListeners, createSlider, updateOptionsSlider} from './dom-utils.js';

const STEP_SCALE = 25;
const MAX_VALUE_SCALE = 100;
const MIN_VALUE_SCALE = 25;

const buttonSmaller = document.querySelector('.scale__control--smaller');
const buttonBigger = document.querySelector('.scale__control--bigger');
const inputScale = document.querySelector('.scale__control--value');
const imagePreview = document.querySelector('.img-upload__preview img');
const effectsPreview = document.querySelectorAll('.effects__preview');
const sliderContainer = document.querySelector('.img-upload__effect-level');
const slider = document.querySelector('.effect-level__slider');
const inputEffectLevel = document.querySelector('.effect-level__value');
const effectsList = document.querySelectorAll('input[name="effect"]');

const clickHandlers = [
  { event: 'click', element: buttonSmaller, handler: () => addScale(-STEP_SCALE)},
  { event: 'click', element: buttonBigger, handler: () => addScale(STEP_SCALE) }
];

const effects = {
  none : () => 'none',
  chrome : (value) => `grayscale(${value})`,
  sepia : (value) => `sepia(${value})`,
  marvin : (value) => `invert(${value}%)`,
  phobos : (value) => `blur(${value}px)`,
  heat : (value) => `brightness(${value})`
};

const effectsConfig = {
  none: { min: 0, max: 0 },
  chrome: { min: 0, max: 1, step: 0.1 },
  sepia: { min: 0, max: 1, step: 0.1 },
  marvin: { min: 0, max: 100, step: 1 },
  phobos: { min: 0, max: 3, step: 0.1 },
  heat: { min: 1, max: 3, step: 0.1 }
};

// Добавить к масштабу заданное значение
function addScale(step) {
  const currentScale = Number(inputScale.value.replace('%', ''));
  const newScale = currentScale + step;

  if (newScale >= MIN_VALUE_SCALE && newScale <= MAX_VALUE_SCALE) {
    inputScale.value = `${newScale}%`;
    imagePreview.style.transform = `scale(${newScale / 100})`;
  }
}

// Спрятать слайдер
const hiddenSlider = () => {
  sliderContainer.classList.add('hidden');
  slider.classList.add('hidden');
};

// Показать слайдер
const showSlider = () => {
  sliderContainer.classList.remove('hidden');
  slider.classList.remove('hidden');
};

// Обработчик изменения слайдера
const onSliderUpdate = () => {
  inputEffectLevel.value = slider.noUiSlider.get();
  const checkedEffect = findInArray(effectsList, (radio) => radio.checked).value;
  const effectFunc = effects[checkedEffect];
  imagePreview.style.filter = effectFunc(inputEffectLevel.value);
};

// Обработчик изменения эффекта
const onEffectChange = (evt) => {
  const effect = evt.target.value;
  const config = effectsConfig[effect];

  const func = effect === 'none' ? hiddenSlider : showSlider;
  func();

  updateOptionsSlider(slider, config.min, config.max, config.step);
};

// Добавить редактирование масштаба
const addScaleEditing = () => {
  addEventListeners(clickHandlers);
};

// Удалить редактирование масштаба
const removeScaleEditing = () => {
  removeEventListeners(clickHandlers);
};

// Добавить слайдер эффектов
const addSliderEffects = () => {
  createSlider(slider, 0, 1, 0.1);
  sliderContainer.classList.add('hidden');
  slider.noUiSlider.on('update', onSliderUpdate);

  effectsList.forEach((radio) => {
    radio.addEventListener('change', onEffectChange);
  });
};

// Очистить стили у картинки
const clearStyleImage = () => {
  imagePreview.style.filter = 'none';
  imagePreview.style.transform = 'none';
};

// Удалить слайдер эффектов
const removeSliderEffects = () => {
  effectsList.forEach((radio) => {
    radio.removeEventListener('change', onEffectChange);
  });

  slider.noUiSlider.destroy();
  clearStyleImage();
};

// Сменить картинку
const changeImage = (newUrl) => {
  imagePreview.src = newUrl;

  effectsPreview.forEach((effect) => {
    effect.style.backgroundImage = `url(${newUrl})`;
  });
};

export {addSliderEffects, removeSliderEffects, addScaleEditing, removeScaleEditing, changeImage};

