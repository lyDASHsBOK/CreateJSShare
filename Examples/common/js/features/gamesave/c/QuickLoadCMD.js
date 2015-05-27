/**
 * @fileoverview
 * @author: lys
 * Date: 12-10-17
 * Time: 下午10:41
 *
 * BOK Code.
 */
goog.provide("bok.features.gamesave.c.QuickLoadCMD");
goog.require("bok.framework.core.BaseCommand");

BOK.inherits(QuickLoadCMD, BaseCommand);

function QuickLoadCMD()
{
	BaseCommand.call(this);
}


/**
 * @override
 * msg.body is the note to feed back the data.
 * */
QuickLoadCMD.prototype.execute = function(msg)
{
	var data = this.retrieveProxy('LocalSaveProxy').quickLoad();

	//feed back save data
	var feedback = msg.body;
    switch(typeof feedback)
    {
        case 'string':
            this.sendFullPathNotification(feedback, data);
            break;
        case 'function':
            feedback(data);
            break;
        case 'object':
            feedback['data'] = data;
            break;
    }
};
