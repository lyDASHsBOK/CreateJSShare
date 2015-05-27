/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 18/09/13
 * Time: 17:23
 *
 */
goog.provide("bok.features.gamesave.c.RegSlotSchemaCMD");
goog.require("bok.framework.core.BaseCommand");

BOK.inherits(RegSlotSchemaCMD, BaseCommand);

function RegSlotSchemaCMD()
{
    BaseCommand.call(this);
}

/**
 *
 * */
RegSlotSchemaCMD.prototype.execute = function(msg)
{
    this.retrieveProxy('LocalSaveProxy').regSaveSlotSchema(msg.body.name, msg.body.schema);
};