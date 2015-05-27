//potential problems

//inherits
BOK.inherits(CanvasFrameAnim, CanvasImage);

function CanvasFrameAnim(path, frameWidth, frameHeight, interval)
{
	//alert("sub CanvasFrameAnim");
	CanvasImage.call(this, path);
    
    this.currentFrame = 0;    
    this.sourceX = 0;
    this.sourceY = 0;
	this.width = frameWidth;
	this.height = frameHeight;
	this.callBackObj = null;
	this.isLooping = true;
	this.isFinished = false;
	this.animInterval = interval ? interval : 100;
	
	//init animation timer
	try
	{
		this.timer = GlobalTicker.getTimer();
		this.callBackObj = this.timer.setCallBack(Delegate.create(this, this.nextFrame), this.animInterval);
		this.callBackObj.enable = true;
	}
	catch (err)
	{
		BOK.error("in CanvasFrameAnim.initAnim(), cannot find GlobalTicker. ");
		return;
	}
}

CanvasFrameAnim.prototype.replay = function()
{
	this.reset();
	this.play();
};

CanvasFrameAnim.prototype.play = function()
{
	if(!this.timer)
	{
		BOK.warn("in CanvasFrameAnim.play(), animation timer not initiated");
		return;
	}

	this.callBackObj.enable = true;
};

CanvasFrameAnim.prototype.stop = function()
{
	if(!this.timer)
	{
		BOK.warn("in CanvasFrameAnim.stop(), animation timer not initiated");
		return;
	}

	this.callBackObj.enable = false;
};

CanvasFrameAnim.prototype.reset = function()
{
	this.currentFrame = 0;
	this.isFinished = false;
};


CanvasFrameAnim.prototype.nextFrame = function()
{
    this.currentFrame++;
    if((this.currentFrame+1) * this.width > this.img.width)
    {
		if(this.isLooping)
			this.reset();
		else
		{
			this.stop();
			this.isFinished = true;
			this.dispatchEvent(new Event(Event.COMPLETE));
		}
    }
    else
    {
        this.sourceX = this.currentFrame * this.width;
    }
};

////////////////////////////////////////////////////////////////////////
//over write parent methods

CanvasFrameAnim.prototype.removeFromStage = function()
{
	CanvasFrameAnim.superClass_.removeFromStage.call(this);
	
	//remove frame update callback function call from timer
	if(this.timer)
		this.timer.removeCallBackObj(this.callBackObj);
};
