import axios from 'axios';

// This feels like the kind of thing that should go in a .env file on the server to me,
// but given that this is a front end app only, I'm just putting it here
const API_KEY = 'dc3bd67ed4c32e7d2c858a74efca4575';

const state = {
  movies: [],
  loading: true,
};

const getters = {
  allMovies: currentState => currentState.movies,
};

const actions = {
  async fetchMovies({ commit }) {
    commit('loading');
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`);
    const moviesJson = response.data.results;
    commit('setMovieList', moviesJson);
  },
};

const mutations = {
  loading: currentState => (currentState.loading = true),
  setMovieList: (currentState, movies) => {
    currentState.movies = movies;
    currentState.loading = false;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
