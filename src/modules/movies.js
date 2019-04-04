import axios from 'axios';

// This feels like the kind of thing that should usually go in a .env file on the server to me,
// but given that this is a front end app only, I'm just putting it here
const API_KEY = 'dc3bd67ed4c32e7d2c858a74efca4575';

const state = {
  movies: [],
  loading: true,
  selectedMovie: undefined,
  genres: undefined,
  includeLowVotes: false,
  sortBy: 'vote_average.desc', // Could also be popularity or release date
  desiredResults: 100, // Multiple of 20
  language: 'en-US', // English or German for now
  shortlist: [],
};

const getters = {
  allMovies: currentState => currentState.movies,
  moviesLoading: currentState => currentState.loading,
  selectedMovie: currentState => currentState.selectedMovie,
  genres: currentState => currentState.genres,
  includeLowVotes: currentState => currentState.includeLowVotes,
  sortBy: currentState => currentState.sortBy,
  desiredResults: currentState => currentState.desiredResults,
  language: currentState => currentState.language,
  shortlist: currentState => currentState.shortlist,
};

const actions = {
  async fetchMovies(context, wantLoadingSpinner) {
    if (wantLoadingSpinner === true) {
      context.commit('loading');
    }

    // Number of pages to request from the API based on the amount of results we want
    const pages = (context.state.desiredResults / 20) + 1;

    const promiseDump = [];
    for (let i = 1; i < pages; i += 1) {
      const request = 'https://api.themoviedb.org/3/discover/movie?'
                      + `api_key=${API_KEY}`
                      + `&language=${context.state.language}`
                      + `&sort_by=${context.state.sortBy}`
                      + '&include_adult=false'
                      + '&include_video=false'
                      + `&page=${i}`
                      + `${context.state.includeLowVotes ? '' : '&vote_count.gte=150'}`;
      const response = axios.get(request);
      promiseDump.push(response);
    }
    // Todo: handle errors e.g. promise rejections
    const promises = await Promise.all(promiseDump);
    const moviesJson = [];
    promises.map(response => response.data.results.forEach(value => moviesJson.push(value)));

    // If there is a selected movie, we need to update that data.
    if (context.state.selectedMovie !== undefined) {
      const updatedMovie = [];
      moviesJson.map((item) => {
        if (item.id === context.state.selectedMovie.id) {
          updatedMovie.push(item);
        }
        return item;
      });
      if (updatedMovie.length > 0) {
        context.commit('selectMovie', updatedMovie[0]);
      }
    }

    context.commit('setMovieList', moviesJson);
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
  setLanguage({ commit }, language) {
    commit('setLanguage', language);
  },
  toggleIncludeLowVotes({ commit }) {
    commit('toggleIncludeLowVotes');
  },
  setSortBy({ commit }, sortMethod) {
    commit('setSortBy', sortMethod);
  },
  setDesiredResults({ commit }, desiredResults) {
    commit('setDesiredResults', desiredResults);
  },
  editShortList({ commit }, shortlist) {
    commit('setShortList', shortlist);
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
  toggleIncludeLowVotes: currentState => (
    currentState.includeLowVotes = !currentState.includeLowVotes
  ),
  setLanguage: (currentState, language) => (currentState.language = language),
  setSortBy: (currentState, sortBy) => (currentState.sortBy = sortBy),
  setDesiredResults: (currentState, desiredResults) => (
    currentState.desiredResults = desiredResults
  ),
  setShortList: (currentState, shortlist) => (currentState.shortlist = shortlist),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
