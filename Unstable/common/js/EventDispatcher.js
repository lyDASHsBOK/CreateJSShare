goog.provide('bok.EventDispatcher');
goog.require('bok.event.Event');
goog.require('bok.BOK');


function EventDispatcher()
{
	this.listeners = {};
}

/**
 * @param {string} eventStr
 * @param {Function} callBack
 * */
EventDispatcher.prototype.addEventListener = function(eventStr, callBack)
{
	if(!this.listeners[eventStr])
	{
		this.listeners[eventStr] = new Array();
	}
	
	this.listeners[eventStr].push(callBack);
};

/**
 * @public
 * @param {String} eventStr
 * @param {Function=null} [func]
 * */
EventDispatcher.prototype.removeEventListener = function(eventStr, func)
{
	var listenerQueue = this.listeners[eventStr];
	
	if(listenerQueue)
	{
		if(func)
		{
			BOK.each(listenerQueue, function(listener, index){
				if(func == listener)
				{
					listenerQueue.splice(index, 1);
					return 'break';
				}
			});
		}
		else
			listenerQueue.splice(0, listenerQueue.length);
	}
};

/**
 * @param {Event} event
 * */
EventDispatcher.prototype.dispatchEvent = function(event)
{
	event.target = this;
	var listenerQueue = this.listeners[event.name];

	if(listenerQueue)
	{
		for(var i=0; i < listenerQueue.length; ++i)
			listenerQueue[i].call(this, event);
	}
};
