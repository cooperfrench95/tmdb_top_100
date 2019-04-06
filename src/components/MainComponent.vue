<template>
  <v-container>
    <v-btn fixed top right @click="fetchMovies(false);"><v-icon>refresh</v-icon></v-btn>
    <v-btn fixed top left @click="navigate('/');"><v-icon>home</v-icon></v-btn>
    <v-btn fixed top class="favouriteButton" @click="navigate('/favourites')"><v-icon>favorite</v-icon></v-btn>
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
    navigate (to) {
      return this.$router.push(to);
    }
  },
  data () {
    return{
      searchTerm: '',
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
      noneFound: false,
      viewFavourites: false,
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
.addPadding {
  padding: 20px;
}
.favouriteButton {
  left: 50%;
  transform:translate(-50%);
}
</style>
 