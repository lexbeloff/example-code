<template lang="pug">
  footer.footer
    .footer__copyright © 2019 Лайфхакер
</template>
<script>
  export default {
    name: "Footer"
  }
</script>
<style scoped lang="scss">
  $parent: footer;

  @include block($parent) {
    padding: 0 rem(15) rem(15);

    @include breakpoint(t) {
      padding: 0 rem(40) rem(15);
    }

    @include breakpoint(lg) {
      position: absolute;
      left: rem(30);
      bottom: rem(15);
      padding: 0;
    }

    @include only-media(xl, xl) {
      left: rem(50);
      bottom: rem(20);
    }

    @include element($parent, 'copyright') {
      @include fs(12, 1.67);
      color: $blue;

      @include breakpoint(lg) {
        color: $white;
      }
    }
  }
</style>