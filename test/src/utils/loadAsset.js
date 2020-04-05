class loadAsset {
  constructor() {
    this.assets = {};
  }

  load(asset, isSvg) {
    if (!this.assets[asset]) {
      let loadedAsset = null;
      try {
        if (isSvg) {
          loadedAsset = require(`../assets/svg-sprites/${asset}.svg`);
        } else {
          loadedAsset = require(`../assets/images/${asset}`);
        }
        this.assets[asset] = loadedAsset;
      } catch (e) {
        throw new Error(e);
      }
    }
    if (isSvg) {
      return `#${this.assets[asset].default.id}`;
    }
    return this.assets[asset];
  }
}

const assets = new loadAsset();
export default (asset, svg = false) => {
  return assets.load(asset, svg);
}
