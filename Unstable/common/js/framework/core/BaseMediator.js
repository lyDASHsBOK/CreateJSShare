/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 20/02/12
 * Time: 13:58
 *
 */
goog.provide("bok.framework.core.BaseMediator");
goog.require("bok.framework.util.frameworkUtil");
goog.require("bok.BOK");
goog.require("org.puremvc.PureMVC");


BOK.inherits(BaseMediator, puremvc.Mediator);


/**
 * @param {string=} name (optional)
 * */
function BaseMediator(name)
{
	puremvc.Mediator.call(this);
	this.mediatorName = name ? name : this.constructor.name;

    /** @type {App} */
    this._app_ = null;              //the reference of app object that this feature and its actors belongs to.
    //An array of Object with format of {'name':noteName, 'scope':Boolean}
    //The not names are clean name without domain path
	this.interestedNotes = [];
    //an array of note names with domain path, should match the content of this.interestedNotes
	this.interestedNotesFullPath = [];
	this.noteHandlers = {};

	this.declareInterestedNotifications();
}

BaseMediator.SCOPE = {
    DEFAULT: 'default',         //local feature domain
    PARENT: 'parent',           //parent domain
    GLOBAL: 'global'            //Gloabl (App) domain
};

/**@public
 * Register domain for this actor.
 * Any actor cannot access to other actor from different domain.
 * */
BaseMediator.prototype.domainUpdated = function()
{
	this.mediatorName = frameworkUtil.getActorDomain(this.constructor, this.mediatorName);

	//update interested Notes
	var THIS = this;
	var parentDomain = this.constructor.domain;
	BOK.each(this.interestedNotes, function(item, index){
        var noteName = '';
        switch(item['scope'])
        {
            case BaseMediator.SCOPE.DEFAULT:
                noteName = frameworkUtil.getDomainPath(parentDomain, item['name']);
                break;
            case BaseMediator.SCOPE.GLOBAL:
                noteName = item['name'];
                break;
            case BaseMediator.SCOPE.PARENT:
                noteName = frameworkUtil.getDomainPath(frameworkUtil.getParentDomain(parentDomain), item['name']);
                break;
        }
        THIS.interestedNotesFullPath[index] = noteName
	});
};

//////////////////////////////////////////////////////////////////////////////////
//Protected functions
/**
 * @param {String} note
 * interested notification
 * @param {function} func
 * call back function of this mediator class only
 * @param {string=} scope (Optional) The path scope the declared note. see {BaseMediator.SCOPE}
 * Normally this will be used for external feature subscriber mediators.
* */
BaseMediator.prototype.declareInterest = function(note, func, scope)
{
	if(!this.noteHandlers[note])
	{
		this.interestedNotes.push({'name':note, 'scope':scope || BaseMediator.SCOPE.DEFAULT});
		this.noteHandlers[note] = func;
	}
};

/**
 * This is a empty base function and should be overrided by mediators
 * */
BaseMediator.prototype.declareInterestedNotifications = function()
{
	//declare interest here
};


/**@public
 * The original function from observer
 * */
BaseMediator.prototype.sendFullPathNotification = function(name, body, type)
{
	BaseMediator.superClass_.sendNotification.call(this, name, body, type);
};

/**
 * @override
 * */
BaseMediator.prototype.sendNotification = function(name, body, type)
{
	var noteFullName = frameworkUtil.getDomainPath(this.constructor.domain, name);
	BaseMediator.superClass_.sendNotification.call(this, noteFullName, body, type);
};

/**
 * @public send notification on parent domain.
 * This allows sending notification to a different feature which is on the same domain.
 * */
BaseMediator.prototype.sendParentNotification = function (name, body, type)
{
    var noteFullName = frameworkUtil.getDomainPath(frameworkUtil.getParentDomain(this.constructor.domain), name);
    BaseMediator.superClass_.sendNotification.call(this, noteFullName, body, type);
};

/**
 * @override
 * */
BaseMediator.prototype.listNotificationInterests= function ()
{
	return this.interestedNotesFullPath;
};

/**
 * @override
 * */
BaseMediator.prototype.handleNotification= function (notification)
{
	var noteName = this.getOriginalNote_(notification.name);
	if(this.noteHandlers[noteName])
		this.noteHandlers[noteName].call(this, notification);
	else
		BOK.error("Error in BaseMediator.prototype.handleNotification, notification["+notification.name+"] not been handled");
};

/**
 * @private
 *
 * @return {string}
 * */
BaseMediator.prototype.getOriginalNote_= function (notificationName)
{
	var foundNote = null;
	BOK.each(this.interestedNotesFullPath, function(item, index){
		if(notificationName == item)
			foundNote = this.interestedNotes[index]['name'];
	}, this);

	return foundNote;
};

