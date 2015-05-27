/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 11/03/14
 * Time: 16:40
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.AbstractPreloaderApp");

goog.require("bok.framework.App");
goog.requireAll("bok.apps.preloader.loader.*");

BOK.inherits(AbstractPreloaderApp, App);

function AbstractPreloaderApp(assetsList, assetsContainer, preloaderSkin)
{
    App.call(this);

    //The skin must be valid
    /** @type {IPreloaderSkin}*/
    this.skin_ = preloaderSkin;
    this.fontLoader_ = null;
    this.fontLoader_ = new FontLoader();
    this.imgLoader_ = new AssetsLoader(assetsList, assetsContainer);
    this.imgLoader_.addEventListener(Event.UPDATE, Delegate.create(this, this.onImgLoadUpdated_));
    this.imgLoader_.addEventListener(Event.COMPLETE, Delegate.create(this, this.onImgLoadComplete_));
    this.tplLoader_ = new TemplateLoader();
    this.tplLoader_.addEventListener(Event.UPDATE, Delegate.create(this, this.onTplLoadUpdated_));
    this.tplLoader_.addEventListener(Event.COMPLETE, Delegate.create(this, this.onTplLoadComplete_));


    this.skin_.regSkinReadyCallback(Delegate.create(this, this.loadStart_));
    this.skin_.regSkinFinishCallback(Delegate.create(this, this.loadFinished_));
}

/**
 * */
AbstractPreloaderApp.prototype.onTplLoadComplete_ = function()
{
    this.skin_.finish();
};
/**
 * */
AbstractPreloaderApp.prototype.onTplLoadUpdated_ = function(e)
{
    var percent = e.body;

    this.skin_.update(80 + percent * 0.199);
};
/**
 * */
AbstractPreloaderApp.prototype.onImgLoadComplete_ = function()
{
    this.tplLoader_.loadStart();
};
/**
 * */
AbstractPreloaderApp.prototype.onImgLoadUpdated_ = function(e)
{
    var percent = e.body;

    this.skin_.update(percent * 0.8);
};

/**
 * */
AbstractPreloaderApp.prototype.loadStart_ = function()
{
    this.fontLoader_.loadStart();
    this.imgLoader_.loadStart();
};

/**
 * */
AbstractPreloaderApp.prototype.loadFinished_ = function()
{
    this.skin_.dismiss();

    this.fontLoader_ && this.fontLoader_.cleanUp();
    this.dispatchEvent(new Event(Event.COMPLETE));
};

/**
 * @param {Array} fonts All fonts name to load in an array.
 * */
AbstractPreloaderApp.prototype.preloadFonts = function(fonts)
{
    this.fontLoader_.setFontsToLoad(fonts);
};

/**
 * @param {Array} fonts All fonts name to load in an array.
 * */
AbstractPreloaderApp.prototype.preloadTemplates = function(list, container)
{
    this.tplLoader_.setAssetsToLoad(list, container);
};


/**
 * @override
 * */
AbstractPreloaderApp.prototype.start = function()
{
    AbstractPreloaderApp.superClass_.start.call(this);

    this.skin_.displayStart();
};
