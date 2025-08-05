import {getData} from './api.js';
import {showMessage} from './dom-utils.js';
import {renderPosts} from './render-pictures.js';
import {showFilters} from './filters.js';
import './valid-form.js';
import './effects.js';

getData()
  .then((data) => {
    renderPosts(data);
    showFilters();
  })
  .catch(() => showMessage('data-error'));
