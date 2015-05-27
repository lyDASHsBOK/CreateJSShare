/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-5-6
 * Time: 下午4:35
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.loader.TemplateLoader");
goog.require('bok.apps.preloader.loader.AbstractLoader');

BOK.inherits(TemplateLoader, AbstractLoader);
function TemplateLoader(assetsList, assetsContainer)
{
    AbstractLoader.call(this, assetsList, assetsContainer);
}

/**
 * @override
 * @protected
 * @param {String} assetName
 * */
TemplateLoader.prototype.loadAsset_ = function (assetName)
{
    var self = this;
    $.get(assetName, function(data){
        self.storeAsset_(assetName, data);
        self.assetLoaded_(assetName);
    });
};
