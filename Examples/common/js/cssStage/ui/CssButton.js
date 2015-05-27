/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 02/04/12
 * Time: 13:10
 *
 */
goog.provide("bok.cssstage.ui.CssButton");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(CssButton, CssDisplayObject);

function CssButton(name, label)
{
	CssDisplayObject.call(this, name);

	this.label = label?label:name;
	this.disabled = false;
	this.displayStyle = CssButton.VIEW_TYPE.NORMAL;
	this.updateInnerHTML();
}

CssButton.VIEW_TYPE = {
	NORMAL: 'NormalButton',
	BUMP_UP: 'BumpUpButton'
};

CssButton.prototype.setLabel = function(label)
{
	this.label = label;
	this.updateInnerHTML();
};

CssButton.prototype.setType = function(type)
{
	this.displayStyle = type;
	this.updateInnerHTML();
};

CssButton.prototype.disable = function()
{
	this.clickEventPrevented = true;
	this.disabled = true;
	this.updateInnerHTML()
};

CssButton.prototype.enable = function()
{
	this.clickEventPrevented = false;
	this.disabled = false;
	this.updateInnerHTML();
};

CssButton.prototype.updateInnerHTML = function()
{
	if(!this.disabled)
	{
		this.div.className = this.displayStyle;
		this.div.innerHTML = "<a style='cursor:default'>"+this.label+"</a>";

	}
	else
	{
		this.div.className = '';
		this.div.innerHTML = "<a style='cursor:default'>"+this.label+"</a>";
	}
};
