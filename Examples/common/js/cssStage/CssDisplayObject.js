goog.provide("bok.cssstage.CssDisplayObject");
goog.require('bok.cssstage.util.cssStageTool');
goog.require('bok.BOK');
goog.require('bok.Delegate');
goog.require('bok.EventDispatcher');

BOK.inherits(CssDisplayObject, EventDispatcher);

function Point(x, y)
{
	this.x = x;
	this.y = y;
}

Point.clone = function(point)
{
	var clone = new Point(0, 0);
	clone.x = point.x;
	clone.y = point.y;
	return clone;
};

function CssDisplayObject(name)
{
	EventDispatcher.call(this);

	/** @type {Element}*/
	this.div = document.createElement("DIV");
	this.div.setAttribute('name', name);
	this.div.CssDisplayObjectRef = this;		//Keep a ref of DisplayObject in div so their no need to manage another children list.

	this.name = name;
	this.x = 0;
	this.y = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotate = 0;
	this.alpha = 1;
	this.width = 0;
	this.height = 0;
	this.visible = true;
	this.parent = null;
	this.stage = null;
	this.numChild = 0;

	this.clickEventPrevented = false;
	// if this value set to false this object
	// will respond mouse event from its child elements.
	this.validateDirectClickEvent = true;
	
	this.initCSSAttribute();
	this.initEventListeners();
}

CssDisplayObject.prototype.eachChild = function(func)
{
	var children = this.div.childNodes;

	for (var i=0; i < children.length; ++i)
	{
		if(children[i].CssDisplayObjectRef && children[i].CssDisplayObjectRef.parent == this)
			func(children[i].CssDisplayObjectRef);
	}
};

CssDisplayObject.prototype.eachNonDOChild = function(func)
{
	var children = this.div.childNodes;

	for (var i=0; i < children.length; ++i)
	{
		if(!children[i].CssDisplayObjectRef)
			func(children[i]);
	}
};



CssDisplayObject.prototype.addChild = function(displayObject)
{
	if(displayObject && displayObject.div)
	{
		if(this.haveChild(displayObject))
		{
			BOK.warn("in CssDisplayObject.addChild(), child is already added.")
		}
		else
		{
			this.div.appendChild(displayObject.div);
			displayObject.parent = this;
			displayObject.updateStage(this.stage);
			this.numChild++;
		}
	}
	else
		BOK.warn("in CssDisplayObject.addChild(), child displayObject do not have a div.")
};


CssDisplayObject.prototype.removeChild = function(displayObject)
{
	if(displayObject && this.haveChild(displayObject))
	{
		this.div.removeChild(displayObject.div);
		displayObject.parent = null;
		displayObject.updateStage(null);
		this.numChild--;
	}
};

CssDisplayObject.prototype.haveChild = function(displayObject)
{
	var found = false;
	this.eachChild(function(child){
		if(child == displayObject)
			found = true;
	});

	return found;
};

CssDisplayObject.prototype.pushFront = function(displayObject)
{
	if(this.haveChild(displayObject))
	{
		this.div.appendChild(displayObject.div);
		return true;
	}
	else
		return false;
};

CssDisplayObject.prototype.gotoFront = function()
{
	if(this.parent)
		this.parent.pushFront(this);
};

CssDisplayObject.prototype.pushBack = function(displayObject)
{
	if(this.haveChild(displayObject) && this.first().div != displayObject.div)
	{
		this.div.insertBefore(displayObject.div, this.first().div);
		return true;
	}
	else
		return false;
};

CssDisplayObject.prototype.gotoBack = function()
{
	if(this.parent)
		this.parent.pushBack(this);
};

CssDisplayObject.prototype.getChildByName = function(name)
{
	var childFound = null;

	this.eachChild(function(child){
		if(child.name == name)
			childFound = child;
	});

	return childFound;
};

CssDisplayObject.prototype.clearAll = function()
{
	//Have to delete from bottom to top because DOM structure change when element removed
	for (var i=this.numChild-1; i >= 0; --i)
	{
		var child = this.div.children[i];
		if(child && child.CssDisplayObjectRef)
		{
			this.removeChild(child.CssDisplayObjectRef);
		}
	}

	this.numChild = 0;
	this.div.innerHTML = '';
};

/**
 * @param {object} setting
 * The DO setting object
 *      expected format
 *      {
 *          pos{x, y},
 *          size{x, y}
 *      }
 * */
