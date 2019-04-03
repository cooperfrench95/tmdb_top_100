<template>
  <v-layout row justify-space-around wrap>
    <v-flex xs12>
      <v-card>
      <v-layout row class="card">
        <v-flex xs6>
          <v-img contain class="card-img" :src="movie_img_baseURL + selectedMovie.poster_path" />
        </v-flex>
        <v-flex xs6>
          <v-layout fill-height column justify-center class="innerColumn">
              <h3>
                {{ selectedMovie.title }}
              </h3>
              <p>Average rating: {{ selectedMovie.vote_average }} / 10</p>
              <p>Release Date: {{ selectedMovie.release_date }}</p>
              <p>Vote Count: {{ selectedMovie.vote_count }}</p>
              <p>{{ selectedMovie.overview }}</p>
              <div v-for="i in selectedMovie.genre_ids" :key="i">
                <p>
                  {{
                  // Find the corresponding genre name in the list provided by the API and return that 
                  genres.map((genre) => {
                    if (genre.id === i) {
                      return genre.name
                    }
                  })[0] 
                  }}
                </p>
              </div>
          </v-layout>
        </v-flex>
      </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'MovieDetails',
  computed: {
    ...mapGetters(['selectedMovie', 'genres'])
  },
  data () {
    return {
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
    }
  },
}
</script>

<style>
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
</style>
