/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-6-13
 * Time: 上午1:22
 *
 */
goog.provide("bok.cssstage.widgets.EaselStage");
goog.require("org.createjs.easeljs.EaselJS");
goog.require("org.createjs.tweenjs.TweenJS");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(EaselStage, CssDisplayObject);

function EaselStage(name, width, height)
{
	CssDisplayObject.call(this, name);
	this.stageWidth_ = width?width:640;
	this.stageHeight_ = height?height:480;

	var canvas = document.createElement('canvas');
	canvas.width = this.stageWidth_;
	canvas.height = this.stageHeight_;
	this.div.appendChild(canvas);
	this.stage_ = new createjs.Stage(canvas);

	createjs.Ticker.addEventListener("tick", Delegate.create(this, this.onStageUpdate_));
}

/**
 * Event listener
 * @private
 * */
EaselStage.prototype.onStageUpdate_ = function()
{
    this.stage_.update();
    this.dispatchEvent(new Event(Event.UPDATE));
};

EaselStage.prototype.getEaselStage = function()
{
    return this.stage_;
};

/**
 * @param object {createjs.DisplayObject}
 * */
EaselStage.prototype.addCanvasChild = function(object)
{
    this.stage_.addChild(object);
};

/**
 * @param object {createjs.DisplayObject}
 * */
EaselStage.prototype.removeCanvasChild = function(object)
{
    this.stage_.removeChild(object);
};
