class LoadAsset {
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
      return `${this.assets[asset].symbol}`;
    }
    return this.assets[asset];
  }
}

const assets = new LoadAsset();
export default (asset, svg = false) => assets.load(asset, svg);
