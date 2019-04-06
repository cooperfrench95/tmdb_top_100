<template>
  <v-container>
    <v-layout row justify-space-around wrap>
      <v-flex v-for="i in this.shortlist" :key="i.id" xs12 sm6 lg4>
        <v-card class="cardStyle">
        <v-layout row justify-center align-center>
          <v-flex xs6>
            <v-img contain class="card-img pointer" :src="movie_img_baseURL + i.poster_path" />
          </v-flex>
          <v-flex xs6>
            <v-layout fill-height column justify-center class="innerColumn">
                <h3 @click="setSelectedMovie(i);">
                  {{ i.title }}
                </h3>
                <p>{{ i.vote_average }} / 10</p>
                <p>{{ i.release_date.slice(0, 4) }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

// The Favourites component displays the movies that have been added to the shortlist.
export default {
  name: "Favourites",
  methods: {
    ...mapActions(['setSelectedMovie'])
  },
  data () {
    return {
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
    }
  },
  computed: {
    ...mapGetters(['shortlist']),
  }
}
</script>

<style>

</style>
