/**
 * @param {string} name Event name.
 * @param {*=} [body] (optional) Event body.
 * */
goog.provide('bok.event.Event');

/**
 * @constructor
 *
 * @param {String} name Event string.
 * @param {*} [body] Event body, can be ignored.
 * */
function Event(name, body)
{
	/** @type {string}*/
	this.name = name;
	/** @type {Object}*/
	this.body = body;
	/** @type {EventDispatcher}*/
	this.target = null;
}

Event.ADDED_TO_STAGE = "addedToStage";
Event.REMOVED_FROM_STAGE = "removedToStage";
Event.COMPLETE = "complete";
Event.CHANGE = "change";
Event.SELECTED = "selected";
Event.UNSELECTED = "unselected";
Event.UPDATE = "update";
Event.CLICK = "click";



//MouseEvent:
Event.MOUSE = {
	DOWN:"MouseDown",
	UP:"MouseUp",
	MOVE:"MouseMove",
	CLICK:"MouseClick"
};
