//inherits
BOK.inherits(CanvasImage, DisplayObject);

function CanvasImage(path)
{
	if(null == path)
	{
		BOK.error("in CanvasImage(), null image source.");
		return;
	}
	
	//alert("sub CanvasImage");
	DisplayObject.call(this);
	
	this.sourceX = 0;
	this.sourceY = 0; 
	this.width = 0;
	this.height = 0;
	
	if( "string" == typeof(path) )
		this.loadImage_(path);
	else
		this.setImage(path);
}

CanvasImage.prototype.setImage = function(img)
{
	if(!img)
		return;
	
	this.img = img;
	this.onLoad();
};


CanvasImage.prototype.loadImage_ = function(path)
{
	if(!path)
		return;
		
	this.img = new Image();
	this.img.src = path;	
	
	this.img.onLoad = this.onLoad();
};

CanvasImage.prototype.onLoad = function()
{
	this.width = this.img.width;
	this.height = this.img.height;
};

////////////////////////////////////////////////////////////////////////
//over write parent methods
CanvasImage.prototype.render = function()
{
	CanvasImage.superClass_.render.call(this);
	
	if(!this.img)
		return;
	
	if(this.stage)
	{
		var ctx = this.stage.getRenderContext();
		
		ctx.save();
			ctx.globalAlpha *= this.alpha;
			ctx.translate(this.x, this.y);
			ctx.scale(this.scaleX, this.scaleY);
			ctx.rotate(this.rotate);
			
			//using HTML5 drawImage function drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
			ctx.drawImage(this.img,this.sourceX, this.sourceY, this.width, this.height, BOK.quickRound(-this.width/2), BOK.quickRound(-this.height/2), this.width, this.height);
		ctx.restore();
	}
};
