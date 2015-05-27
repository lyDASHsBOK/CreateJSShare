function TimerCallBack(delegateCallback, triggerInterval)
{
	this.delegateCallback = delegateCallback;
	
	if(triggerInterval)
		this.triggerInterval = triggerInterval;
	else
		this.triggerInterval = 100;
		
	this.timeThen = 0;
	this.enable = false;
}

TimerCallBack.prototype.triggerCallBack = function()
{
	if(this.delegateCallback)
		this.delegateCallback.call();
};

function Timer(interval)
{
	if(interval)
		this.triggerInterval = interval;
	else
		this.triggerInterval = 20;
	this.timeNow = 0;
	this.intervalID = 0;
	
	this.callBackQueue = new Array;
}

Timer.prototype.setCallBack = function(delegateCallback, triggerInterval)
{	
	var callBackObj = new TimerCallBack(delegateCallback, triggerInterval);
	this.callBackQueue.push(callBackObj);
	return callBackObj;
};

Timer.prototype.removeCallBackObj = function(callBackObj)
{
	for(var i=0; i < this.callBackQueue.length; i++ )
	{
		if(this.callBackQueue[i] == callBackObj)
		{
			this.callBackQueue.splice(i, 1);
			return;
		}
	}
};

Timer.prototype.stop = function()
{
	if(this.intervalID)
		clearInterval(this.intervalID);
		
	this.intervalID = null;
};

Timer.prototype.start = function()
{
	if(!this.intervalID)
	{
		this.timeNow = 0;
		var ticker = this;
		this.intervalID = setInterval(function(){ticker.tick();}, this.triggerInterval);
	}
	else
	{
		BOK.warn("Warning in Timer.start(), timer already started");
	}
};

Timer.prototype.tick = function()
{
	this.timeNow = (new Date()).getTime();
	for(var i in this.callBackQueue)
	{
		var curCallBack = this.callBackQueue[i];
		if(!curCallBack || !curCallBack.enable)
			continue;
			
		if(this.timeNow - curCallBack.timeThen >= curCallBack.triggerInterval)
		{
			curCallBack.triggerCallBack();
			curCallBack.timeThen = this.timeNow;
		}
	}
};
