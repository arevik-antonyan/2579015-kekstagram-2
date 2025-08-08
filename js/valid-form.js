import {sendData} from './api.js';
import {hasDuplicates} from './utils.js';
import {onKeydownEsc, openModal, closeModal, addEventListeners, removeEventListeners, showMessage, isAddedEventKeydown, resetForm} from './dom-utils.js';
import {addSliderEffects, removeSliderEffects, addScaleEditing, removeScaleEditing, changeImage} from './effects.js';

const LIMIT_COUNT_HASHTAG = 5;
const DESCRIPTION_REGEXP = /^.{0,140}$/;
const FILE_TYPES = ['.jpg', '.jpeg', '.png'];
const buttonSubmitText = {
  IDLE: 'Опубликовать',
  SENDING: 'Опубликовываю...' };

const form = document.querySelector('.img-upload__form');
const overlay = document.querySelector('.img-upload__overlay');
const inputFile = document.querySelector('.img-upload__input');
const buttonClose = document.querySelector('.img-upload__cancel');
const buttonSubmit = document.querySelector('.img-upload__submit');
const inputHashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');
let errorMessage = '';

const rules = [
  {
    check: (value) => /^#.*$/.test(value),
    error: 'Хэштег должен начинаться с символа # (решётка)'
  },
  {
    check: (value) => /^#.+$/.test(value),
    error: 'Хеш-тег не может состоять только из одной решётки'
  },
  {
    check: (value) => /^#.{1,20}$/.test(value),
    error: 'Максимальная длина одного хэштега 20 символов, включая решётку'
  },
  {
    check: (value) => /^#[a-zа-яё0-9]+$/i.test(value),
    error: 'Строка после решётки должна состоять из букв и чисел'
  }
];

const handlers = [
  { event: 'click', element: buttonClose, handler: closeForm},
  { event: 'keydown', element: document, handler: onFormKeydownEsc },
  { event: 'keydown', element: inputHashtags, handler: onFieldKeydownEsc },
  { event: 'keydown', element: description, handler: onFieldKeydownEsc }
];

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--error',
  errorTextParent: 'img-upload__field-wrapper',
});

const getErrorMessage = () => errorMessage;

// Обработчик нажатия Esc у формы
function onFormKeydownEsc(evt) {
  const addedEventKeydown = isAddedEventKeydown();

  if (!addedEventKeydown) {
    onKeydownEsc(evt, closeForm);
  }
}

// Обработчик нажатия Esc у полей ввода
function onFieldKeydownEsc(evt) {
  onKeydownEsc(evt, () => evt.stopPropagation());
}

// Закрытие формы
function closeForm () {
  closeModal(overlay);
  removeEventListeners(handlers);
  resetForm(form, pristine);
  removeScaleEditing();
  removeSliderEffects();
}

// Открытие формы
const openForm = () => {
  openModal(overlay);
  addEventListeners(handlers);
  addScaleEditing();
  addSliderEffects();
};

// Заблокировать кнопку отправки формы
const blockButtonSubmit = () => {
  buttonSubmit.disabled = true;
  buttonSubmit.textContent = buttonSubmitText.SENDING;
};

// Разблокировать кнопку отправки формы
const unblockButtonSubmit = () => {
  buttonSubmit.disabled = false;
  buttonSubmit.textContent = buttonSubmitText.IDLE;
};

// Проверка хэштегов
const checkHashtags = () => {
  const hashtags = inputHashtags.value.trim().split(/\s+/).filter(Boolean);

  if (hashtags.length > LIMIT_COUNT_HASHTAG) {
    errorMessage = 'Нельзя указать больше пяти хэштегов';
    return false;
  }

  for (const hashtag of hashtags) {
    for (const rule of rules) {
      if (!rule.check(hashtag)) {
        errorMessage = rule.error;
        return false;
      }
    }
  }

  // Проверка на дублирование
  const lowercased = hashtags.map((item) => item.toLowerCase());
  if (hasDuplicates(lowercased)) {
    errorMessage = 'Один и тот же хэштег не может быть использован дважды';
    return false;
  }

  return true;
};

// Отправка формы
const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    if (pristine.validate()) {
      blockButtonSubmit();
      const formData = new FormData(evt.target);
      sendData(formData)
        .then(() => showMessage('success'))
        .then(onSuccess)
        .catch(() => showMessage('error'))
        .finally(unblockButtonSubmit);
    }
  });
};

inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];
  const fileName = file.name.toLowerCase();

  const isValidType = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (isValidType) {
    changeImage(URL.createObjectURL(file));
    openForm();
  } else {
    showMessage('data-error', 'Недопустимый тип файла');
  }
});

pristine.addValidator(inputHashtags, checkHashtags, getErrorMessage);
pristine.addValidator(description, () => DESCRIPTION_REGEXP.test(description.value), 'Длина комментария не может составлять больше 140 символов.');

setUserFormSubmit(closeForm);
