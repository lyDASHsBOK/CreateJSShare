/**
 * @fileoverview
 * This is a interface allow common preloader hook up with external skin
 *
 * @author xliu
 * Date: 24/10/12
 * Time: 12:16
 */

goog.provide("bok.apps.preloader.interfaces.IPreloaderSkin");

/**
 * @constructor
 * */
function IPreloaderSkin()
{
	throw Error('preloader.interface.IPreloaderSkin: Directly instantiating interface is not valid.');
}

/**
 * @param {number} loadingPercentage
 * */
IPreloaderSkin.prototype.update = function(loadingPercentage)
{
throw Error('IPreloaderSkin.prototype.update: Calling unimplemented interface function.');
};

/**
 * */
IPreloaderSkin.prototype.finish = function()
{
throw Error('IPreloaderSkin.prototype.finish: Calling unimplemented interface function.');
};

/**
 * */
IPreloaderSkin.prototype.displayStart = function()
{
	throw Error('IPreloaderSkin.prototype.start: Calling unimplemented interface function.');
};

/**
 * */
IPreloaderSkin.prototype.regSkinReadyCallback = function(callback)
{
	throw Error('IPreloaderSkin.prototype.regSkinReadyCallback: Calling unimplemented interface function.');
};

/**
 * */
IPreloaderSkin.prototype.regSkinFinishCallback = function(callback)
{
	throw Error('IPreloaderSkin.prototype.regSkinReadyCallback: Calling unimplemented interface function.');
};

/**
 * */
IPreloaderSkin.prototype.dismiss = function()
{
	throw Error('IPreloaderSkin.prototype.dismiss: Calling unimplemented interface function.');
};
