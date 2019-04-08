<template>
  <v-container>
    
    <!-- Display the movies in the shortlist -->

    <v-layout row justify-space-around wrap>
      <v-flex v-for="i in this.shortlist" :key="i.id" xs12 sm6 lg4>
        <v-card class="cardStyle">
        <v-layout row justify-center align-center>
          <v-flex xs6>
            <v-img contain class="card-img pointer" :src="movie_img_baseURL + i.poster_path" />
          </v-flex>
          <v-flex xs6>
            <v-layout fill-height column justify-center class="innerColumn">
                <h3 @click="viewMovie(i);">
                  {{ i.title }}
                </h3>
                <p>{{ i.vote_average }} / 10</p>
                <p>{{ i.release_date.slice(0, 4) }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>

      <!-- If there aren't any movies in the shortlist, display this messsage -->

      <h1 v-if="this.shortlist.length < 1" class="noResults">
        You haven't added any movies to your favourites.
      </h1>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

// The Favourites component displays the movies that have been added to the shortlist.

export default {
  name: "Favourites",
  methods: {
    ...mapActions(['setSelectedMovie']),
    // This method sends us to '/details' to get a closer look at each movie.
    viewMovie (movie) {
      this.setSelectedMovie(movie);
      return this.$router.push('/details');
    }
  },
  data () {
    return {
      movie_img_baseURL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/',
    }
  },
  computed: {
    ...mapGetters(['shortlist']),
  },
  mounted () {
    this.$vuetify.goTo(0, {
      duration: 300,
      offset: 0,
      easing: 'easeInOutCubic',
    });
  }
}
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}
h3:hover {
  cursor: pointer;
  text-decoration-line: underline;
}
h1 {
  text-align: center;
  padding: 50px;
}
.cardStyle {
  margin: 20px;
  padding: 5px 20px 5px 20px;
}
.cardStyle:hover {
  background-color: lightgrey;
}
.pointer:hover {
  cursor: pointer;
}
.innerColumn {
  padding: 10px;
}
.card-img {
  min-height: 0;
  height: 30vh;
}
</style>
