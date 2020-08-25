const path = require('path');
const SvgStorePlugin = require('external-svg-sprite-loader');
const productionMode = process.env.NODE_ENV === 'production';

const resolve = (dir) => (
  path.resolve(__dirname, dir)
);

module.exports = {
  publicPath: !process.env.localBuild && productionMode
    ? `/special/${process.env.CI_PROJECT_NAME}/dist/`
    : '/',
  assetsDir: 'assets',
  lintOnSave: !productionMode,
  css: {
    extract:
      productionMode
      ? {
        hmr: process.env.NODE_ENV === 'development',
        filename: 'assets/css/[name]-[contenthash].css',
        chunkFilename: 'assets/css/[id].css',
        }
      : false,
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch');
    config.module.rules.delete('svg');
    const svgRule = config.module.rule('svg');
    config.module.rule('svg')
      .test(/\.svg$/)
      .exclude
      .add(resolve('src/assets/svg-sprites/'));
    svgRule
      .use('babel-loader')
        .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .options({
        svgo: {
          plugins: [
            {removeDoctype: true},
            {removeComments: true},
            {cleanupIDs: false},
            {collapseGroups: false},
            {removeEmptyContainers: false},
            {convertShapeToPath: false}
          ]
        }
      })
      .end();
    config.optimization.splitChunks({
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    });
  },
  configureWebpack: config => {
    config.plugins.push(
      new SvgStorePlugin({
        sprite: {
          startX: 10,
          startY: 10,
          deltaX: 20,
          deltaY: 20,
          iconHeight: 20,
        },
        prefix: '',
        suffix: ''
      }),
    );
    config.module.rules.push(
      {
        loader: SvgStorePlugin.loader,
        test: /\.svg$/,
        include: resolve('src/assets/svg-sprites'),
        options: {
          iconName: '[name]-usage',
          name: 'assets/img/sprite.svg',
        },
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: resolve('utils/split-json-loader.js'),
            options: {
              dir: resolve('src/data'),
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePath: resolve('src'),
              },
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              includePath: resolve('src'),
              resources: './src/scss/_common.scss',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              parser: 'postcss-scss',
              plugins: [
                require('autoprefixer'),
                require('postcss-url'),
                require('css-mqpacker')({
                  sort: true,
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          'pug-plain-loader',
          {
            loader: 'pug-lint-loader',
            options: require('./.pug-lintrc.js'),
          },
        ],
      }
    );
  },
  devServer: {
    open: true,
    before(app) {
      app.post('*', (req, res) => {
        res.send(req.originalUrl);
      });
    },
  }
};
