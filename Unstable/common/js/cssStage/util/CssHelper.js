/**
 * @author lys.BOK
 * Date: 14-2-21
 * Time: 上午12:31
 *
 * File over view.
 */
goog.provide("bok.cssstage.util.CssHelper");

var CssHelper = {};

/**
 * @param {CssDisplayObject} obj
 * @param {String} fontName
 * @param {String=} size
 * */
CssHelper.useFont = function(obj, fontName, size)
{
    if(!obj)
        return;

    obj.div.style.fontFamily = fontName;

    if(size)
        obj.div.style.fontSize = size;
};