import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ApiConstructor {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.counter = 0;
  }

  async fatchImages() {
    const URL = 'https://pixabay.com/api';
    const KEY = '34861044-3d4a2b0f1a81501e9c4423978';
    const urlSearchParams = new URLSearchParams({
      key: KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
        page: this.page,
      
    });

    try {
      const response = await axios.get(
        `${URL}/?q=${this.searchQuery}&${urlSearchParams}`
      );

      if (response.data.totalHits === 0) {
        Notify.failure(
          `Sorry there are no images matching your search query. Please try again`
        );
        return [];
      }

      this.counterImagesLoad(response.data.hits.length);
      this.incrementPage();

      return response.data.hits || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  incrementPage() {
    this.page += 1;
  }

  counterImagesLoad(data) {
    this.counter += data;
  }

  resetPage() {
    this.page = 1;
  }

  resetСounterImagesLoad() {
    this.counter = 0;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
