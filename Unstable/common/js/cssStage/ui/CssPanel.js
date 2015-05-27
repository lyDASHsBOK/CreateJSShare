/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 12-4-17
 * Time: 下午11:24
 *
 * BOK product.
 */
goog.provide("bok.cssstage.ui.CssPanel");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(CssPanel, CssDisplayObject);

/**
 * @param {String} name
 * @param {Number=} width
 * @param {Number=} height
 * @param {Number=} minWidth
 * @param {Number=} minHeight
 * */
function CssPanel(name, width, height, minWidth, minHeight)
{
	CssDisplayObject.call(this, name);
	this.panelWidth = width?width:100;
	this.panelHeight = height?height:100;
	this.minWidth = undefined != minWidth?minWidth:12;
	this.minHeight = undefined != minHeight?minHeight:12;
    this.clickable = false;
	this.maxmized_ = true;
	this.setWidth(this.panelWidth);
	this.setHeight(this.panelHeight);
	this.addClassName("CssPanel");

	//set close button, by default this button is not used.
	this.closeButton = new CssButton('closeIcon', '~');
    CssHelper.useFont(this.closeButton, 'Sosa');
	this.closeButton.addClassName('CssPanelCloseButton');
	this.closeButton.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onCloseClicked));
	this.closeButton.setVisible(false);
	this.addChild(this.closeButton);

	this.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onPanelClicked));
}

//const
CssPanel.FOLD_TIME = 0.25;
CssPanel.UNFOLD_TIME = 0.25;

////////////////////////////////////////////////////////////////////////////
//public functions

/**@public
 * */
CssPanel.prototype.showCloseButton = function()
{
	this.closeButton.setVisible(true);
};

/**@public
 * */
CssPanel.prototype.hideCloseButton = function()
{
	this.closeButton.setVisible(false);
};

/**
 * @public
 * @param {int} [startHeight]
 * @param {int} [startWidth]
 * */
CssPanel.prototype.unfold = function(startWidth, startHeight)
{
    if(this.maxmized_)
        return;

	var self = this;
	this.setWidth(startWidth?startWidth:0);
	this.setHeight(startHeight?startHeight:0);
	this.setVisible(true);
	this.maxmized_ = true;

	this.removeEventListener(Event.COMPLETE);
	this.tweenWidth(this.panelWidth, CssPanel.UNFOLD_TIME, 'ease-out');
	this.addEventListener(Event.COMPLETE, function(){
		self.removeEventListener(Event.COMPLETE);
		self.tweenHeight(this.panelHeight, CssPanel.UNFOLD_TIME, 'ease-out');

		self.addEventListener(Event.COMPLETE, function(){
			self.removeEventListener(Event.COMPLETE);
		});
	});

	this.closeButton.gotoFront();
};

/**
 * @public
 * @param {int} [minimizedHeight]
 * @param {int} [minimizeWidth]
 * Fold window with folding animation
 * */
CssPanel.prototype.fold = function(minimizeWidth, minimizedHeight)
{
	var self = this;
	var w = minimizeWidth?minimizeWidth:0;
	var h = minimizedHeight?minimizedHeight:0;
	this.maxmized_ = false;

	this.removeEventListener(Event.COMPLETE);
	this.tweenHeight(h, CssPanel.FOLD_TIME, cssStageTool.EASE_TYPE.EASE_IN);
	this.addEventListener(Event.COMPLETE, function(){
		self.removeEventListener(Event.COMPLETE);
		self.tweenWidth(w, CssPanel.FOLD_TIME, cssStageTool.EASE_TYPE.EASE_IN);

		self.addEventListener(Event.COMPLETE, function(){
			self.removeEventListener(Event.COMPLETE);
			if(!h || !w)
				self.setVisible(false);
		});
	});
};

/**
 * @public
 * Fold window with folding animation
 * */
CssPanel.prototype.minimize = function(noAnimation)
{
	if(noAnimation)
	{
		this.setWidth(this.minWidth);
		this.setHeight(this.minHeight);
		this.maxmized_ = false;
	}
	else
		this.fold(this.minWidth, this.minHeight);
};

/**
 * @public
 * Open window without animation
 * */
CssPanel.prototype.open = function()
{
	this.setWidth(this.panelWidth);
	this.setHeight(this.panelHeight);
	this.setVisible(true);
    this.maxmized_ = true;

	this.closeButton.gotoFront();
};

/**
 * @public
 * Close window without animation
 * */
CssPanel.prototype.close = function()
{
	this.setWidth(0);
	this.setHeight(0);
	this.setVisible(false);
    this.maxmized_ = false;
};

/**@override
 * */
CssPanel.prototype.setSize = function(width, height)
{
	this.panelWidth = width;
	this.panelHeight = height;

	CssPanel.superClass_.setSize.call(this, width, height);
};

/**
 * @public
 * */
CssPanel.prototype.setMinimizedSize = function(width, height)
{
	this.minWidth = width;
	this.minHeight = height;
};

/**
 * @private
 * Default minimize/unfold event listener
 * */
CssPanel.prototype.onPanelClicked = function()
{
	if(!this.clickable)
		return;

	if(!this.maxmized_)
		this.unfold(this.minWidth, this.minHeight);
	else
		this.minimize();
};

/**
 * @private
 * Default minimize/unfold event listener
 * */
CssPanel.prototype.onCloseClicked = function()
{
	this.fold();
};
