/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 20/02/12
 * Time: 14:18
 *
 */

goog.provide("bok.framework.core.BaseCommand");
goog.require("bok.framework.util.frameworkUtil");
goog.require("bok.BOK");
goog.require("org.puremvc.PureMVC");

BOK.inherits(BaseCommand, puremvc.SimpleCommand);


function BaseCommand()
{
	puremvc.SimpleCommand.call(this);
}

/**
 * @param {puremvc.Notification} msg
 * */
BaseCommand.prototype.execute = function(msg)
{
    //override this method to implement command execution
};

/**
 * @public
 * retrieve actor with domain checking
 * */
BaseCommand.prototype.retrieveMediator = function(name)
{
	var domain = this.constructor.domain;
	var fullName = frameworkUtil.getDomainPath(domain, name);
	return puremvc.Facade.getInstance().retrieveMediator(fullName);
};

/**
 * @public
 * retrieve actor with domain checking
 * */
BaseCommand.prototype.retrieveProxy = function(name)
{
	var domain = this.constructor.domain;
	var fullName = frameworkUtil.getDomainPath(domain, name);
	return puremvc.Facade.getInstance().retrieveProxy(fullName);
};

/**@public
 * The original function from observer
 * */
BaseCommand.prototype.sendFullPathNotification = function(name, body, type)
{
	BaseCommand.superClass_.sendNotification.call(this, name, body, type);
};

/**
 * @override
 * */
BaseCommand.prototype.sendNotification = function(name, body, type)
{
	var noteFullName = frameworkUtil.getDomainPath(this.constructor.domain, name);
	BaseCommand.superClass_.sendNotification.call(this, noteFullName, body, type);
};

/**
 * @public send notification on parent domain.
 * This allows sending notification to a different feature which is on the same domain.
 * */
BaseCommand.prototype.sendParentNotification = function (name, body, type)
{
    var noteFullName = frameworkUtil.getDomainPath(frameworkUtil.getParentDomain(this.constructor.domain), name);
    BaseCommand.superClass_.sendNotification.call(this, noteFullName, body, type);
};

/**
 * @public
 * helper function
 * @param {Function} targetDomain
 * @param {string} noteName
 * @return {string}
 * */
BaseCommand.prototype.INcmdPath = function(targetDomain, noteName)
{
	return targetDomain.name + '.' + noteName;
};