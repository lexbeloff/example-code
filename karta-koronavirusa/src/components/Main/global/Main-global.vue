<template lang="pug">
  .main-global
    .main-global__row
      .main-global__title Заболели
      .main-global__count.main-global__count--confirmed(v-html="info.confirmed")
    .main-global__row
      .main-global__title Вылечились
      .main-global__count.main-global__count--recovered(v-html="info.recovered")
    .main-global__row
      .main-global__title Умерли
      .main-global__count(v-html="info.deaths")
</template>

<script>
export default {
  name: 'Main-global',
  props: {
    info: {
      type: Object,
      required: true,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss" src="./Main-global.scss"></style>
