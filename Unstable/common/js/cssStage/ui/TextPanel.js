/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 13/04/12
 * Time: 16:46
 *
 */

goog.provide("bok.cssstage.ui.TextPanel");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(TextPanel, CssDisplayObject);


/**
 * This UI component uses 'uicommon.css' style sheet
 * */
function TextPanel(name)
{
	CssDisplayObject.call(this, name);

	//logic vars
	this.text = '';
	this.autoScroll = true;

	//text filed setup
	this.textfield = new CssDisplayObject("textfield");
	this.textfield.div.className = "TextPanel";
	this.addChild(this.textfield);
	this.pre = document.createElement('pre');
	this.pre.className = 'TextPanel';
	this.textfield.div.appendChild(this.pre);
	this.maxLine = 100;

	//view settings
	this.setX(100);
	this.setY(100);
	this.setWidth(200);
	this.setHeight(70);
}

//////////////////////////////////////////////////////////////////////////////////////
//public functions
TextPanel.prototype.refresh = function()
{
	this.updateView();
};

TextPanel.prototype.clear = function()
{
	this.showMessage('');
};

TextPanel.prototype.showMessage = function(msg)
{
	this.text = msg;
	this.updateView();
	this.dispatchEvent(Event.CHANGE);
};

TextPanel.prototype.feedMessage = function(msg)
{
	this.text += "\n"+msg;
	this.updateView();
	this.dispatchEvent(Event.CHANGE);
};

//////////////////////////////////////////////////////////////////////////////////////
//private functions
TextPanel.prototype.updateView = function()
{
	var texts = this.text.split('\n');
	if(texts.length > this.maxLine)
	{
		texts.splice(0, texts.length-this.maxLine);
		this.text = texts.join('\n');
	}

	BOK.setInnerText(this.pre, this.text);

	if(this.autoScroll)
		this.pre.scrollTop = this.pre.scrollHeight;
};