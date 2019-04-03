<template>
  <v-container>
    <v-layout row justify-space-around wrap>
      <v-flex xs12 justify-center>
        <h1>Top 100 Movies</h1>
      </v-flex>
      <v-flex xs12>
        <v-text-field outline label="Search" v-model="searchTerm"/>
      </v-flex>
    </v-layout>
    <MoviesList :filteredMovies="this.filteredMovies" :noneFound="this.noneFound" v-if="moviesLoading === false && selectedMovie === undefined" />
    <MovieDetails :movie="this.selectedMovie" v-else-if="moviesLoading === false && selectedMovie !== undefined" />
    <v-progress-circular class="loading" v-else indeterminate color="green" size="200" width="20"/>
  </v-container>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import MoviesList from './MoviesList';
import MovieDetails from './MovieDetails';

// The main component does the searching logic and passes it down to the component that displays the movies.
// If there is a 'selected movie', render the details component.
// If not, render the list component.
// If the user changes the settings, e.g. clicks on one of the radio buttons, call the API again.


// There should be a refresh button in the top corner. This will make another call to the API.
export default {
  name: "Main",
  components: {
    MoviesList,
    MovieDetails,
  },
  methods: {
    ...mapActions(['fetchMovies', 'fetchGenres'])
  },
  data () {
    return{
      searchTerm: '',
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
      noneFound: false
    }
  },
  computed: {
    ...mapGetters(['allMovies', 'moviesLoading', 'selectedMovie']),
    filteredMovies: function() {
      const filtered = this.allMovies.filter(movie => movie.title.toLowerCase().match(this.searchTerm.toLowerCase()));
      if (filtered.length === 0) {
        this.noneFound = true;
      }
      else {
        this.noneFound = false;
      }
      return filtered;
      },
  },
  created () {
    this.fetchMovies();
    this.fetchGenres();
  }
}
</script>


<style scoped>
h1 {
  text-align: center;
  padding: 50px;
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
 