/**
 * @fileoverview
 * @author: lys
 * Date: 12-10-17
 * Time: 下午10:41
 *
 * BOK Code.
 */
goog.provide("bok.features.gamesave.c.LoadGameCMD");
goog.require("bok.framework.core.BaseCommand");

BOK.inherits(LoadGameCMD, BaseCommand);

function LoadGameCMD()
{
	BaseCommand.call(this);
}


/**
 * @override
 * msg.body is the note to feed back the data.
 * */
LoadGameCMD.prototype.execute = function(msg)
{
	var data = this.retrieveProxy('LocalSaveProxy').load(msg.body.name);

	//feed back save data
	var callback = msg.body.callback;
	if(callback)
		callback(data);
	else
		throw Error('LoadGameCMD.execute: load callback function unavailable.');
};
