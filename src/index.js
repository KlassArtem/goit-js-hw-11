import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import infiniteScroll from 'infinite-scroll';
import { ImagesApiService } from './js/images';
import { createMarkupImageCard } from './js/markupgallery';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refsform = document.getElementById('search-form');
const refsgallery = document.querySelector('.gallery');
const refsloadMore = document.querySelector('.load-more');


const imagesApiService = new ImagesApiService();

getDefaultFetchData();

refsform.addEventListener('submit', handleFormSubmit);

refsloadMore.addEventListener('click', handleLoadMoreBtnClick);

function handleFormSubmit(event) {
  event.preventDefault();

  const searchInput = event.currentTarget.elements.searchQuery;
  const inputValue = searchInput.value.trim();

  clearMarkup();
  refsloadMore.classList.add('is-hidden');

  if (!inputValue) {
    getMessageInfo('Write something');
    return;
  }

  imagesApiService.value = inputValue;

  imagesApiService.resetPage();
  imagesApiService.resetCountImg();
  getFetchData();

  event.currentTarget.reset();
}

function handleLoadMoreBtnClick(event) {
  imagesApiService.incrementPage();
  getFetchData();
}

async function getFetchData() {
  try {
    const { hits, totalHits } = await imagesApiService.fetchImages();
    imagesApiService.countImg += hits.length;

    if (!hits.length) {
      getMessageErr(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    if (imagesApiService.page === 1) {
      getMessageInfo(`Hooray! We found ${totalHits} images.`);
    }

    if (imagesApiService.countImg === totalHits) {
      getMessageInfo(
        "We're sorry, but you've reached the end of search results."
      );
      refsloadMore.classList.add('is-hidden');

      appendMarkupImage(hits);
      lightbox.refresh();
      return;
    }

    appendMarkupImage(hits);
    smootherScroll();
    lightbox.refresh();

    refs.loadMore.classList.remove('is-hidden');
  } catch (err) {
    getMessageErr(err.message);
  }
}

function appendMarkupImage(cards) {
  const markup = cards.map(createMarkupImageCard).join('');
  refsgallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkup() {
  refsgallery.innerHTML = '';
}

function getMessageErr(message) {
  Notify.failure(message);
}

function getMessageInfo(message) {
  Notify.info(message);
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function smootherScroll() {
  const { height: cardHeight } =
    refsgallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 0.25,
    behavior: 'smooth',
  });
}

async function getDefaultFetchData() {
  try {
    const { hits } = await imagesApiService.fetchImages();

    appendMarkupImage(hits);
    lightbox.refresh();

    refsloadMore.classList.remove('is-hidden');
  } catch (err) {
    getMessageErr(err.message);
  }
}