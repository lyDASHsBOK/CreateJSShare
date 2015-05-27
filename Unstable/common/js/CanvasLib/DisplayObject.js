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
}

function Rect(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

BOK.inherits(DisplayObject, EventDispatcher);

function DisplayObject()
{
	EventDispatcher.call(this);
	
	
	this.x = 0;
	this.y = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotate = 0;
	this.alpha = 1;
	this.visible = true;
	this.parent = null;
	this.stage = null;
}

DisplayObject.prototype.singleRender = function()
{
	this.render();
};

DisplayObject.prototype.render = function()
{
};


DisplayObject.prototype.addToStage = function(stage)
{
	this.stage = stage;
	
	this.dispatchEvent(new Event(Event.ADDED_TO_STAGE));
};

DisplayObject.prototype.removeFromStage = function()
{
	if(this.stage)
	{
		this.stage = null;
		
		this.dispatchEvent(new Event(Event.REMOVED_FROM_STAGE));
	}
};

DisplayObject.prototype.hitTestRect = function(rect)
{
	if(!rect)
		return;
	
	var bNotHit = this.x - this.canvas.width/2 > rect.x + rect.w/2
				|| this.y - this.canvas.height > rect.y + rect.h/2
				|| this.x + this.canvas.width/2 < rect.x - rect.w/2
				|| this.y + this.canvas.height < rect.y; - rect.h/2
				
	return !bNotHit;
};

DisplayObject.prototype.moveToX = function(x, duration, type, delegateCallBack)
{
	if(this.stage)
		this.stage.tweener.addTween(this, "x", this.x, x, duration, type, delegateCallBack);
};

DisplayObject.prototype.moveToY = function(y, duration, type, delegateCallBack)
{
	if(this.stage)
		this.stage.tweener.addTween(this, "y", this.y, y, duration, type, delegateCallBack);
};

DisplayObject.prototype.fadeIn = function(duration, type, delegateCallBack)
{
	if(this.stage)
	{
		var tweenObj = this.stage.tweener.addTween(this, "alpha", 0, 1, duration, type, delegateCallBack);
	}
};

DisplayObject.prototype.fadeOut = function(duration, type, delegateCallBack)
{
	if(this.stage)
	{
		var tweenObj = this.stage.tweener.addTween(this, "alpha", this.alpha, 0, duration, type, delegateCallBack);
	}
};
