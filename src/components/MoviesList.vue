<template>
  <v-container>

    <!-- Show the movies if they're loaded -->

    <v-layout v-if="moviesLoading === false" row justify-space-around wrap>
      <v-flex v-for="(i, index) in this.movies" :key="i.id" xs12 sm6 lg4>
        <v-card class="cardStyle">
        <v-layout row justify-center align-center>
          <v-flex xs6>
            <v-img @click="viewMovie(i);" contain class="card-img pointer" :src="movie_img_baseURL + i.poster_path" />
          </v-flex>
          <v-flex xs6>
            <v-layout fill-height column justify-center class="innerColumn">
                <h3 @click="viewMovie(i);">
                  {{ index + 1 }}. {{ i.title }}
                </h3>
                <p>{{ i.vote_average }} / 10</p>
                <p>{{ i.release_date.slice(0, 4) }}</p>
            </v-layout>
          </v-flex>
        </v-layout>
        </v-card>
      </v-flex>

      <!-- If there are no search results -->

      <h1 v-if="this.noneFound === true" class="noResults">
        Sorry, no results found.
      </h1>
    </v-layout>

    <!-- Loading spinner -->

    <v-layout row v-if="moviesLoading === true" >
      <v-flex xs12>
        <v-progress-circular class="loading" indeterminate color="green" size="200" width="20"/>
      </v-flex>
    </v-layout>


    <!-- Error --> 

    <v-layout row v-if="error === true">
      <v-flex xs12>
        <h1 class="noResults">
          An error occurred.
        </h1>
      </v-flex>
    </v-layout>


  </v-container>
</template>


<script>
import { mapActions, mapGetters } from 'vuex';

// The MoviesList component displays the movies that match the current search.

export default {
  name: "MoviesList",
  methods: {
    ...mapActions(['setSelectedMovie']),
    // Selects a movie in VueX and sends us to the '/details' route.
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
    ...mapGetters(['moviesLoading', 'error']),
    // Passed from 'Main' into <router-view> as props.
    movies: function() {
      return this.$attrs.filteredMovies;
    },
    // Passed from 'Main' into <router-view> as props.
    noneFound: function() {
      return this.$attrs.noneFound;
    }
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
  overflow: hidden;
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
.loading {
  position: relative;
  margin-top: 50px;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
 