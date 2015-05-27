goog.provide("bok.apps.preloader.loader.AssetsLoader");
goog.require('bok.apps.preloader.loader.AbstractLoader');
/**
 * @param {Array} assetsList
 * @param {Object} assetsContainer This should be a global container which is used for apps
 *                          to retrieve loaded assets from this preloader.
 */
BOK.inherits(AssetsLoader, AbstractLoader);

function AssetsLoader(assetsList, assetsContainer)
{
    AbstractLoader.call(this, assetsList, assetsContainer);
}

/**
 * @override
 * @protected
 * @param {String} assetName
 * */
AssetsLoader.prototype.loadAsset_ = function (assetName)
{
    var image = new Image();
    image.src = assetName;
    image.onload = image.onerror = Delegate.create(this, this.assetLoaded_, assetName);

    this.storeAsset_(assetName, image);
};
