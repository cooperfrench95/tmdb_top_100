<template>
  <v-container>
    <v-layout row justify-space-around wrap>
      <v-flex v-for="(i, index) in this.movies" :key="i.id" xs12 sm6 lg4>
        <v-card>
        <v-layout row class="card">
          <v-flex xs6>
            <v-img contain class="card-img" :src="movie_img_baseURL + i.poster_path" />
          </v-flex>
          <v-flex xs6>
            <v-layout fill-height column justify-center class="innerColumn">
                <h3 @click="setSelectedMovie(i);">
                  {{ index + 1 }}. {{ i.title }}
                </h3>
                <p>Average rating: {{ i.vote_average }} / 10</p>
                <p>Release Year: {{ i.release_date.slice(0, 4) }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>
      <h1 v-if="this.noneFound === true" class="noResults">
        Sorry, no results found.
      </h1>
    </v-layout>
  </v-container>
</template>


<script>
import { mapActions } from 'vuex';

// The MoviesList component displays the movies that match the current search.
export default {
  name: "MoviesList",
  methods: {
    ...mapActions(['setSelectedMovie'])
  },
  data () {
    return {
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
    }
  },
  computed: {
    movies: function() {
      return this.$attrs.filteredMovies;
    },
    noneFound: function() {
      return this.$attrs.noneFound;
    }
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
.card {
  display: flex;
  flex-direction: row;
  height: 30vh;
  margin: 20px;
}
.innerColumn {
  padding: 10px;
}
.card-img {
  min-height: 0;
  height: 30vh;
}
.noResults {
  text-align: center;
  color: lightgray;
  font-size: 40pt;
}
</style>
 