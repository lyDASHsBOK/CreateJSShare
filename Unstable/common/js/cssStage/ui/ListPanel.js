/**
 * @fileoverview
 * @author: lys
 * Date: 12-9-2
 * Time: 上午1:22
 *
 * BOK Code.
 */
goog.provide("bok.cssstage.ui.ListPanel");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(ListPanel, CssDisplayObject);


function ListPanel(name, style)
{
	CssDisplayObject.call(this, name);

	this.items = [];
	this.itemWrapers = [];
	this.ul = document.createElement('ul');
	this.div.appendChild(this.ul);
	this.div.className = 'ListPanel';
	this.currentUsingStyle = style || ListPanel.LIST_STYLE.HORIZONTAL;
}

ListPanel.LIST_STYLE = {
	HORIZONTAL: 'ListPanelHorizontal',
	VERTICAL: 'ListPanelVertical'
};

/**@public
 * @param {String} style the style must come from ListPanel.LIST_STYLE
 * */
ListPanel.prototype.useListStyle = function(style)
{
	this.currentUsingStyle = style;

	BOK.each(this.itemWrapers, function(li){
		li.className = style;
	});
};

/**@public
 * @param {CssDisplayObject} obj
 * @return {Element} returns the <li> element which wraps passed item
 * */
ListPanel.prototype.addItem = function(obj)
{
	var li = this.addEmptyItem();
	li.appendChild(obj.div);
	this.items[this.items.length-1] = obj;

	return li;
};

/**@public
 * @param {String} str
 * @return {Element} returns the <li> element which wraps passed item
 * */
ListPanel.prototype.addStrItem = function(str)
{
	var li = this.addEmptyItem();
	BOK.setInnerText(li, str);
	this.items[this.items.length-1] = str;

	return li;
};

/**@public
 * @param {Element} item
 * @return {Element} returns the <li> element which wraps passed item
 * */
ListPanel.prototype.addDOMItem = function(item)
{
	var li = this.addEmptyItem();
	li.appendChild(item);
	this.items[this.items.length-1] = item;

	return li;
};

/**@public
 * @return {Element} returns the <li> element which wraps passed item
 * */
ListPanel.prototype.addEmptyItem = function()
{
	var li = document.createElement('li');
	li.className = this.currentUsingStyle;
	this.ul.appendChild(li);

	this.items.push('');
	this.itemWrapers.push(li);

	return li;
};


ListPanel.prototype.getItem = function(index)
{
	return this.items[index];
};

ListPanel.prototype.removeItem = function(index)
{
	this.ul.removeChild(this.itemWrapers[index]);
	this.itemWrapers.splice(index, 1);
	this.items.splice(index, 1);
};

ListPanel.prototype.empty = function()
{
	this.ul.innerHTML = '';
	this.itemWrapers.splice(0);
	this.items.splice(0);
};