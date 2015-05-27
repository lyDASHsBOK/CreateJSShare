//inherits

goog.provide("bok.cssstage.CssImage");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(CssImage, CssDisplayObject);

/**
 * @param {string|Object} path
 * @param {number=} [x]
 * @param {number=} [y]
 * @param {number=} [width]
 * @param {number=} [height]
 * */
function CssImage(path, x, y, width, height)
{
	CssDisplayObject.call(this, 'CssImage');
	
	if(null == path)
	{
		BOK.error("in CssImage(), null image source.");
		return;
	}
	
	if( "string" == typeof(path) )
		this.loadImage_(path);
	else
		this.setImage(path);


	this.spriteWidth = width;
	this.spriteHeight = height;
	this.setSpritePos(x, y);
}

CssImage.EVENT = {
	IMAGE_LOADED: 'ImageLoaded'
};

CssImage.prototype.setImage = function(img)
{
	if(!img)
		return;
	
	this.img = img;
	this.onLoad();
};

CssImage.prototype.setSpritePos = function(x, y)
{
	this.spriteX = x;
	this.spriteY = y;

	if(this.spriteX !== null && this.spriteY !== null)
	{
		this.div.style.backgroundPosition = this.spriteX+"px "+this.spriteY+"px";
	}
};


CssImage.prototype.loadImage_ = function(path)
{
	if(!path)
		return;
		
	this.img = new Image();
	this.img.src = path;
	
	this.img.onload = Delegate.create(this, this.onLoad);
};

CssImage.prototype.onLoad = function()
{
	if(this.spriteWidth)
		this.setWidth(this.spriteWidth);
	else
		this.setWidth(this.img.width);

	if(this.spriteHeight)
		this.setHeight(this.spriteHeight);
	else
		this.setHeight(this.img.height);

	this.div.style.backgroundImage = "url('"+this.img.src+"')";
	this.div.style.backgroundRepeat = "no-repeat";

	cssStageTool.requestAnimationFrame(Delegate.create(this, this.dispatchEvent,
		new Event(CssImage.EVENT.IMAGE_LOADED)));
};
