/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-6-20
 * Time: 下午10:43
 *
 */
goog.provide("bok.easelui.EsButton");
goog.require("bok.easelui.EsUIComponent");
goog.require("bok.util.EaselAnimationHelper");

BOK.inherits(EsButton, EsUIComponent);

/**
 * @param {string} text
 * @param {Object=} option misc settings, including:
 *  {
 *      font: {String},
 *      fontColor: {String},
 *      borderColor: {String},
 *      bgColor: {String},
 *      shadowColor: {String},
 *      border: {number},
 *      enableShadow: {boolean},
 *      width: {number},
 *      height: {number}
 *  }
 * */
function EsButton(text, option)
{
    EsUIComponent.call(this);

    //default settings
    var settings = {
        width: 'auto',
        height: 'auto',
        font: "35px Arial bold",
        fontColor: "#000000",
        borderColor: 'rgba(20,20,20,1)',
        bgColor: 'rgba(255,255,255,1)',
        shadowColor: "#000000",
        border: 5,
        enableShadow: true,
        textOffsetX: 0
    };

    //load custom settings
    for(var key in option)
    {
        //noinspection JSUnfilteredForInLoop
        settings[key] = option[key];
    }

    var DOUBLE_BORDER = settings.border * 2;
	this.text_ = text;
	this.base_ = new createjs.Shape();
	this.textDisplay_ = new createjs.Text(this.text_, settings.font, settings.fontColor);
	var textWidth = this.textDisplay_.getMeasuredWidth();
	var textHeight = this.textDisplay_.getMeasuredHeight();
	var width = 'auto' != settings.width ? settings.width : textWidth;
	var height = 'auto' != settings.height ? settings.height : textHeight;

	this.base_.graphics.beginFill(settings.borderColor).drawRoundRect(0, 0, width+DOUBLE_BORDER, height+DOUBLE_BORDER, DOUBLE_BORDER);
	this.base_.graphics.beginFill(settings.bgColor).drawRoundRect(settings.border, settings.border, width, height, DOUBLE_BORDER);
	this.addChild(this.base_);

	this.textDisplay_.set({x:(width-textWidth)/2+settings.border+settings.textOffsetX, y:(height-textHeight)/2+settings.border});
	this.addChild(this.textDisplay_);

    if(settings.enableShadow)
	    this.base_.shadow = new createjs.Shadow(settings.shadowColor, 7, 7, 10);


    this.width = width + DOUBLE_BORDER;
    this.height = height + DOUBLE_BORDER;
    //keep a copy of setting for future ref
    this.settings = settings;
}