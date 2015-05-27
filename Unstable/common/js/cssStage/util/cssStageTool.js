/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 26/04/12
 * Time: 14:50
 *
 */

goog.provide("bok.cssstage.util.cssStageTool");

var cssStageTool = {};

cssStageTool.EASE_TYPE = {
	LINEAR: 'linear',
	EASE: 'ease',
	EASE_IN: 'ease-in',
	EASE_OUT: 'ease-out',
	EASE_IN_OUT: 'ease-in-out',
	BOUNCE_PULL_DOWN: 'cubic-bezier(0.5, -0.8, 0.3, 1.4)'
};

/**
 * @return {string} return the css transform the browser uses
 * */
cssStageTool.getBrowserTransform = function()
{
	if(!cssStageTool.browserTransform)
	{
		var propList = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'];
		var prop = propList.shift();
		while (prop)
		{
			if (typeof document.body.style[prop] !== 'undefined') {
				break;
			}
			prop = propList.shift();
		}

		cssStageTool.browserTransform = prop;
	}

	return cssStageTool.browserTransform;
};


/**
 * @param {Function} callBack
 * @param {int} [interval] next frame animation time interval, in mm
 * */
cssStageTool.requestAnimationFrame = function(callBack, interval)
{
	var requestAnimationFrameFunc;

	if(interval)
		requestAnimationFrameFunc = function(callback) { setTimeout(callback, interval); };
	else
	    requestAnimationFrameFunc = window.requestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		function(callback) { setTimeout(callback, 1000 / 60); };

	requestAnimationFrameFunc.call(window, callBack);
};

cssStageTool.getBrowserTransition = function()
{
	return "webkitTransition";
};

cssStageTool.isIOS = function()
{
	return (navigator.userAgent.toLowerCase().indexOf("iphone") >-1 || navigator.userAgent.toLowerCase().indexOf("ipad") >-1 || navigator.userAgent.toLowerCase().indexOf("ipod") >-1);
};