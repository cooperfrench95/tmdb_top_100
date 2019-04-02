<template>
  <div>
    <div v-for="i in allMovies" :key=i.id>
      <p>{{ i.title }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "Main",
  methods: {
    ...mapActions(['fetchMovies'])
  },
  computed: mapGetters(['allMovies']),
  created () {
    this.fetchMovies();
  }
}
</script>

<style>

</style>
