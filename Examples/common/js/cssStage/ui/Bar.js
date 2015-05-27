/**
 * @fileoverview
 * @author: lys
 * Date: 12-11-29
 * Time: 上午2:49
 *
 * BOK Code.
 */

goog.provide("bok.cssstage.ui.Bar");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(Bar, CssDisplayObject);

/**
 * @constructor
 *
 * @param {string} name
 * @param {string=} [label]
 * */
function Bar(name, label, width)
{
	CssDisplayObject.call(this, name);

	if(!label)
		label = name;

	this.div.style.color = '#FFFFFF';
	this.title = new CssDisplayObject('title');
	this.title.setWidth(width?width:100);
	this.title.div.innerHTML = label;
	this.title.usePosition('');
	this.addChild(this.title);

	this.barBase = new CssDisplayObject('base');
	this.barBase.setWidth(width?width:100);
	this.barBase.addClassName('BarBase');
	this.addChild(this.barBase);

	this.bar = document.createElement('span');
	BOK.addClassName(this.bar, 'BarContent');
	this.barBase.div.appendChild(this.bar);

	this.barCover = document.createElement('span');
	BOK.addClassName(this.barCover, 'BarContentCover');
	this.barBase.div.appendChild(this.barCover);

	this.percentage = 100;
	this.setFillPercentage(this.percentage);
}

/**
 * @public
 * @param {number} percent
 * */
Bar.prototype.setFillPercentage = function(percent)
{
	this.bar.style.width = percent+'%';
	this.barCover.style.width = percent+'%';
	this.percentage = percent;
};

/**
 * @public
 * @return {number} percent
 * */
Bar.prototype.getCurrentPercentage = function()
{
	return this.percentage;
};

/**
 * @public
 * @param {string} title
 * */
Bar.prototype.updateTitle = function(title)
{
	this.title.div.innerHTML = title;
};
