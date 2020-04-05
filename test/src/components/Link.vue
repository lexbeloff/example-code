<template lang="pug">
  button.link(v-html="text", @click="$emit('click')")
</template>

<script>
  export default {
    name: "Link",
    props: {
      text: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="scss">
  .link {
    @include fs(16, normal, 600);
    letter-spacing: 1px;
    color: $orange;
    display: inline-block;

    @include breakpoint(lg) {
      transition: color $ease;

      &:hover {
        color: $orange-fe7;
      }
    }
  }
</style>