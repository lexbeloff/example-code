<template lang="pug">
  button.button(@click="$emit('click')", v-html="info.text")
</template>

<script>
  export default {
    name: "Button",
    props: ['info']
  }
</script>

<style scoped lang="scss">
  .button {
    @include fs(18);
    height: rem(42);
    border-radius: 4px;
    background-color: $orange;
    color: $white;
    transition: background-color $ease;
    font-family: $montseratt;
    letter-spacing: 1.06px;
    text-transform: uppercase;

    @include breakpoint(lg) {
      height: rem(49);
      letter-spacing: 1px;

      &:hover {
        background-color: rgba($orange, 0.6);
      }
    }
  }
</style>