/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-5-12
 * Time: 下午6:09
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.loader.AbstractLoader");
goog.require('bok.EventDispatcher');
/**
 * @param {Array} assetsList
 * @param {Object} assetsContainer This should be a global container which is used for apps
 *                          to retrieve loaded assets from this preloader.
 */
BOK.inherits(AbstractLoader, EventDispatcher);

/**
 * @param {Array=} assetsList
 * @param {Object=} assetsContainer This should be a global container which is used for apps
 *                          to retrieve loaded assets from this preloader.
 */
function AbstractLoader(assetsList, assetsContainer)
{
    EventDispatcher.call(this);

    this.loadCounter_ = 0;
    this.loadedAssetsFlag_ = [];
    this.loadInterval_ = 100;       //fixed time between two loading, in ms

    assetsList && this.setAssetsToLoad(assetsList, assetsContainer);
}

/**
 * @param {number} interval
 * */
AbstractLoader.prototype.setLoadInterval = function (interval)
{
    this.loadInterval_ = interval;
};

AbstractLoader.prototype.setAssetsToLoad = function (list, container)
{
    this.assetList_ = BOK.cloneObject(list);
    this.assetsContainer_ = container;
};

AbstractLoader.prototype.loadStart = function ()
{
    this.loadCounter_ = 0;
    if(!this.assetList_ || !this.assetList_[this.loadCounter_])
    {
        BOK.warn('Empty asset list provided, loading end.');
        this.loadFinished_();
        return;
    }

    this.loadNext_();
};

/**
 * @private
 * */
AbstractLoader.prototype.loadNext_ = function ()
{
    var loadingAssetName = this.assetList_[this.loadCounter_];

    //if assets with the same name is already loaded, do not reload and throw warning msg
    if(this.loadedAssetsFlag_[loadingAssetName])
    {
        BOK.warn('PreloaderApp.loadImage: Asset ['+loadingAssetName+']' +
            ' is already loaded, please check loading list for name duplication.');
    }

    this.loadAsset_(loadingAssetName);

    this.loadedAssetsFlag_[loadingAssetName] = true;

};

/**
 * @protected
 * */
AbstractLoader.prototype.assetLoaded_ = function (name)
{
    BOK.trace("Asset ["+name+"] loaded.");
    this.loadCounter_++;

    var loadPercentage = this.loadCounter_ / this.assetList_.length * 100;
    this.dispatchEvent(new Event(Event.UPDATE, loadPercentage));

    if( this.loadCounter_ < this.assetList_.length )
    {
        if(this.loadInterval_)
            setTimeout(Delegate.create(this, this.loadNext_), this.loadInterval_) ;
        else
            this.loadNext_();
    }
    else
    {
        this.loadFinished_();
    }
};

/**
 * @protected
 * @param {String} assetName
 * */
AbstractLoader.prototype.loadAsset_ = function (assetName)
{
    throw Error('AssetsLoader.loadAsset_: This is an abstract function which should always be overrided.');
};

/**
 * @protected
 * @param {String} assetName
 * */
AbstractLoader.prototype.storeAsset_ = function (assetName, asset)
{
    this.assetsContainer_[assetName] = asset;
};

/**
 * @private
 * */
AbstractLoader.prototype.loadFinished_ = function ()
{
    this.dispatchEvent(new Event(Event.COMPLETE));
};


