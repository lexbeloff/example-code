module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      targets: {
        browsers: ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
  ],
  plugins: ['transform-vue-jsx', '@babel/transform-runtime']
};
