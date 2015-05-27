/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 22/02/12
 * Time: 10:48
 *
 */
goog.provide("bok.framework.core.BaseProxy");
goog.require("bok.framework.util.frameworkUtil");
goog.require("bok.BOK");
goog.require("org.puremvc.PureMVC");


BOK.inherits(BaseProxy, puremvc.Proxy);


/**
 * @param {string=} name (optional)
 * */
function BaseProxy(name)
{
	puremvc.Proxy.call(this);

	this.proxyName = name ? name : this.constructor.name;

    /** @type {App} */
    this._app_ = null;              //the reference of app object that this feature and its actors belongs to.
}


/**@public
 * Register domain for this actor.
 * Any actor cannot access to other actor from different domain.
 * */
BaseProxy.prototype.domainUpdated = function()
{
	this.proxyName = frameworkUtil.getActorDomain(this.constructor, this.proxyName);
};

/**@public
 * The original function from observer
 * */
BaseProxy.prototype.sendFullPathNotification = function(name, body, type)
{
	BaseProxy.superClass_.sendNotification.call(this, name, body, type);
};

/**
 * @override
 * */
BaseProxy.prototype.sendNotification = function(name, body, type)
{
	var noteFullName = frameworkUtil.getDomainPath(this.constructor.domain, name);
	BaseProxy.superClass_.sendNotification.call(this, noteFullName, body, type);
};

/**
 * @public send notification on parent domain.
 * This allows sending notification to a different feature which is on the same domain.
 * */
BaseProxy.prototype.sendParentNotification = function (name, body, type)
{
    var noteFullName = frameworkUtil.getDomainPath(frameworkUtil.getParentDomain(this.constructor.domain), name);
    BaseProxy.superClass_.sendNotification.call(this, noteFullName, body, type);
};


