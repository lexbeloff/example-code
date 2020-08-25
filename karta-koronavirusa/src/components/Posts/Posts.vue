<template lang="pug">
  .posts
    .posts__item(v-for="(post, id) in info", :key="`post-${id}`")
      a.posts__link(:href="post.url", target="_blank", rel="noopener")
        img.posts__img(v-lazy="$utils.loadAsset(post.img)", alt="")
        .posts__title(v-html="post.title")
</template>

<script>
export default {
  name: 'Posts',
  props: {
    info: {
      type: Array,
      required: true,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss" src="./Posts.scss"></style>
