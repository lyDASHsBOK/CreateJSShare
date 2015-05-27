/**
 * @fileoverview
 * @author: lys
 * Date: 12-10-17
 * Time: 下午10:20
 *
 * Proxy for local save data.
 */
goog.provide("bok.features.gamesave.m.LocalSaveProxy");
goog.require("bok.framework.core.BaseProxy");

BOK.inherits(LocalSaveProxy, BaseProxy);


function LocalSaveProxy(JSVEnvironment)
{
	BaseProxy.call(this);

    this.jsvEnv_ = JSVEnvironment;
    this.saveSlotSchemas_ = {};
}


LocalSaveProxy.prototype.regSaveSlotSchema = function(slotName, schema)
{
    this.saveSlotSchemas_[slotName] = schema;
};

/**
 * @param {string} key save slot name.
 * @param {Object} data The game data for local saving.
 * */
LocalSaveProxy.prototype.save = function(key, data)
{
    if(this.schemaIsValid_(key, data))
	    localStorage[key] = JSON.stringify(data);
    else
        throw Error("bok.features.gamesave.m.LocalSaveProxy.save: Data not valid against slot schema.");
};

/**
 * @param {string} key save slot name.
 * */
LocalSaveProxy.prototype.load = function(key)
{
    if(localStorage[key])
    {
	    var data = JSON.parse(localStorage[key]);
        if(this.schemaIsValid_(key, data))
            return data;
        else
            BOK.warn("bok.features.gamesave.m.LocalSaveProxy.load: Data not valid against slot schema.");
    }

    //by default return empty data
    return {};
};

/**
 * @param {Object} data The game data for local saving.
 * */
LocalSaveProxy.prototype.quickSave = function(data)
{
	localStorage['[' + this._app_.name + ']QUICK_SAVE'] = JSON.stringify(data);
};


/**
 * @return {Object} The saved game data in JSON format.
 * */
LocalSaveProxy.prototype.quickLoad = function()
{
    var slotName = '[' + this._app_.name + ']QUICK_SAVE';
	if(localStorage[slotName])
		return JSON.parse(localStorage[slotName]);
	else
		return null;
};

/**
 * @param {string} slot
 * @param {Object} data
 * @return {boolean}
 * */
LocalSaveProxy.prototype.schemaIsValid_ = function(slot, data)
{
    var schema = this.saveSlotSchemas_[slot];
    if(schema)
    {
        var report = this.jsvEnv_.validate(data, schema);
        if(report['errors'].length > 0)
            return false;
    }

    return true;
};
