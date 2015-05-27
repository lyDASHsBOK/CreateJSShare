//Singleton class GloabelTicker

var GlobalTicker = (function()
{
	var timer = new Timer(20);		//default trigger interval 20 ms
		
		
	//public functions
	return {
		getTimer : function()
		{
			return timer;
		},
			
		start : function()
		{
			timer.start();
		},
		
		stop : function()
		{
			timer.stop();
		},
			
		setTickerCallback : function(callcack, interval)
		{
			return timer.setCallBack(callcack, interval);
		}		
	};
})();