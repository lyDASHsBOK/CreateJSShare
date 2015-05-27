/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-2-19
 * Time: 下午9:53
 *
 */
goog.provide("bok.framework.App");
goog.require("bok.framework.core.MVCFeature");

BOK.inherits(App, MVCFeature);

/**
 * @param {String=} name The name of app, if differs from constructor.
 * */
function App(name)
{
	MVCFeature.call(this, name);
    this._app_ = this;
}
/**
 * This function is the start point of an APP
 * it should be overrided by specific APP
 * */
App.prototype.start = function()
{
	//setup all MVC actors
	this.setup();

	//do initiation for all features.
	this.initialize();
};

/**
 * This function Might not be used in most cases
 * */
App.prototype.stop = function()
{
	this.uninstall();
};