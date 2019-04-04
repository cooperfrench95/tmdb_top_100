<template>
  <v-container>
    <v-btn fixed top right @click="fetchMovies(false);"><v-icon>refresh</v-icon></v-btn>
    <v-btn fixed top left @click="backHome"><v-icon>home</v-icon></v-btn>
    <v-layout row justify-space-around wrap>
      <v-flex xs12 justify-center>
        <h1>Top {{ desiredResults }} Movies</h1>
      </v-flex>
      <v-flex xs12>
        <v-text-field outline label="Search" v-model="searchTerm" @change="setSelectedMovie(undefined);"/>
      </v-flex>
      <v-flex xs12>
        <v-layout v-if="this.selectedMovie === undefined" row wrap>
          <v-flex xs12 sm3>
            <v-checkbox
            v-model="includeLowVotes"
            :label="'Include movies with less than 150 total votes'"
            ></v-checkbox>
          </v-flex>
          <v-flex xs12 sm3>
            <p>Sort by: </p>
            <v-radio-group v-model="sortBy">
              <v-radio 
                v-for="i in radioValues"
                :key="i.id"
                :label="i.name"
                :value="i.value"
              >
              </v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 sm3>
            <p>Display Language </p>
            <v-radio-group v-model="language">
              <v-radio 
                v-for="i in languageRadioValues"
                :key="i.id"
                :label="i.name"
                :value="i.value"
              >
              </v-radio>
            </v-radio-group>
          </v-flex>
          <v-flex xs12 sm3>
            <p>Results </p>
            <v-radio-group v-model="desiredResults">
              <v-radio 
                v-for="i in resultsRadioValues"
                :key="i.id"
                :label="i.name"
                :value="i.value"
              >
              </v-radio>
            </v-radio-group>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <MoviesList :filteredMovies="this.filteredMovies" :noneFound="this.noneFound" v-if="moviesLoading === false && selectedMovie === undefined" />
    <MovieDetails :movie="this.selectedMovie" v-else-if="moviesLoading === false && selectedMovie !== undefined" />
    <v-layout row v-else >
      <v-flex xs12>
        <v-progress-circular class="loading" indeterminate color="green" size="200" width="20"/>
      </v-flex>
    </v-layout>
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
    ...mapActions([
      'fetchMovies', 
      'fetchGenres', 
      'setSelectedMovie', 
      'toggleIncludeLowVotes',
      'setSortBy',
      'setLanguage',
      'setDesiredResults'
    ]),
    backHome () {
      return this.setSelectedMovie(undefined);
    }
  },
  data () {
    return{
      searchTerm: '',
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
      noneFound: false,
      radioValues: {
        1: {
          id: 1,
          name: "Average rating",
          value: "vote_average.desc"
        },
        2: {
          id: 2,
          name: "Total Revenue",
          value: "revenue.desc"
        },
        3: {
          id: 3,
          name: "Popularity",
          value: "popularity.desc"
        }
      },
      languageRadioValues: {
        1: {
          id: 1,
          name: 'English',
          value: 'en-US'
        },
        2: {
          id: 2,
          name: 'Deutsch',
          value: 'de-GE'
        }
      },
      resultsRadioValues: {
        1: {
          id: 1,
          name: '100',
          value: 100
        },
        2: {
          id: 2,
          name: '200',
          value: 200
        },
        3: {
          id: 3,
          name: '500',
          value: 500
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'allMovies', 
      'moviesLoading', 
      'selectedMovie',
    ]),
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
      includeLowVotes: {
        get() {
          return this.$store.getters.includeLowVotes;
        },
        async set () {
          await this.toggleIncludeLowVotes();
          this.fetchMovies(true);
        }
      },
      sortBy: {
        get() {
          return this.$store.getters.sortBy;
        },
        async set (value) {
          await this.setSortBy(value);
          this.fetchMovies(true);
        }
      },
      language: {
        get() {
          return this.$store.getters.language;
        },
        async set (value) {
          await this.setLanguage();
          this.fetchMovies(true);
        }
      },
      desiredResults: {
        get() {
          return this.$store.getters.desiredResults;
        },
        async set (value) {
          await this.setDesiredResults(value);
          this.fetchMovies(true);
        }
      }
  },
  created () {
    this.fetchMovies(true);
    this.fetchGenres();
  }
}
</script>


<style scoped>
h1 {
  text-align: center;
  padding: 50px;
}
.v-btn {
  z-index: 10;
}
.loading {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
 