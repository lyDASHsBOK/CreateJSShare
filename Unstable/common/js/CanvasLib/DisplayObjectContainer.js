//inherits
BOK.inherits(DisplayObjectContainer, DisplayObject);

function DisplayObjectContainer()
{
	//alert("sub DisplayObjectContainer");
	DisplayObject.call(this);
	
	this.children = new Array();
	this.useRedrawRegion = false;
}

DisplayObjectContainer.prototype.addChild = function(displayObject)
{
	if(!displayObject)
		return;
	
	//detach from old parent
	if(displayObject.parent)
		displayObject.parent.removeChild(displayObject);
	
	//add to parent
	this.children.push(displayObject);
	displayObject.parent = this;
	
	if(this.stage)
		displayObject.addToStage(this.stage);
};

DisplayObjectContainer.prototype.addChildAt = function(displayObject, index)
{
	//TODO: implement later
};


DisplayObjectContainer.prototype.removeChild = function(displayObject)
{
	if(!displayObject)
		return;

	for(var index = 0; index < this.children.length; ++index)
	{
		if(displayObject == this.children[index])
		{
			this.children[index].removeFromStage();
			this.children.splice(index, 1);
			break;
		}
	}	
};

DisplayObjectContainer.prototype.removeChildAt = function(index)
{
	if(index >= 0 && index < this.children.length)
	{
		this.children[index].removeFromStage();
		this.children.splice(index, 1);
	}
};

DisplayObjectContainer.prototype.clearAll = function()
{
	for(var index = 0; index < this.children.length; ++index)
	{
		this.children[index].removeFromStage();
	}
	
	this.children.splice(0, this.children.length);
};


////////////////////////////////////////////////////////////////////////
//over write parent methods

DisplayObjectContainer.prototype.addToStage = function(stage)
{
	if(!stage)
		return;

	DisplayObjectContainer.superClass_.addToStage.call(this, stage);
	
	for(var index = 0; index < this.children.length; ++index)
	{
		var dObj = this.children[index];
		
		if(dObj)
			dObj.addToStage(stage);
	}
};

DisplayObjectContainer.prototype.removeFromStage = function()
{
	DisplayObjectContainer.superClass_.removeFromStage.call(this);
	
	for(var index = 0; index < this.children.length; ++index)
	{
		var dObj = this.children[index];
		
		if(dObj)
			dObj.removeFromStage();
	}
};

DisplayObjectContainer.prototype.singleRender = function()
{
	DisplayObjectContainer.superClass_.singleRender.call(this);
	
	if(this.stage)
	{
		var ctx = this.stage.getRenderContext();
		
		ctx.save();
			ctx.globalAlpha *= this.alpha;
			ctx.translate(this.x, this.y);
			ctx.scale(this.scaleX, this.scaleY);
			ctx.rotate(this.rotate);
			
			for(var index = 0; index < this.children.length; ++index)
			{
				var dObj = this.children[index];
				
				dObj.singleRender();
			}
			
		ctx.restore();
	}
	/*
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.ctx.save();
		this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
		this.ctx.rotate(this.rotate);

		for(var index = 0; index < this.children.length; ++index)
		{
			var dObj = this.children[index];
			if(!dObj || !dObj.visible )
			{
				continue;
			}
			dObj.singleRender();
			
			this.ctx.save();
				this.ctx.translate(dObj.x, dObj.y);
				this.ctx.scale(dObj.scaleX, dObj.scaleY);
				this.ctx.drawImage(dObj.canvas, BOK.quickRound(-dObj.canvas.width/2), BOK.quickRound(-dObj.canvas.height/2));
			this.ctx.restore();	
		}
	this.ctx.restore();	
	*/
}


DisplayObjectContainer.prototype.render = function()
{
	DisplayObjectContainer.superClass_.render.call(this);
	
	if(this.stage)
	{
		var ctx = this.stage.getRenderContext();
		
		ctx.save();
			ctx.globalAlpha *= this.alpha;
			ctx.translate(this.x, this.y);
			ctx.scale(this.scaleX, this.scaleY);
			ctx.rotate(this.rotate);
			
			for(var index = 0; index < this.children.length; ++index)
			{
				var dObj = this.children[index];
				
				if(dObj && dObj.visible)
					dObj.render();
			}
			
		ctx.restore();
	}
	/*
	DisplayObjectContainer.superClass_.draw.call(this);
	
	//phase 1: clear redraw region
	if(this.useRedrawRegion)
	{
		//mark affected objects
		for(var index = 0; index < this.children.length; ++index)
		{
			var dObj = this.children[index];
			if(dObj && dObj.redraw)
			{
				var rr = dObj.getRedrawRegion();
				this.markRedrawChild(rr);
			}
		}
		
		//clear redraw region
		for(var index = 0; index < this.children.length; ++index)
		{
			this.ctx.save();
				this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
				this.ctx.rotate(this.rotate);
				var dObj = this.children[index];
				if(dObj && dObj.redraw)
				{
					var rr = dObj.getRedrawRegion();
					//clear redraw region
					this.ctx.save();
						this.ctx.translate(rr.x, rr.y);
						this.ctx.scale(dObj.scaleX, dObj.scaleY);
						this.ctx.clearRect(-rr.w/2, -rr.h/2, rr.w, rr.h);
					this.ctx.restore();	
				}
			this.ctx.restore();	
		}
	}
	else
	{
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	//phase 2: redraw container
	this.ctx.save();
		this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
		this.ctx.rotate(this.rotate);

		for(var index = 0; index < this.children.length; ++index)
		{
			var dObj = this.children[index];
			if(!dObj || !dObj.visible || (this.useRedrawRegion && !dObj.redraw) )
			{
				continue;
			}
			dObj.draw();
			
			this.ctx.save();
				this.ctx.globalAlpha = dObj.alpha;
				this.ctx.translate(dObj.x, dObj.y);
				this.ctx.scale(dObj.scaleX, dObj.scaleY);
				this.ctx.drawImage(dObj.canvas, BOK.quickRound(-dObj.canvas.width/2), BOK.quickRound(-dObj.canvas.height/2));
			this.ctx.restore();	
		}
	this.ctx.restore();	
	*/
};
