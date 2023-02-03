import axios from 'axios';

export class ImagesApiService {
  constructor() {
    this.inputValue = '';
    this.page = 1;
    this.countImg = 0;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParams = new URLSearchParams({
      key: `33354076-0a876f5b723d518ba8fae8563`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });

    const response = await axios.get(
      `${BASE_URL}?${searchParams}&q=${this.inputValue}&page=${this.page}`
    );

    return response.data;
  }

  get value() {
    return this.inputValue;
  }

  set value(newValue) {
    this.inputValue = newValue;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetCountImg() {
    this.countImg = 0;
  }
}