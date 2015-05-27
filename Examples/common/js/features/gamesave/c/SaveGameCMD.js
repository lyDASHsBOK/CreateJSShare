/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-6-21
 * Time: 上午12:15
 *
 */
goog.provide("bok.features.gamesave.c.SaveGameCMD");
goog.require("bok.framework.core.BaseCommand");

BOK.inherits(SaveGameCMD, BaseCommand);

function SaveGameCMD()
{
	BaseCommand.call(this);
}

/**
 * msg.body is the data to save in JSON format.
 * */
SaveGameCMD.prototype.execute = function(msg)
{
	this.retrieveProxy('LocalSaveProxy').save(msg.body.name, msg.body.data);
};
