<template>
  <v-container>

    <!-- BUTTONS -->

    <v-btn fixed top right @click="fetchMovies(false);">
      <v-icon>refresh</v-icon>
    </v-btn>
    <v-btn fixed top left :class="homeButtonActive" @click="navigate('/');">
      <v-icon>home</v-icon>
    </v-btn>
    <v-btn fixed top :class="favouritesButtonActive" @click="navigate('/favourites')">
      <v-icon>favorite</v-icon>
    </v-btn>
    <v-btn fixed bottom right icon @click="scrollToTop();">
      <v-icon>arrow_upward</v-icon>
    </v-btn>

    <!-- LAYOUT -->

    <v-layout row justify-space-around wrap>
      <v-flex xs12 justify-center>
        <h1>Top {{ desiredResults }} Movies</h1>
      </v-flex>
      <v-flex xs12>
        <v-text-field outline label="Search" v-model="searchTerm" @change="navigate('/')"/>
      </v-flex>
      <v-flex xs12>
        <v-expansion-panel v-if="this.$route.path !== '/details'">
          <v-expansion-panel-content>
            <template v-slot:header>
              <div>Search options</div>
            </template>
            <v-layout row wrap>
              <v-flex xs12 sm3>
                <v-checkbox
                v-model="includeLowVotes"
                :label="'Include movies with less than 150 total votes'"
                class="addPadding"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 sm3>
                <v-radio-group v-model="sortBy" class="addPadding" label="Sort By: ">
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
                <v-radio-group v-model="language" class="addPadding" label="Display Language">
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
                <v-radio-group v-model="desiredResults" class="addPadding" label="Results">
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>

    <!-- CHILD VIEWS (MovieDetails, Favourites, MoviesList) RENDERED HERE -->

    <router-view :filteredMovies="this.filteredMovies" :noneFound="this.noneFound"></router-view>
  </v-container>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

// The main component consists of the top layout as well as the searching logic.

export default {
  name: "Main",
  methods: {
    ...mapActions([
      'fetchMovies', 
      'fetchGenres', 
      'toggleIncludeLowVotes',
      'setSortBy',
      'setLanguage',
      'setDesiredResults'
    ]),
    // Navigate to a different route e.g. /details
    navigate (to) {
      return this.$router.push(to);
    },
    // Animated scroll to top
    scrollToTop () {
      return this.$vuetify.goTo(0, {
                duration: 300,
                offset: 0,
                easing: 'easeInOutCubic',
              });
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
      'shortlist',
    ]),
    // This performs the search as the user types in the search bar.
    // Search results are then passed as props to MovieDetails to be displayed.
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
          await this.setLanguage(value);
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
      },
      // Make the home button green when we're at '/' route
      homeButtonActive () {
        if (this.$route.path === '/') {
          return 'activeButton'
        }
        else {
          return ''
        }
      },
      // Make the favourites button green when we're at '/favourites' route
      favouritesButtonActive () {
        if (this.$route.path === '/favourites') {
          return 'activeButton favouriteButton'
        }
        else {
          return 'favouriteButton'
        }
      }
  },
  // Initial API calls
  created () {
    this.fetchMovies(true);
    // If the second API call to get more details about a movie is not made when we select a movie,
    // then all we have for each movie's genres are arbitrary id numbers, because that's what the
    // /discover API returns.
    // I'm leaving this method here because it could be useful to, for example, sort a search by 
    // genre. But right now, it can be removed from the application and no functionality will be broken
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
.addPadding {
  padding: 20px;
}
.favouriteButton {
  left: 50%;
  transform:translate(-50%);
}
.activeButton {
  color: green;
}
</style>
 