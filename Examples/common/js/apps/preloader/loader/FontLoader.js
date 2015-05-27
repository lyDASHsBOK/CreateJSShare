/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 11/03/14
 * Time: 17:07
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.loader.FontLoader");

function FontLoader()
{
    this.fontsToLoad_ = null;
}

/**
 * @param {Array} fonts All fonts name to load in an array.
 * */
FontLoader.prototype.setFontsToLoad = function(fonts)
{
    this.fontsToLoad_ = fonts;
};

FontLoader.prototype.cleanUp = function()
{
    BOK.each(this.fontDivs_, function(div){
        document.body.removeChild(div);
    });
};

FontLoader.prototype.loadStart = function()
{
    this.fontDivs_ = {};
    if(this.fontsToLoad_)
    {
        BOK.each(this.fontsToLoad_, function(fontName){
            var div = document.createElement('div');
            div.innerHTML = 'a';
            div.style.fontFamily = fontName;
            div.style.visibility = 'hidden';
            div.style.position = 'absolute';
            document.body.appendChild(div);
            this.fontDivs_[fontName] = div;
        }, this);
    }
};
