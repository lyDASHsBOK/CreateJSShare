function TweenObj(obj, att, start, end, duration, type, delegateCallBack)
{
	this.displayObj = obj;				//the relevant displayObjct for this tween animation, used to set obj redraw. normally it is tween obj
	this.obj = obj;						//tween obj
	this.att = att;						//the attribute need to be tweened
	this.start = start;					//start value
	this.end = end;						//end value
	this.duration = duration;			//tween animation duration
	this.delegateCallBack = delegateCallBack;
	
	this.elapse = 0;
	if(TweenObj.ANIM_TYPE_EASEOUT == type)
	{
		this.type = type;
		this.acc = 2*(end-start)/(duration*duration);
	}
}

TweenObj.ANIM_TYPE_EASEOUT = "easeout";

TweenObj.prototype.invokeCallback = function()
{
	if(this.delegateCallBack)
	{
		this.delegateCallBack.call();
	}
};

function Tweener()
{
	try
	{
		this.timer = GlobalTicker.getTimer();
	}
	catch (err)
	{
		BOK.error("in Tweener(), cannot find GlobalTicker. ");
		return;
	}
		
	var renderCallBack = this.timer.setCallBack(Delegate.create(this, this.update), -1);		//-1 trigger interval meaning utilise every tick in timer.
	renderCallBack.enable = true;
	
	this.tweens = new Array;
}

Tweener.prototype.addTween = function(obj, att, start, end, duration, type, delegateCallBack)
{
	if(!obj)
		return;
	
	obj[att] = start;
	var newTween = new TweenObj(obj, att, start, end, duration, type, delegateCallBack);
	this.tweens.push(newTween);
	
	return newTween;
};

Tweener.prototype.addDelayedCallback = function(duration, delegateCallBack)
{
	var newTween = new TweenObj(null, null, null, null, duration, null, delegateCallBack);
	this.tweens.push(newTween);
	
	return newTween;
};

Tweener.prototype.update = function()
{
	var timerInterval = this.timer.triggerInterval;
	
	for(var i=0; i<this.tweens.length; i++)
	{
		var tweenObj = this.tweens[i];
		if(!tweenObj)
			continue;
		
		if(tweenObj.obj)
		{
			//Tween the object
			var newValue = 0;
			switch(tweenObj.type)
			{
				case TweenObj.ANIM_TYPE_EASEOUT:
					newValue = (tweenObj.acc*(tweenObj.duration-tweenObj.elapse))*timerInterval + tweenObj.obj[tweenObj.att];
					break;
				default:
					newValue = (tweenObj.end-tweenObj.start)*timerInterval/tweenObj.duration + tweenObj.obj[tweenObj.att];
			}
				
			var bReachTarget = (tweenObj.end-tweenObj.start)>0 ? newValue>=tweenObj.end : newValue<=tweenObj.end;
			if( bReachTarget || tweenObj.elapse > tweenObj.duration )
			{
				tweenObj.obj[tweenObj.att] = tweenObj.end;
				
				//remove tween only if timer runs out
				if(tweenObj.elapse > tweenObj.duration)
				{
					//remove tween
					this.tweens.splice(i, 1);
					i--;
					
					//invoke callback if have
					tweenObj.invokeCallback();
				}
			}
			else
			{
				tweenObj.obj[tweenObj.att] = newValue;
			}
		}
		else
		{
			if( tweenObj.elapse > tweenObj.duration )
			{
				//remove tween
				this.tweens.splice(i, 1);
				i--;
				
				//invoke callback if have
				tweenObj.invokeCallback();
			}			
		}
		
		//update elapse timer
		tweenObj.elapse += timerInterval;
		
		//if display object have draw(), set its redraw to true
		if(tweenObj.displayObj && tweenObj.displayObj.draw)
			tweenObj.displayObj.setRedraw(true);
	}
};
