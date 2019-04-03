import axios from 'axios';

// This feels like the kind of thing that should usually go in a .env file on the server to me,
// but given that this is a front end app only, I'm just putting it here
const API_KEY = 'dc3bd67ed4c32e7d2c858a74efca4575';

const state = {
  movies: [],
  loading: true,
  selectedMovie: undefined,
  genres: undefined,
};

const getters = {
  allMovies: currentState => currentState.movies,
  moviesLoading: currentState => currentState.loading,
  selectedMovie: currentState => currentState.selectedMovie,
  genres: currentState => currentState.genres,
};

const actions = {
  async fetchMovies({ commit }) {
    commit('loading');

    // Request the first 5 pages; each page is only 20 results and we want 100
    // NOTE: i starts from 1 because API starts from 1 and adding 1 each iteration is wasteful
    const promiseDump = [];
    for (let i = 1; i < 6; i += 1) {
      const response = axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${i}&vote_count.gte=150`);
      promiseDump.push(response);
    }

    // Todo: handle errors e.g. promise rejections
    const promises = await Promise.all(promiseDump);
    const moviesJson = [];
    promises.map(response => response.data.results.forEach(value => moviesJson.push(value)));
    commit('setMovieList', moviesJson);
  },
  setSelectedMovie({ commit }, movie) {
    commit('selectMovie', movie);
  },
  async fetchGenres({ commit }) {
    // Here we grab the genres list, because for some reason,
    // each genre on TMDB is assigned an arbitrary number
    const genres = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
    commit('addGenres', genres.data.genres);
  },
};

const mutations = {
  loading: currentState => (currentState.loading = true),
  setMovieList: (currentState, movies) => {
    currentState.movies = movies;
    currentState.loading = false;
  },
  selectMovie: (currentState, movie) => (currentState.selectedMovie = movie),
  addGenres: (currentState, genres) => (currentState.genres = genres),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
