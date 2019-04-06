<template>
  <v-app> 
    <v-content>
      <v-layout row justify-space-around wrap>
        <v-flex xs12 md8>
          <v-card>
          <v-layout justify-center align-center row wrap>
            <v-flex xs12 sm6>
                <v-img contain class="card-img" :src="movie_img_baseURL + selectedMovie.poster_path" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-layout fill-height column align-center justify-content-center class="innerColumn">
                  <h3>
                    {{ selectedMovie.title }}
                  </h3>
                  <p>Average rating: {{ selectedMovie.vote_average }} / 10</p>
                  <p>Release Date: {{ selectedMovie.release_date }}</p>
                  <p>Vote Count: {{ selectedMovie.vote_count }}</p>
                  <p>{{ selectedMovie.overview }}</p>
                  <p>Genres: </p>
                  <span v-for="i in selectedMovieGenres" :key="i.id">{{ i.name }}</span>
                  <v-btn class @click="onClick" icon><v-icon>favorite</v-icon></v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'MovieDetails',
  methods: {
    ...mapActions(['editShortList']),
    onClick () {
      // Don't add the movie to the shortlist if it's already in it
      if (this.shortlist.filter(i => i.id === this.selectedMovie.id).length > 0) { 
        return this.editShortList(this.shortlist.filter(i => i.id !== selectedMovie.id));
      }
      else {
        return this.editShortList([...this.shortlist, this.selectedMovie]);
      }
    }
  },
  computed: {
    ...mapGetters(['selectedMovie', 'genres', 'shortlist']),
    selectedMovieGenres: function() {
      return (
        this.genres.filter((item) => {
          if (this.selectedMovie.genre_ids.includes(item.id)) {
            return true
          }
          else {
            return false
          }
        })
      );
    },
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
.cardStyles {
  display: flex;
  flex-direction: row;
  margin: 20px;
}
.innerColumn {
  padding: 10px;
  justify-content: center;
}
.card-img {
  min-height: 0;
}
</style>
