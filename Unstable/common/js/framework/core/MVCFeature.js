/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 18/01/12
 * Time: 16:48
 *
 */
goog.provide("bok.framework.core.MVCFeature");
goog.require("bok.framework.core.BaseCommand");
goog.require("bok.framework.core.BaseMediator");
goog.require("bok.framework.core.BaseProxy");
goog.require("bok.framework.util.frameworkUtil");
goog.require("bok.BOK");
goog.require('bok.EventDispatcher');

BOK.inherits(MVCFeature, EventDispatcher);

/**
 * @param {string=} name (optional)
 * */
function MVCFeature(name)
{
	EventDispatcher.call(this);

    this.name =  name || this.constructor.name;     //feature name fall back to constructor name if not provided.
    this.constructor.featureName = this.name;
    /** @type {App} */
    this._app_ = null;              //the reference of app object that this feature and its actors belongs to.
	this.mediators = [];            //mediator objects
	this.proxies = [];              //proxy objects
	this.commandDefs = [];          //structure: {note:noteName, cmd:commandObejct}
	this.subFeatures = [];          //feature objects
}

MVCFeature.notes = {
	input:{},
	output:{},
	internal:{}
};

/**
 * @public
 * */
MVCFeature.getFullNotePath = function (noteName)
{
	return frameworkUtil.getActorDomain(this, this.featureName)+'.'+noteName;
};

/*
* this is called after setup to initiate feature.
* This maybe overrided
* */
MVCFeature.prototype.initialize = function()
{
	BOK.each(this.subFeatures, function (item) {
		item.initialize();
	});
};

/*
* this is called at setup phase to install all actors of this feature to facade*
* */
MVCFeature.prototype.setup = function ()
{
	var newDomain = frameworkUtil.getActorDomain(this.constructor, this.constructor.featureName);

	BOK.each(this.proxies, function (item) {
		item.constructor.domain = newDomain;
		item.domainUpdated();
		puremvc.Facade.getInstance().registerProxy(item);
	});

	BOK.each(this.mediators, function (item) {
		item.constructor.domain = newDomain;
		item.domainUpdated();
		puremvc.Facade.getInstance().registerMediator(item);
	});

	BOK.each(this.commandDefs, function (item) {
		item.cmd.domain = newDomain;
		var noteFullName = newDomain+'.'+frameworkUtil.getDomainPath(item.domain, item.note);
		puremvc.Facade.getInstance().registerCommand(noteFullName, item.cmd);
	});

	BOK.each(this.subFeatures, function (item) {
		item.constructor.domain = newDomain;
		item.setup();
	});
};

/*
 * this is to unregister all feature actors
 *
 *
 * */
MVCFeature.prototype.uninstall = function ()
{
	BOK.each(this.proxies, function (item) {
		item.constructor.domain = '';
		puremvc.Facade.getInstance().removeProxy(item.getProxyName());
	});

	BOK.each(this.mediators, function (item) {
		item.constructor.domain = '';
		puremvc.Facade.getInstance().removeMediator(item.getMediatorName());
	});

	BOK.each(this.commandDefs, function (item) {
		item.cmd.domain = '';
		puremvc.Facade.getInstance().removeCommand(item.note);
	});

	BOK.each(this.subFeatures, function (item) {
		item.constructor.domain = '';
		item.uninstall();
	});
};

/**
 * @public send notification
 * Notifications sent from feature directly would be considered as notes for current
 * feature domain, thus adding feature name into domain path.
 * */
MVCFeature.prototype.sendNotification = function (name, body)
{
	var noteFullName = frameworkUtil.getDomainPath(frameworkUtil.getActorDomain(this.constructor, this.constructor.featureName), name);
	puremvc.Facade.getInstance().sendNotification(noteFullName, body);
};

/**
 * @public send notification on parent domain.
 * This allows sending notification to a different feature which is on the same domain.
 * */
MVCFeature.prototype.sendParentNotification = function (name, body)
{
    var noteFullName = frameworkUtil.getDomainPath(this.constructor.domain, name);
	puremvc.Facade.getInstance().sendNotification(noteFullName, body);
};

/**
 * @public send exact notification which have full path included.
 * */
MVCFeature.prototype.sendFullPathNotification = function (name, body)
{
	puremvc.Facade.getInstance().sendNotification(name, body);
};

/**
 * @param {App} app
 * */
MVCFeature.prototype.setApp = function (app)
{
    this._app_ = app;

    //set app for all actors and sub features
    BOK.each(this.proxies, function (item) {
        item._app_ = app;
    });

    BOK.each(this.mediators, function (item) {
        item._app_ = app;
    });

    BOK.each(this.commandDefs, function (item) {
        item.cmd._app_ = app;
    });

    BOK.each(this.subFeatures, function (item) {
        item.setApp(app);
    });
};

/**
 * actor registers
 * */
MVCFeature.prototype.addProxy = function (actor)
{
	if(actor)
    {
        actor._app_ = this._app_;
		this.proxies.push(actor);
    }
};
MVCFeature.prototype.addMediator = function (actor)
{
	if(actor)
    {
        actor._app_ = this._app_;
		this.mediators.push(actor);
    }
};

/**
 * @param {String} note notification name.
 * @param {Function} cmd command class.
 * @param {?String} [domain] The domain is optional.
 * */
MVCFeature.prototype.addCommand = function (note, cmd, domain)
{
	if(note && cmd)
    {
        cmd._app_ = this._app_;
		this.commandDefs.push({note:note, cmd:cmd, domain:domain});
    }
};
MVCFeature.prototype.addFeature = function (feature)
{
	if(feature)
    {
        feature.setApp(this._app_);
		this.subFeatures.push(feature);
    }
};