CssDisplayObject.prototype.applySettings = function(setting)
{
	if(setting)
	{
		if(setting.pos)
		{
			this.setX(setting.pos.x);
			this.setY(setting.pos.y);
		}

		if(setting.size)
		{
			this.setWidth(setting.size.w);
			this.setHeight(setting.size.h);
		}
	}
};

CssDisplayObject.prototype.enableResponedChildClickEvent = function()
{
	this.validateDirectClickEvent = false;
};

CssDisplayObject.prototype.disableResponedChildClickEvent = function()
{
	this.validateDirectClickEvent = true;
};

CssDisplayObject.prototype.hide = function()
{
	this.setVisible(false);
};

CssDisplayObject.prototype.show = function()
{
	this.setVisible(true);
};

CssDisplayObject.prototype.setName = function(name)
{
	this.div.setAttribute('name', name);
	this.name = name;
};
CssDisplayObject.prototype.setX = function(v)
{
	this.x = v;
	this.updateTransform();
};
CssDisplayObject.prototype.setY = function(v)
{
	this.y = v;
	this.updateTransform();
};
CssDisplayObject.prototype.setPos = function(x, y)
{
	this.x = x?x:0;
	this.y = y?y:0;
	this.updateTransform();
};
CssDisplayObject.prototype.setSize = function(width, height)
{
	this.setWidth(width);
	this.setHeight(height);
};

/**
 * @public
 * @param {number} x
 * @param {number=} [y]
 * */
CssDisplayObject.prototype.setScale = function(x, y)
{
	if(undefined === y)
		y = x;

	this.scaleX = x?x:1;
	this.scaleY = y?y:1;
	this.updateTransform();
};
CssDisplayObject.prototype.setWidth = function(v)
{
	this.width = v;
	this.div.style.width = v+"px";
};
CssDisplayObject.prototype.setHeight = function(v)
{
	this.height = v;
	this.div.style.height = v+"px";
};
CssDisplayObject.prototype.setScaleX = function(v)
{
	this.scaleX = v;	
	this.updateTransform();
};
CssDisplayObject.prototype.setScaleY = function(v)
{
	this.scaleY = v;	
	this.updateTransform();
};
CssDisplayObject.prototype.setRotate = function(v)
{
	this.rotate = v;	
	this.updateTransform();
};
CssDisplayObject.prototype.setAlpha = function(v)
{
	this.alpha = v;	
	this.div.style.opacity = v;
};
CssDisplayObject.prototype.setVisible = function(v)
{
	this.visible = v ? true : false;
	
	if(this.visible)
		this.div.style.display = "block";
	else
		this.div.style.display = "none";
};

/**
 * @param {string} cssTransition
 * */
CssDisplayObject.prototype.setTransition = function(cssTransition)
{
	if(cssTransition)
		this.div.style[cssStageTool.getBrowserTransition()] = cssTransition;
	else
		this.div.style[cssStageTool.getBrowserTransition()] = '';
};

/**
 * change a single css attribute.
 *
 * @param {String} cssKey
 * @param {String} value
 * */
CssDisplayObject.prototype.setStyle = function(cssKey, value)
{
	this.div.style[cssKey] = value;
};

CssDisplayObject.prototype.usePosition = function(p)
{
	this.div.style.position = p;
};

CssDisplayObject.prototype.addClassName = function(name)
{
	BOK.addClassName(this.div, name);
};

CssDisplayObject.prototype.removeClassName = function(name)
{
	BOK.removeClassName(this.div, name);
};

CssDisplayObject.prototype.tweenWidth = function(newWidth, duration, type)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + (type?type:"");
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setWidth, newWidth));
	});
};

CssDisplayObject.prototype.tweenHeight = function(newHeight, duration, type)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + (type?type:"");
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setHeight, newHeight));
	});
};

CssDisplayObject.prototype.scaleTo = function(x, y, duration, type)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + (type?type:"");
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(function(){
			THIS.setScaleX(x);
			THIS.setScaleY(y);
		});
	});
};

CssDisplayObject.prototype.moveToX = function(v, duration, type)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + (type?type:"");
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setX, v));
	});
};

CssDisplayObject.prototype.moveToY = function(v, duration, type)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + (type?type:"");
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setY, v));
	});
};

CssDisplayObject.prototype.fadeOut = function(duration)
{
	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + "linear ";
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setAlpha, 0));
	});
};

