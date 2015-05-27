/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-2-2
 * Time: 下午7:03
 *
 */
goog.provide("bok.cssstage.ui.CircleMenuNode");
goog.provide("bok.cssstage.ui.CircleMenu");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(CircleMenuNode, CssDisplayObject);
/**
 * @constructor
 *
 * @param {String} nodeName
 * @param {Number=100} [nodeArmLength]
 * */
function CircleMenuNode(nodeName, nodeArmLength)
{
	CssDisplayObject.call(this, nodeName);
	this.addClassName('circleMenuNode');
	this.setAlpha(0);

	this.subNodes = [];
	this.nodeArmLength = nodeArmLength?nodeArmLength:100;
	this.disbaledCircleAlpha = 0.4;
	this.expanded = false;
	this.setStyle('top', '0');

	this.baseNode = new CssDisplayObject('base');
	this.addChild(this.baseNode);

	this.centerNode = new CssDisplayObject('center');
	this.baseNode.addChild(this.centerNode);

	this.closeButton = new CssButton(CircleMenuNode.CLOSE_BUTTON_TEXT);
	this.closeButton.usePosition('relative');
	this.closeButton.setStyle('right', '50%');
	this.closeButton.setVisible(false);
	this.closeButton.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onCloseClicked));
	this.centerNode.addChild(this.closeButton);

	this.nodeButton = new CssButton(nodeName);
	this.nodeButton.usePosition('relative');
	this.nodeButton.setStyle('right', '50%');
	this.nodeButton.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onNodeClicked));
	this.centerNode.addChild(this.nodeButton);
}

CircleMenuNode.CLOSE_BUTTON_TEXT = 'CLOSE';

CircleMenuNode.Event = {
	NODE_CLICKED: 'nodeClicked',
	EXPANDED: 'Expanded',
	UNEXPANDED: 'Unexpanded'
};

/**
 * Change the default close button text
 * @param {String} text
 * */
CircleMenuNode.setCloseButtonText = function(text)
{
    CircleMenuNode.CLOSE_BUTTON_TEXT = text;
};

/**
 * @override
 * @public
 * */
CircleMenuNode.prototype.disable = function()
{
	//if node is already locked, leave it.
	if(!this.locked)
	{
		this.nodeButton.disable();
		this.closeButton.disable();
	}

	//disable all sub nodes too
	BOK.each(this.subNodes, function(node){
		node.disable();
	});
};

/**
 * @override
 * @public
 * */
CircleMenuNode.prototype.enable = function()
{
	//if node is already locked, leave it.
	if(!this.locked)
	{
		this.nodeButton.enable();
		this.closeButton.enable();
	}

	//enable all sub nodes too
	BOK.each(this.subNodes, function(node){
		node.enable();
	});
};

/**
 * @public
 * */
CircleMenuNode.prototype.getNodeButton = function()
{
	return this.nodeButton;
};

/**
 * @public
 * */
CircleMenuNode.prototype.lock = function()
{
	this.locked = true;
	this.nodeButton.disable();
	this.closeButton.disable();
};

/**
 * @public
 * */
CircleMenuNode.prototype.release = function()
{
	this.locked = false;
	this.nodeButton.enable();
	this.closeButton.enable();
};

/**
 * @public
 * @param {String} nodeName
 *
 * @return {CircleMenuNode} The new added subnode.
 * */
CircleMenuNode.prototype.addSubNode = function(nodeName)
{
	var node = new CircleMenuNode(nodeName, this.nodeArmLength * 0.8);
	this.subNodes.push(node);

	node.addEventListener(CircleMenuNode.Event.EXPANDED, Delegate.create(this, this.subNodeExpanded));
	node.addEventListener(CircleMenuNode.Event.UNEXPANDED, Delegate.create(this, this.subNodeUnexpanded));
	node.addEventListener(CircleMenuNode.Event.NODE_CLICKED, Delegate.create(this, this.subNodeClicked));

	//if already in expand view, update view to show new node.
	if(this.expanded)
		this.expand();

	return node;
};

/**
 * @public
 * @param {String} name The name of the subNode to find.
 *
 * @return {CircleMenuNode}
 * */
CircleMenuNode.prototype.getSubNode = function(name)
{
	var foundNode = null;
	BOK.each(this.subNodes, function(node){
		if(name == node.name)
			foundNode = node;
	});

	return foundNode;
};

/**
 * @public
 * */
CircleMenuNode.prototype.clearAllSubNode = function()
{
	this.unexpand(true);
	this.subNodes = [];
};

/**
 * @public
 * This function should be called by the parent node of this node.
 *
 * @param {Number} degree
 * */
