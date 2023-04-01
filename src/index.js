import ApiConstructor from './js/api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const galleryCreateing = new ApiConstructor();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  galleryCreateing.query = e.currentTarget.elements.searchQuery.value;

  const message = galleryCreateing.query === '' 
    ? `The search field cannot be empty. Enter a query to search for images`
    : false;

  if (message) {
    return Notify.failure(message);
  }

  galleryCreateing.resetPage();
  galleryCreateing.resetСounterImagesLoad();

  galleryCreateing.fatchImages()
    .then(response => {
      cleanImagesContainer();
      appendImagesMarkup(response);
    });
}

function appendImagesMarkup(data) {
  const IfTooLong = data.length >= 40;

  refs.loadMoreBtn.classList.toggle('is-hidden', !IfTooLong);

  const markup = data.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
      <div class="photo-card">
        <a class="photo-card__link" href="${largeImageURL}">
          <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item"><b>Likes <span class="info-item__text">${likes}</span></b></p>
            <p class="info-item"><b>Views <span class="info-item__text">${views}</span></b></p>
            <p class="info-item"><b>Comments <span class="info-item__text">${comments}</span></b></p>
            <p class="info-item"><b>Downloads <span class="info-item__text">${downloads}</span></b></p>
          </div> 
        </a>
      </div>`;
  }).join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  let gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 300,
  });

  gallery.on('show.simplelightbox', function () {});
}

function onLoadMore() {
  galleryCreateing.fatchImages()
    .then(appendImagesMarkup).finally(console.log('Yeeeeah Biaaacth, load more!!'));
}

function cleanImagesContainer() {
  refs.gallery.innerHTML = '';
}
