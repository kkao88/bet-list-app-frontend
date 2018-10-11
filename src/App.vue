<template>
  <div class="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import MainComponent from './components/Main.vue'

  export default {
    components: { MainComponent }
  }
</script>

<style lang="scss">
  @import "~vue-material/dist/theme/engine"; // Import the theme engine

  @include md-register-theme("default", (
          primary: md-get-palette-color(blue, A200), // The primary color of your application
          accent: md-get-palette-color(deeppurple, A200) // The accent or secondary color
  ));

  @import "~vue-material/dist/theme/all"; // Apply the theme
</style>