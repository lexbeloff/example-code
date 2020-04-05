<template lang="pug">
  .pagination
    .pagination__nav {{ current }} / {{ total }}
    .pagination__dots
      .pagination__dot(v-for="dot in total", :class="{'pagination__dot--active' : isActive(dot)}")
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      current: {
        type: Number,
        default: 1
      },
      total: {
        type: Number,
        default: 0,
      }
    },
    methods: {
      isActive(index) {
        return index <= this.current;
      },
    }
  }
</script>

<style scoped lang="scss" src="./Pagination.scss"></style>