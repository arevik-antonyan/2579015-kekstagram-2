import {onPictureClick} from './render-big-picture.js';

// Создание элемента Picture
const createPicture = (id, post, pictureTemplate) => {
  const newPicture = pictureTemplate.cloneNode(true);

  newPicture.dataset.id = id;
  const image = newPicture.querySelector('.picture__img');
  image.src = post.url;
  image.alt = post.description;
  newPicture.querySelector('.picture__likes').textContent = post.likes;
  newPicture.querySelector('.picture__comments').textContent = post.comments.length;

  return newPicture;
};

// Отрисовка постов
const renderPosts = (posts) => {
  const pictures = document.querySelector('.pictures');
  const template = document.querySelector('#picture').content.querySelector('.picture');
  const fragment = document.createDocumentFragment();

  posts.forEach((element, index) => {
    const pictureItem = createPicture(index, element, template);
    fragment.appendChild(pictureItem);
  });

  pictures.appendChild(fragment);

  pictures.addEventListener('click', (evt) => {
    const picture = evt.target.closest('.picture');

    if (picture) {
      evt.preventDefault();
      onPictureClick(posts[picture.dataset.id]);
    }
  });
};

export {renderPosts};