CssDisplayObject.prototype.fadeIn = function(duration)
{
	//set alpha to 0 if want to fade in
	this.setAlpha(0);

	var THIS = this;
	cssStageTool.requestAnimationFrame(function(){
		if(cssStageTool.getBrowserTransform() == 'WebkitTransform')
			THIS.div.style[cssStageTool.getBrowserTransition()] = "all " + duration + "s " + "linear ";
		else
			THIS.dispatchEvent(new Event(Event.COMPLETE));

		cssStageTool.requestAnimationFrame(Delegate.create(THIS, THIS.setAlpha, 1));
	});
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Private methods

/**
 * @return {CssDisplayObject}
 * return the first child
 * */
CssDisplayObject.prototype.first = function()
{
	var first = null;
	this.eachChild(function(child){
		if(!first)
			first = child;
	});

	return first;
};



//update stage ref of all contained children
CssDisplayObject.prototype.updateStage = function(stage)
{
	//dispatch add-to-stage event when stage is valid
	var isFirstTimeAddToStage = !this.stage && stage;
	this.stage = stage;

	if(isFirstTimeAddToStage)
		this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));

	this.eachChild(function(child){
		child.updateStage(stage);
	});
};

CssDisplayObject.prototype.updateTransform = function()
{
	//follows conventional scale, rotate, translate transform order.
	this.div.style[cssStageTool.getBrowserTransform()] = (this.scaleX != 1 ? ' scaleX('+this.scaleX+')':'')
											+ (this.scaleY != 1 ? ' scaleY('+this.scaleY+')':'')
											+ (this.rotate ? ' rotate('+this.rotate+'deg)':'')
											+ (this.x ? ' translateX('+this.x+'px)':'')
											+ (this.y ? ' translateY('+this.y+'px)':'');
};

CssDisplayObject.prototype.initCSSAttribute = function()
{
	this.div.style.position = "absolute";
	this.div.style.cursor = "default";
	this.div.addEventListener(cssStageTool.getBrowserTransition()+"End",Delegate.create(this,
	function(e)
	{
		this.div.style[cssStageTool.getBrowserTransition()] = "";
		this.dispatchEvent(new Event(Event.COMPLETE, "CSSTransition"));
		e.stopPropagation();
	}));
};

CssDisplayObject.prototype.useDefaultPosition = function()
{
  this.div.style.position = '';
};

CssDisplayObject.prototype.useAbsolutePosition = function()
{
  this.div.style.position = 'absolute';
};

CssDisplayObject.prototype.initEventListeners = function()
{
	if(cssStageTool.isIOS())
	{
		this.div.ontouchstart = Delegate.create(this, this.onDivMouseDown);
		this.div.ontouchmove = Delegate.create(this, this.onDivMouseMove);
		this.div.ontouchend = Delegate.create(this, this.onMouseUp);
	}
	else
	{
		this.div.onmousedown = Delegate.create(this, this.onDivMouseDown);
		this.div.onmousemove = Delegate.create(this, this.onDivMouseMove);
		this.div.onmouseup = Delegate.create(this, this.onMouseUp);
	}
};

CssDisplayObject.prototype.validClickEvent = function(e)
{
	if(this.clickEventPrevented)
		return false;

	var isValidClickOnThisDisplayObject = e.target == this.div;
	if(this.validateDirectClickEvent)
	{
		this.eachNonDOChild(function(child){
			if(child == e.target)
				isValidClickOnThisDisplayObject = true;
		});
	}
	else
		isValidClickOnThisDisplayObject = true;

	//button 0 is the right button on mouse
	return isValidClickOnThisDisplayObject && ((e.button !== null && e.button == 0) || (e.touches));
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Private listeners
CssDisplayObject.prototype.onMouseUp = function(e)
{
	if(this.validClickEvent(e))
	{
		if(this.mouseDown)
		{
			this.dispatchEvent(new Event(Event.MOUSE.CLICK, e));
			this.mouseDown = false;
		}

		//button 0 is the right button on mouse
		//this.dispatchEvent(new Event(Event.MOUSE.UP, e));
	}
};
CssDisplayObject.prototype.onDivMouseDown = function(e)
{

	if(this.validClickEvent(e))
	{
		this.mouseDown = true;
		this.dispatchEvent(new Event(Event.MOUSE.DOWN, e))
	}

	//prevent all default DOM action for mouse down
	//if(e.preventDefault) e.preventDefault();
};
CssDisplayObject.prototype.onDivMouseMove = function(e)
{
	//button 0 is the right button on mouse
	if(this.validClickEvent(e))
		this.dispatchEvent(new Event(Event.MOUSE.MOVE, e));

	//prevent all default DOM action for mouse move
	//if(e.preventDefault) e.preventDefault();
};
