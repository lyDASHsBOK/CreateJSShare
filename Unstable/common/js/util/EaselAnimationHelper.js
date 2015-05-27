/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-6-13
 * Time: 上午2:04
 *
 */

goog.provide("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");
goog.require("org.createjs.tweenjs.TweenJS");

function EaselAnimationHelper()
{

}

/**
 * @param object
 * @param {number} x
 * @param {number} y
 * @param {number} duration In ms
 * @return {createjs.Tween}
 * */
EaselAnimationHelper.bounceTo = function(object, x, y, duration)
{
	return createjs.Tween.get(object).to({x:x, y:y}, duration, createjs.Ease.bounceOut);
};

/**
 * @param object
 * @param {number} x
 * @param {number} y
 * @param {number} duration In ms
 * @param {Function=} easeFunc should be one of {createjs.Ease}
 * @return {createjs.Tween}
 * */
EaselAnimationHelper.moveTo = function(object, x, y, duration, easeFunc)
{
	return createjs.Tween.get(object).to({x:x, y:y}, duration, easeFunc ? easeFunc : createjs.Ease.cubicOut);
};

/**
 * @param object
 * @param {number} distance
 * @param {number} duration In ms
 * @return {createjs.Tween}
 * */
EaselAnimationHelper.standOut = function(object, distance, duration)
{
	if(!object.shadow)
		object.shadow = new createjs.Shadow("#000000", 0, 0, 0);

	createjs.Tween.get(object).to({x:object.x-distance, y:object.y-distance}, duration, createjs.Ease.cubicOut);
	return createjs.Tween.get(object.shadow).to({offsetX:distance, offsetY:distance, blur:10}, duration, createjs.Ease.cubicOut);
};

EaselAnimationHelper.putDown = function(object, duration)
{
	createjs.Tween.get(object).to({x:object.x+object.shadow.offsetX, y:object.y+object.shadow.offsetY}, duration, createjs.Ease.cubicOut);
	return createjs.Tween.get(object.shadow).to({offsetX:0, offsetY:0, blur:0}, duration, createjs.Ease.cubicOut);
};

EaselAnimationHelper.disappear = function(object, duration)
{
	return createjs.Tween.get(object).to({alpha:0}, duration, createjs.Ease.bounceOut);
};

EaselAnimationHelper.fadeIn = function(object, duration)
{
    object.alpha = 0;
	return createjs.Tween.get(object).to({alpha:1}, duration, createjs.Ease.bounceOut);
};

