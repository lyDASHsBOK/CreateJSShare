/**
 * @fileoverview
 * @author: lys
 * Date: 12-10-17
 * Time: 下午10:40
 *
 * BOK Code.
 */
goog.provide("bok.features.gamesave.c.QuickSaveCMD");
goog.require("bok.framework.core.BaseCommand");

BOK.inherits(QuickSaveCMD, BaseCommand);

function QuickSaveCMD()
{
	BaseCommand.call(this);
}

/**
 * msg.body is the data to save in JSON format.
 * */
QuickSaveCMD.prototype.execute = function(msg)
{
	this.retrieveProxy('LocalSaveProxy').quickSave(msg.body);
};
