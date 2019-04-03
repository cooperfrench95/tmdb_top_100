<template>
  <v-app> 
    <v-content>
      <Main />
    </v-content>
  </v-app>
</template>

<script>
import Main from './components/MainComponent.vue';

export default {
  name: 'App',
  components: {
    Main,
  },
  data() {
    return {
      //
    };
  },
};
</script>
