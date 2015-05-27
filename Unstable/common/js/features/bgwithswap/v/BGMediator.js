
BOK.inherits(BGMediator, BaseMediator);

function BGMediator(bg, assetsDef)
{
	BaseMediator.call(this, "BGMediator");
	
	this.BGLocked = false;
	this.bgIMGs = {};
	this.connectNote = null;        //note which will be sent after BG animation finish
	this.bgNode = new CssStage(bg);
	
	this.backLayer = new CssDisplayObject();
	this.bgNode.addChild(this.backLayer);

	var firstAsset = null;
	for(var index in assetsDef)
	{
		this.bgIMGs[index] = new CssImage(assetsDef[index]) ;
		if(!firstAsset)
			firstAsset = index;
	}
	
	//add initial BG
	this.newBG = null;
	this.curBG = this.bgIMGs[firstAsset];
	this.curBGName = firstAsset;
	this.bgNode.addChild(this.curBG);

	this.declareInterest(BGWithSwapFeature.notes.DISPLAY_VIEW_CHANGE, this.onDisplayViewChange);
}

BGMediator.BG_FADE_IN_TIME = 0.6;
BGMediator.BG_FADE_OUT_TIME = 0.8;


//////////////////////////////////////////////////////////////////////////////////////
//note listeners
/**
 * @param {Object} msg Expecting msg format:
 *      {
 *          bgName:name,
 *          connectNote:note
 *      }
 * */
BGMediator.prototype.onDisplayViewChange = function(msg)
{
	var bg = msg.body.bgName;
	this.connectNote = msg.body.connectNote;
	this.switchBG(bg);
};

////////////////////////////////////////////////////////////////////////////////////////////////////////
//private functions
BGMediator.prototype.switchBG = function(name)
{
	if(!this.bgIMGs[name] || this.BGLocked || this.bgIMGs[name] == this.curBG)
		return;


	this.BGLocked = true;
	
	this.newBG = this.bgIMGs[name];
	this.curBGName = name;
	
	this.backLayer.addChild(this.newBG);
	this.newBG.fadeIn(BGMediator.BG_FADE_IN_TIME);
	
	this.curBG.fadeOut(BGMediator.BG_FADE_OUT_TIME);
	this.curBG.moveToX(this.curBG.width, BGMediator.BG_FADE_OUT_TIME );
	
	this.curBG.addEventListener(Event.COMPLETE, Delegate.create(this,this.switchToBGFinish));
};

BGMediator.prototype.switchToBGFinish = function()
{
	this.curBG.removeEventListener(Event.COMPLETE);
	this.curBG.setX(0);

	this.bgNode.removeChild(this.curBG);
	this.backLayer.removeChild(this.newBG);
	
	this.bgNode.addChild(this.newBG);
	
	this.curBG = this.newBG;
	this.newBG = null;
	this.BGLocked = false;

	this.sendNotification(BGWithSwapFeature.notes.WHEN_BG_SWAP_COMPLETE, this.curBGName);
	if(this.connectNote)
	{
		this.sendFullPathNotification(this.connectNote);
		this.connectNote = null;
	}
};
