/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 06/03/14
 * Time: 15:32
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.CanvasPreloaderApp");

goog.require("bok.apps.preloader.AbstractPreloaderApp");
goog.require("bok.apps.preloader.components.DefaultCanvasSkin");
goog.require("bok.framework.App");

BOK.inherits(CanvasPreloaderApp, AbstractPreloaderApp);


/**
 * When preloading is complete a 'COMPLETE' event will be dispatched.
 *
 * @param {Array} assetsList
 * @param {Object} assetsContainer This should be a global container which is used for apps
 *                          to retrieve loaded assets from this preloader.
 * @param {createjs.Container} rootStage
 * @param {IPreloaderSkin=} preloaderSkin
 * */
function CanvasPreloaderApp(assetsList, assetsContainer, rootStage, preloaderSkin)
{
    var skin = preloaderSkin || new DefaultCanvasSkin();
    rootStage.addChild(skin);

    AbstractPreloaderApp.call(this, assetsList, assetsContainer, skin);
}
