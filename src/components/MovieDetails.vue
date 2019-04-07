<template>
  <v-app> 
    <v-content>
      <v-layout v-if="moviesLoading === false" row justify-space-around wrap>
        <v-flex xs12 md8>
          <v-card>
          <v-layout justify-center align-center row wrap>
            <v-flex xs12 sm6>
                <v-img class="card-img" :src="movie_img_baseURL + selectedMovie.poster_path" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-layout column class="innerColumn">
                  <h2>
                    {{ selectedMovie.title }}
                  </h2>
                  <h3>
                    {{ selectedMovie.tagline }}
                  </h3>
                  <div>
                    <span class="genre" 
                      v-for="i in selectedMovie.genres" 
                      :key="i.id"
                      >
                      {{ i.name.toUpperCase() }}
                    </span>
                  </div>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout class="innerColumn">
            <v-flex xs12>
              <div>
                <v-chip>
                  {{ selectedMovie.vote_average }} / 10
                </v-chip>
                <v-chip>Release Date: {{ selectedMovie.release_date }}</v-chip>
                <v-chip>Vote Count: {{ selectedMovie.vote_count }}</v-chip>
                <v-chip>{{ selectedMovie.runtime }} MINUTES</v-chip>
                <v-chip  
                  v-for="language in selectedMovie.spoken_languages" 
                  :key="language.name"
                  >
                  {{ language.name }}
                </v-chip>
                <v-chip 
                  v-for="i in selectedMovie.production_companies" 
                  :key="i.id"
                  >
                  {{ i.name.toUpperCase() }}
                </v-chip>
                <v-chip 
                  v-for="i in selectedMovie.production_countries" 
                  :key="i.name"
                  >
                  {{ i.name.toUpperCase() }}
                </v-chip>
              </div>
              <p class="description">{{ selectedMovie.overview }}</p>
              <v-btn  @click="onClick" >
                <v-icon>favorite</v-icon>
                {{ 
                  shortlist.filter(i => i.id === selectedMovie.id).length === 0 
                  ? 'ADD TO FAVOURITES' 
                  : 'REMOVE FROM FAVOURITES' 
                }}
              </v-btn>
            </v-flex>
          </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row v-else >
        <v-flex xs12>
          <v-progress-circular class="loading" indeterminate color="green" size="200" width="20"/>
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
      // Remove the movie from the shortlist if it's already in it
      if (this.shortlist.filter(i => i.id === this.selectedMovie.id).length > 0) { 
        return this.editShortList(this.shortlist.filter(i => i.id !== this.selectedMovie.id));
      }
      else {
        return this.editShortList([...this.shortlist, this.selectedMovie]);
      }
    }
  },
  computed: {
    ...mapGetters(['selectedMovie', 'shortlist', 'moviesLoading']),
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
  object-fit: cover;
}
.genre {
  padding: 10px;
  border: 1px solid lightgrey;
  font-family: 'Roboto', sans-serif;
}
.loading {
  position: relative;
  margin-top: 50px;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.description {
  padding: 10px;
  line-height: 0.8cm;
}
.noResults {
  text-align: center;
  color: lightgray;
  font-size: 40pt;
}
</style>
