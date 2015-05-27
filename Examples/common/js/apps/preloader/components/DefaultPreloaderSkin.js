/**
 * @fileoverview
 * //TODO: write file description here
 *
 * @author xliu
 * Date: 24/10/12
 * Time: 12:18
 */
goog.provide("bok.apps.preloader.components.DefaultPreloaderSkin");
goog.require("bok.apps.preloader.interfaces.IPreloaderSkin");
goog.require("bok.Delegate");


BOK.implement(DefaultPreloaderSkin, IPreloaderSkin);

function DefaultPreloaderSkin()
{

	this.view = document.createElement('div');

	this.skinReadyCallback = null;
	this.displayFinishCallback = null;
}

/**
 * @override
 * @param {number} loadingPercentage 0 - 100
 * */
DefaultPreloaderSkin.prototype.update = function(loadingPercentage)
{
    if(loadingPercentage > 100)
        loadingPercentage = 100;

	this.view.innerHTML = 'Loading...\n'+Math.floor(loadingPercentage) + '%';
};

/**
 * @override
 * */
DefaultPreloaderSkin.prototype.finish = function()
{
    this.update(100);
    this.view.innerHTML += ' [Finished]';
    setTimeout(Delegate.create(this, this.skinDisplayFinish), 300);
};

/**
 * */
DefaultPreloaderSkin.prototype.displayStart = function()
{
	this.view.style.display = 'block';
	this.view.style.color = 'black';

	//there is no preparation in default skin so send ready straight away
	//when skin starts to display
	this.skinReadyCallback();
};

/**
 * */
DefaultPreloaderSkin.prototype.dismiss = function()
{
    this.view.style.display = 'none';
};

/**
 * */
DefaultPreloaderSkin.prototype.regSkinReadyCallback = function(callback)
{
	this.skinReadyCallback = callback;
};

/**
 * */
DefaultPreloaderSkin.prototype.regSkinFinishCallback = function(callback)
{
	this.displayFinishCallback = callback;
};

/**
 * @private
 * */
DefaultPreloaderSkin.prototype.skinDisplayFinish = function()
{
	this.displayFinishCallback();
};

