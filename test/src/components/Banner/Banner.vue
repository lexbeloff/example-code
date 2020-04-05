<template lang="pug">
  .banner
    .banner__img(:style="imageStyles")
    slot
</template>

<script>
  export default {
    name: "Banner",
    props: {
      image: {
        type: String,
        default: '',
        required: true,
      }
    },
    computed: {
      imageStyles() {
        return {
          backgroundImage: `url(${this.$utils.loadAsset(this.image)})`,
        }
      },
    }
  }
</script>

<style scoped lang="scss" src="./Banner.scss"></style>