CircleMenuNode.prototype.reveal = function(degree)
{
	this.setRotate(degree);
	this.setY(-this.nodeArmLength);
	this.setAlpha(1);

	//rotate base back to keep content in correct rotation
	this.baseNode.setRotate(-degree);
};

/**
 * @public
 * This function should be called by the parent node of this node.
 * */
CircleMenuNode.prototype.hide = function()
{
	this.setRotate(0);
	this.setY(0);
	this.setAlpha(0);
	this.baseNode.setRotate(0);
};

/**
 * @public
 * */
CircleMenuNode.prototype.expand = function()
{
	if(this.subNodes.length > 0)
	{
		var rotateUnit = 360/this.subNodes.length;
		var subNodes = this.subNodes;
		BOK.each(subNodes, function(node, index){
			if(!this.centerNode.haveChild(node))
				this.centerNode.addChild(node);
		}, this);
		cssStageTool.requestAnimationFrame(function() {
			BOK.each(subNodes, function(node, index){
				node.reveal(index?rotateUnit*index:360);
			});
		});
		this.nodeButton.setVisible(false);
		this.closeButton.setVisible(true);
		this.expanded = true;
		this.dispatchEvent(new Event(CircleMenuNode.Event.EXPANDED));
	}
};

/**
 * @public
 *
 * @param {Boolean=false} [isQuickUnexpand]
 * */
CircleMenuNode.prototype.unexpand = function(isQuickUnexpand)
{
	//check for expanded subNode
	var haveExpandedSubNode = false;
	BOK.each(this.subNodes, function(node){
		if(node.expanded)
		{
			haveExpandedSubNode = true;
			var THIS = this;
			var chainFunction = function()
			{
				node.removeEventListener(CircleMenuNode.Event.UNEXPANDED, chainFunction);
				THIS.unexpand(isQuickUnexpand);
			};

			node.addEventListener(CircleMenuNode.Event.UNEXPANDED, chainFunction);
			node.unexpand(isQuickUnexpand);
		}
	}, this);
	if(haveExpandedSubNode)
		return;

	BOK.each(this.subNodes, function(node, index){
		node.hide();
		if(isQuickUnexpand)
		{
			this.centerNode.removeChild(node);
			this.unexpandWrapUp();
		}
		else
		{
			var THIS = this;
			node.addEventListener(Event.COMPLETE, function(e){
				var self = e.target;
				self.removeEventListener(Event.COMPLETE);
				THIS.centerNode.removeChild(self);

				//unexpand wrap-up only do once.
				if(0 == index)
					THIS.unexpandWrapUp();
			});
		}
	}, this);
};

/**
 * @private
 * */
CircleMenuNode.prototype.unexpandWrapUp = function()
{
	this.nodeButton.setVisible(true);
	this.closeButton.setVisible(false);
	this.expanded = false;
	this.dispatchEvent(new Event(CircleMenuNode.Event.UNEXPANDED));
};


/**
 * @private
 * Event listener
 * */
CircleMenuNode.prototype.onNodeClicked = function()
{
	this.dispatchEvent(new Event(CircleMenuNode.Event.NODE_CLICKED, this.nodeButton.name));
	this.expand();
};

/**
 * @private
 * Event listener
 * */
CircleMenuNode.prototype.onCloseClicked = function()
{
	this.unexpand();
};

/**
 * @private
 * Event listener
 * */
CircleMenuNode.prototype.subNodeExpanded = function(e)
{
	/** @type {CircleMenuNode}*/
	var subNode = e.target;

	//lock all
	this.lock();
	this.closeButton.setAlpha(this.disbaledCircleAlpha);
	BOK.each(this.subNodes, function(node){
		node.lock();
		node.setAlpha(this.disbaledCircleAlpha);
	}, this);

	//release selected node afterwards
	subNode.gotoFront();
	subNode.release();
	subNode.setAlpha(1);
};

/**
 * @private
 * Event listener
 * */
CircleMenuNode.prototype.subNodeUnexpanded = function(e)
{
	//enable all
	this.release();
	this.closeButton.setAlpha(1);
	BOK.each(this.subNodes, function(node){
		node.release();
		node.setAlpha(1);
	});
};

/**
 * @private
 * Event listener
 * */
CircleMenuNode.prototype.subNodeClicked = function(e)
{
	//broad cast node click event to upper node
	this.dispatchEvent(new Event(CircleMenuNode.Event.NODE_CLICKED, e.body));
};




//////////////////////////////////////////////////////////////////////////////


BOK.inherits(CircleMenu, CircleMenuNode);
/**
 * @constructor
 *
 * @param {String} name
 * @param {Number=100} [nodeArmLength]
 * */
function CircleMenu(name, nodeArmLength)
{
	CircleMenuNode.call(this, name, nodeArmLength);

	this.setAlpha(1);
}




