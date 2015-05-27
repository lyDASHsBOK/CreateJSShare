/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-2-19
 * Time: 下午10:46
 *
 */
goog.provide("bok.apps.preloader.PreloaderApp");

goog.require("bok.apps.preloader.AbstractPreloaderApp");
goog.require("bok.apps.preloader.components.DefaultPreloaderSkin");
goog.require("bok.framework.App");

BOK.inherits(PreloaderApp, AbstractPreloaderApp);


/**
 * When preloading is complete a 'COMPLETE' event will be dispatched.
 *
 * @param {Array} assetsList
 * @param {Object} assetsContainer This should be a global container which is used for apps
 *                          to retrieve loaded assets from this preloader.
 * @param {Element} preloaderStage
 * @param {Object} [preloaderSkin] Should be implementing interface {IPreloaderSkin}
 * */
function PreloaderApp(assetsList, assetsContainer, preloaderStage, preloaderSkin)
{
    var skin = preloaderSkin || new DefaultPreloaderSkin();
    preloaderStage.appendChild(skin.view);

    AbstractPreloaderApp.call(this, assetsList, assetsContainer, skin);
}
