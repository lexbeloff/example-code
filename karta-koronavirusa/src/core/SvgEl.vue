<template lang="pug">
  svg
    use(:xlink:href="$utils.loadAsset(name, true)")
</template>

<script>
export default {
  name: 'SvgEl',
  props: {
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
};
</script>
