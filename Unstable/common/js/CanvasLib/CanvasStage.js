//inherits
BOK.inherits(CanvasStage, DisplayObjectContainer);

function CanvasStage(canvas)
{
	//alert("sub CanvasStage");
	DisplayObjectContainer.call(this);
	
	if(!canvas)
	{
		BOK.trace("ERROR: null canvas object in CanvasStage");
		return;
	}
	
	//setup canvas
	this.canvas = canvas;		
	this.ctx = this.canvas.getContext('2d');
	
	//set stage
	this.stage = this;
	
	//setup rendering flag
	this.isRendering = false;
	
	//setup stage tweener
	this.tweener = new Tweener();
}

CanvasStage.prototype.startRender = function()
{
    BOK.trace("CanvasStage.prototype.startRender");
	this.isRendering = true;
	this.render();
};

CanvasStage.prototype.stopRender = function()
{
	this.isRendering = false;
};

CanvasStage.prototype.getRenderContext = function()
{
	return this.ctx;
};


////////////////////////////////////////////////////////////////////////
//over write parent methods
CanvasStage.prototype.singleRender = function()
{
	//clear stage
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	CanvasStage.superClass_.singleRender.call(this);
};


CanvasStage.prototype.render = function()
{
	//clear stage
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.ctx.save()
		this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
		CanvasStage.superClass_.render.call(this);
	this.ctx.restore()
	
	//TODO: use a more general approach for updating
	if(this.isRendering)
		BOK.requestAnimationFrame(Delegate.create(this, this.render));
};
