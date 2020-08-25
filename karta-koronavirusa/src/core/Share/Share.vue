<template lang="pug">
  .share(:class="getTheme")
    social-sharing(
      :url="url",
      :title="title",
      :description="description",
      :twitterUser="twitterUser",
      :networkTag="networkTag",
      @open="shareDataLayer",
      inline-template)
      .share__icons
        network.share__social.share__social--tw(network="twitter")
          svg
            use(:xlink:href="$utils.loadAsset('tw', true)")
        network.share__social.share__social--vk(network="vk")
          svg
            use(:xlink:href="$utils.loadAsset('vk', true)")
        network.share__social.share__social--fb(network="facebook")
          svg
            use(:xlink:href="$utils.loadAsset('fb', true)")
</template>

<script src="./Share.js"></script>

<style lang="scss" src="./Share.scss"></style>
