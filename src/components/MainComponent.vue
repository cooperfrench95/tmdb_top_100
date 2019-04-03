<template>
  <v-container>
    <v-layout v-if="moviesLoading === false" row justify-space-around wrap>
      <v-flex xs12 justify-center>
        <h1>Top 100 Movies</h1>
      </v-flex>
      <v-flex xs12>
        <v-text-field outline label="Search" v-model="searchTerm"/>
      </v-flex>
      <v-flex v-for="(i, index) in filteredMovies" :key="i.id" xs12 sm6 lg4>
        <v-card>
        <v-layout row class="card">
          <v-flex xs6>
            <v-img contain class="card-img" :src="movie_img_baseURL + i.poster_path" />
          </v-flex>
          <v-flex xs6>
            <v-layout fill-height column justify-center>
                <h3>
                  {{ index + 1 }}. {{ i.title }}
                </h3>
                <p>Average rating: {{ i.vote_average }} / 10</p>
                <p>Release Year: {{ i.release_date.slice(0, 4) }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>
      <h1 v-if="noneFound === true" class="noResults">
        Sorry, no results found.
      </h1>
    </v-layout>
    <v-progress-circular class="loading" v-else indeterminate color="green" size="200" width="20"/>
  </v-container>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "Main",
  methods: {
    ...mapActions(['fetchMovies'])
  },
  data () {
    return{
      searchTerm: '',
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
      noneFound: false
    }
  },
  computed: {
    ...mapGetters(['allMovies', 'moviesLoading']),
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
  }
}
</script>


<style scoped>
h3 {
  margin-bottom: 20px;
}
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
.card {
  display: flex;
  flex-direction: row;
  height: 30vh;
}
.card-img {
  min-height: 0;
  height: 30vh;
}
.ellipsis {
  width: 80%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.movieTitle {
  max-width: 80%;
}
.noResults {
  text-align: center;
  color: lightgray;
  font-size: 40pt;
}
</style>
 