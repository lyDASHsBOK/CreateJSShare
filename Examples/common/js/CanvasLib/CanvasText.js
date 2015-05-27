//inherits
BOK.inherits(CanvasText, DisplayObject);


function CanvasText(text, size, color, font, bold, italic)
{
	//alert("sub CanvasText");
	DisplayObject.call(this);
	
	//basic setting
	this.text = text;
	this.size = size ? size : 12;
	this.color = color ? color : "#000000";
	this.font = font ? font : "Arial";
	this.bold = bold;
	this.italic = italic;

	//font style setting
	this.textAlign = "center";
	this.textBaseline = "middle";
	this.showBoarder = false;
}


////////////////////////////////////////////////////////////////////////
//over write parent methods
CanvasText.prototype.render = function()
{
	CanvasText.superClass_.render.call(this);
	
	if(this.stage)
	{
		var ctx = this.stage.getRenderContext();

		
		ctx.save();
			ctx.font = (this.bold?"bold ":"")+(this.italic?"italic ":"")+this.size+"px "+this.font;
			ctx.fillStyle = this.color;
			ctx.textAlign = this.textAlign;
			ctx.textBaseline = this.textBaseline;
			
			ctx.globalAlpha *= this.alpha;
			ctx.translate(this.x, this.y);
			ctx.scale(this.scaleX, this.scaleY);
			ctx.rotate(this.rotate);
			
			//render text
			ctx.fillText(this.text, 0, 0);
			
			//draw boarder if needed
			if(this.showBoarder)
			{
				var textWidth = ctx.measureText(this.text).width;
				var textHeight = this.size;
				ctx.strokeRect(-textWidth/2, -textHeight/2, textWidth, textHeight);
			}
		ctx.restore();
	}
};
