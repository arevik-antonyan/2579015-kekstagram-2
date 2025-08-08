const MESSAGE_SHOW_TIME = 5000;
let addedEventKeydown = false;

// Узнать добавлено ли на документ событие keydown
export const isAddedEventKeydown = () => addedEventKeydown;

// Создание элемента разметки с заданным классом и заполненным текстом
export const makeElement = (tagName, className, text) => {
  const newElement = document.createElement(tagName);
  newElement.classList.add(className);

  if(text) {
    newElement.textContent = text;
  }

  return newElement;
};

// Найти в массиве
export const findInArray = (elements, predicate) => Array.from(elements).find(predicate);

// Обработчик события нажатия Escape
export const onKeydownEsc = (evt, callback) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    callback();
  }
};

// Обработчик клика вне элемента
export const onClickOutside = (evt, element, callback) => {
  if (element && !element.contains(evt.target)) {
    callback();
  }
};

// Открытие модального окна
export const openModal = (element) => {
  element.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

// Закрытие модального окна
export const closeModal = (element) => {
  element.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

// Добавление событий
export const addEventListeners = (handlersArray) => {
  for (const item of handlersArray) {
    if (item.event && item.element && item.handler) {
      item.element.addEventListener(item.event, item.handler);
    }
  }
};

// Удаление событий
export const removeEventListeners = (handlersArray) => {
  for (const item of handlersArray) {
    if (item.event && item.element && item.handler) {
      item.element.removeEventListener(item.event, item.handler);
    }
  }
};

// Повесить обработчики для закрытия элемента
const onElementCloseClick = (element, button) => {
  const handlers = [
    { event: 'click', element: button, handler: removeElement},
    { event: 'click', element: document, handler: onDocumentClickOutside},
    { event: 'keydown', element: document, handler: onDocumentKeydownEsc}
  ];

  function removeElement() {
    element.parentElement.remove();
    removeEventListeners(handlers);
  }

  function onDocumentClickOutside(evt) {
    onClickOutside(evt, element, removeElement);
  }

  function onDocumentKeydownEsc(evt) {
    addedEventKeydown = false;
    onKeydownEsc(evt, removeElement);
  }

  addedEventKeydown = true;
  addEventListeners(handlers);
};

// Создание слайдера
export const createSlider = (sliderElement, minValue, maxValue, stepValue) => {
  noUiSlider.create(sliderElement, {
    range: {
      min: minValue,
      max: maxValue,
    },
    step: stepValue,
    start: minValue,
    connect: 'lower',
    format: {
      to: function (value) {
        return parseFloat(value.toFixed(2)).toString();
      },
      from: function (value) {
        return parseFloat(value);
      }
    }
  });
};

// Обновить слайдер
export const updateOptionsSlider = (slider, minValue, maxValue, stepValue) => {
  slider.noUiSlider.updateOptions({
    range: {
      min: minValue,
      max: maxValue,
    },
    step: stepValue,
    start: maxValue
  });
};

// Показать сообщение по шаблону
export const showMessage = (templateId, messageTitle) => {
  const template = document.getElementById(templateId);
  const message = template.content.querySelector('section').cloneNode(true);
  const inner = message.querySelector(`.${ templateId }__inner`);
  const button = message.querySelector(`.${ templateId }__button`);
  const title = message.querySelector(`.${ templateId }__title`);

  if (messageTitle) {
    title.textContent = messageTitle;
  }

  document.body.append(message);

  if (button) {
    onElementCloseClick(inner, button);
  } else {
    setTimeout(() => {
      message.remove();
    }, MESSAGE_SHOW_TIME);
  }
};

// Функция устранения дребезга
export const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Очистка формы
export const resetForm = (form, pristine) => {
  form.reset();
  pristine.reset();
};
