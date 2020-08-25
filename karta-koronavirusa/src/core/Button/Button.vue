<template lang="pug">
  button.button(v-html="text", @click="$emit('click')")
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      required: true,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss" src="./Button.scss"></style>
