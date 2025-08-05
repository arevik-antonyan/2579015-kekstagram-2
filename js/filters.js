import {findInArray, debounce} from './dom-utils.js';

const filters = document.querySelector('.img-filters');
const pictures = document.querySelector('.pictures');
const buttonFilters = document.querySelectorAll('.img-filters__button');
const ACTIVE_BUTTON_CLASS = 'img-filters__button--active';
const COUNT_SHOWN_PICTURES = 10;
const RERENDER_DELAY = 500;
let picturesArray = [];

const COMPARE_FUNC = {
  'filter-default' : compareDataId,
  'filter-random' : () => Math.random() - 0.5,
  'filter-discussed' : compareCountComments
};

// Сравнить по id
function compareDataId(pictureA, pictureB){
  const idA = Number(pictureA.dataset.id);
  const idB = Number(pictureB.dataset.id);
  return idA - idB;
}

// Сравнить по количеству комментариев
function compareCountComments(pictureA, pictureB) {
  const commentsA = Number(pictureA.querySelector('.picture__comments').textContent);
  const commentsB = Number(pictureB.querySelector('.picture__comments').textContent);
  return commentsB - commentsA;
}

// Отсортировать картинки
const sortPictures = (filter) => {
  const compareFunc = COMPARE_FUNC[filter];

  let newPictures = picturesArray.toSorted(compareFunc);

  if (filter.endsWith('random')) {
    newPictures = newPictures.slice(0, COUNT_SHOWN_PICTURES);
    pictures.querySelectorAll('.picture').forEach((pic) => pic.remove());
  }

  newPictures.forEach((picture) => pictures.appendChild(picture));
};

// Сохранение всех картинок
const initPictures = () => {
  picturesArray = Array.from(pictures.querySelectorAll('.picture'));
};

// Применить фильтр
const applyFilter = (evt) => {
  const chosenButton = evt.target;
  const activeButton = findInArray(buttonFilters, (bt) => bt.classList.contains(ACTIVE_BUTTON_CLASS));

  if (chosenButton === activeButton) {
    return;
  }

  activeButton.classList.remove(ACTIVE_BUTTON_CLASS);
  chosenButton.classList.add(ACTIVE_BUTTON_CLASS);
  const filter = chosenButton.id;

  sortPictures(filter);
};

// Обработчик клика
const onFiltersClick = debounce((evt) => {
  if (evt.target.matches('.img-filters__button')) {
    applyFilter(evt);
  }
}, RERENDER_DELAY);

// Показать фильтры
export const showFilters = () => {
  filters.classList.remove('img-filters--inactive');

  initPictures();

  filters.addEventListener('click', onFiltersClick);
};
