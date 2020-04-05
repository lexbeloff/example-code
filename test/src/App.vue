<template lang="pug">
  include ./pug/mixins.pug
  div(id="app")
    router-view
</template>

<script>
  export default {
    name: 'App',
  };
</script>

<style lang="scss">
@import './scss/vendor';
@import './scss/mixins/bem';
@import './scss/mixins/breakpoint';
@import './scss/fonts';
@import './scss/variables';
@import './scss/mixins/misc';
@import './scss/base';
@import './scss/transitions';
@import './pug/mixins/content/content';
@import './pug/mixins/content/inner/content-inner';

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  font-family: $roboto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: $black;
}
</style>
