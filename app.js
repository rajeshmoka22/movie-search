const input = document.querySelector('#searchInput');
const movieContainer = document.querySelector('#movieContainer');

function debounce(callback, wait) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

const getMovies = (e) => {
  const { value } = e.target;
  if(value.length > 2) {
    const url = `https://www.omdbapi.com/?s=${value}&apikey=a5a3bcde`;
    fetch(url)
      .then((resp) => resp.json())
      .then(data => {
        const { Search } = data;
        if(Search) showMovies(Search);
        else movieContainer.innerHTML = 'No results found';
      })
  }
}

getMovies({target : { value : 'marvel' }});

input.addEventListener('keyup', debounce(getMovies, 500));

const showMovies = (movies) => {
  movieContainer.innerHTML = '';
    movies.forEach(movie => {
      movieContainer.appendChild(movieCard(movie));
    });
}

const getMovieDetails = (e) => {
  const id = e.currentTarget.getAttribute('id');
  const modal = document.querySelector('.modal');
  modal.style.display = '';
  const parent = modal.querySelector('.movieDetails');
  parent.innerHTML = '';
  const url = `https://www.omdbapi.com/?i=${id}&apikey=a5a3bcde`;
  fetch(url)
  .then(resp => resp.json())
  .then(data => {
    renderModalContent(data);
  })
}

const renderModalContent = (data) => {
  const { Poster, Title, Year, Runtime, Released, Director, Genre, Language, BoxOffice, imdbRating, Country, Awards, imdbVotes } = data;
  const parent = document.querySelector('.movieDetails');
  parent.appendChild(addCross())
  const image = document.createElement('img');
  image.classList.add('imgBorder');
  if(Poster !== 'N/A') image.setAttribute('src', Poster);
  else image.setAttribute('alt', 'Image');
  const movieDiv = document.createElement('div');
  movieDiv.appendChild(getTitle(Title));
  movieDiv.appendChild(getDiv('IMDb Rating', imdbRating));
  movieDiv.appendChild(getDiv('Year', Year));
  movieDiv.appendChild(getDiv('Duration', Runtime));
  movieDiv.appendChild(getDiv('Released', Released));
  movieDiv.appendChild(getDiv('Director', Director));
  movieDiv.appendChild(getDiv('Genre', Genre));
  movieDiv.appendChild(getDiv('Language', Language));
  movieDiv.appendChild(getDiv('Box Office', BoxOffice));
  movieDiv.appendChild(getDiv('Country', Country));
  movieDiv.appendChild(getDiv('Awards', Awards));
  movieDiv.appendChild(getDiv('IMDb Votes', imdbVotes));
  parent.appendChild(image);
  parent.appendChild(movieDiv);
}

const getTitle = (Title) => {
  const heading = document.createElement('h1');
  heading.textContent = Title;
  heading.style.maxWidth = '350px'
  heading.style.marginBottom = '16px';
  return heading;
}

const addCross = () => {
  const div = document.createElement('div');
  div.classList.add('crossIcon');
  div.textContent='X';
  const modal = document.querySelector('.modal');
  div.onclick = () => {
    modal.style.display = 'none';
  }
  return div;
}

const getDiv = (label, value) => {
  const div = document.createElement('div');
  div.classList.add('flex');
  div.style.marginBottom = '4px';
  const title = document.createElement('strong');
  title.innerText = label;
  title.style.width = '120px';
  title.style.color = '#eaa917';
  const valueDiv = document.createElement('div');
  valueDiv.style.marginLeft = '4px';
  valueDiv.innerText = value || 'N/A';
  div.appendChild(title);
  div.appendChild(valueDiv)
  return div;
}

const movieCard = (movie) => {
  const { Title, Year, Poster, imdbID } = movie;
  const movieDiv = document.createElement('div');
  movieDiv.setAttribute('id', imdbID);
  movieDiv.classList.add('movie_card');
  const image = document.createElement('img');
  image.classList.add('imgBorder');
  if(Poster !== 'N/A') image.setAttribute('src', Poster);
  else image.setAttribute('alt', 'Image')
  const title = document.createElement('strong');
  title.style.display = 'block';
  title.textContent = Title;
  const year = document.createElement('div');
  year.style.color = 'gray';
  year.textContent = Year;
  movieDiv.appendChild(image);
  movieDiv.appendChild(title);
  movieDiv.appendChild(year);
  movieDiv.onclick = getMovieDetails;
  return movieDiv;
}



