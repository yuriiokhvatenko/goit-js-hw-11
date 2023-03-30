const form = document.getElementById('search-form');
const apiKey = '34861044-3d4a2b0f1a81501e9c4423978';
let currentPage = 1;

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchQuery = event.target.searchQuery.value;

  fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=10&page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      if (data.hits.length === 0) {
        // Виводимо повідомлення, якщо немає зображень, що задовольняють запит
        console.log('Sorry, there are no images matching your search query. Please try again.');
      } else {
        // Виводимо результати запиту
        data.hits.forEach(hit => {
          const image = {
            webformatURL: hit.webformatURL,
            largeImageURL: hit.largeImageURL,
            alt: hit.tags,
            likes: hit.likes,
            views: hit.views,
            comments: hit.comments,
            downloads: hit.downloads
          };
          console.log(image);
        });
      }
    })
    .catch(error => {
      console.error(error);
    });

  currentPage++;
});