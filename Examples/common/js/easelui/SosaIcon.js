/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 10/03/14
 * Time: 14:00
 * To change this template use File | Settings | File Templates.
 */

goog.provide("bok.easelui.SosaIcon");
goog.require("bok.easelui.EsButton");

BOK.inherits(SosaIcon, EsButton);

/**
 * To use this class make sure font 'Sosa' is loaded first
 *
 * For full list of Sosa Icon:
 * @see http://tenbytwenty.com/?xxxx_posts=sosa
 *
 * @param {String} iconCode
 * @param {number=} size is px default is 40px
 * @param {Object=} options same as EsButton Options @see {EsButton}
 * */
function SosaIcon(iconCode, size, options)
{
    this.size = size || 40;

    var fontStr = this.size + 'px Sosa';
    options = options || {};
    options.border = options.border !== undefined ? options.border : 2;   //default border size 2
    options.font = fontStr;
    options.enableShadow = options.enableShadow || false;

    EsButton.call(this, iconCode, options);
}

SosaIcon.ICON = {
    CREDIT_CARD: '\u0108',
    POP: '\u00E2',
    PUSH: '\u00E0',
    IPHONE: '5',
    IPAD: '6',
    MAN: '\u00DC',
    MAN2: '\u00E1',
    MAN3: '\u00DD',
    GAME: '>',
    CROSS: '~'
};
