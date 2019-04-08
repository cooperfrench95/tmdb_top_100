import axios from 'axios';

// This feels like the kind of thing that should usually go in a .env file on the server to me,
// but given that this is a front end app only, I'm just putting it here
const API_KEY = 'dc3bd67ed4c32e7d2c858a74efca4575';

const state = {
  movies: [],
  error: false,
  loading: false,
  selectedMovie: undefined,
  genres: undefined,
  includeLowVotes: false,
  sortBy: 'vote_average.desc', // Could also be popularity or release date
  desiredResults: 100, // Multiple of 20
  language: 'en-US', // English or German for now
  shortlist: [],
};

// To make things easier, we could turn these all into one getter
// and just access that object as 'state' or something like that,
// but I just did it this way out of habit.
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
  error: currentState => currentState.error,
};


const actions = {
  // fetchMovies makes a call to the TMDB API and gets your list of movies.
  async fetchMovies(context, wantLoadingSpinner) {
    if (wantLoadingSpinner === true) {
      context.commit('loading');
    }

    try {
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

      const promises = await Promise.all(promiseDump);
      const moviesJson = [];
      promises.map(response => response.data.results.forEach(value => moviesJson.push(value)));

      // If there is a selected movie, we need to update that data.
      if (context.state.selectedMovie !== undefined) {
        const update = await axios.get(`https://api.themoviedb.org/3/movie/${context.state.selectedMovie.id}?api_key=${API_KEY}&language=${context.state.language}`);
        context.commit('selectMovie', update.data);
      }

      context.commit('setMovieList', moviesJson);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      context.commit('error');
    }
  },
  // Set the selected movie for MovieDetails to display, and get more info from it from the API.
  async setSelectedMovie(context, movie) {
    try {
      context.commit('loading');
      const update = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=${context.state.language}`);
      context.commit('selectMovie', update.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      context.commit('error');
    }
  },
  async fetchGenres({ commit }) {
    try {
      // Here we grab the genres list, because for some reason,
      // each genre on TMDB is assigned an arbitrary number
      const genres = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`);
      commit('addGenres', genres.data.genres);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      commit('error');
    }
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
    currentState.error = false;
  },
  selectMovie: (currentState, movie) => {
    currentState.selectedMovie = movie;
    currentState.loading = false;
    currentState.error = false;
  },
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
  error: (currentState) => {
    currentState.error = true;
    currentState.moviesLoading = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
