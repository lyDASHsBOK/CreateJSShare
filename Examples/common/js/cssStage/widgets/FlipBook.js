/**
 * @fileoverview
 * @author: lys
 * Date: 12-11-4
 * Time: 下午7:51
 *
 * BOK Code.
 */
goog.provide("bok.cssstage.widgets.FlipBook");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(FlipBook, CssDisplayObject);

function FlipBook(name)
{
	CssDisplayObject.call(this, name);

	//view init
	this.backpage = new CssDisplayObject('backpage');
	this.addChild(this.backpage);
	this.uppage = new CssDisplayObject('uppage');
	this.uppage.div.addEventListener('webkitTransitionEnd', Delegate.create(this, this.onFlipComplete));
	this.addChild(this.uppage);
	this.downpage = new CssDisplayObject('downpage');
	this.downpage.div.addEventListener('webkitTransitionEnd', Delegate.create(this, this.onBackFlipComplete));
	this.downpage.addClassName('pageFliped');
	this.addChild(this.downpage);
	this.addClassName('book3DBase');

	//logic control init
	/** @type {Array} array of {CssDisplayObject}*/
	this.pages = [];
	this.currentPageNumber = -1;
	this.flipInProgress = false;
}

FlipBook.PAGE_FLIP_TIME = 700;

FlipBook.EVENT = {
	FLIP_COMPLETE: 'FlipComplete',
	BACK_FLIP_COMPLETE: 'BackFlipComplete'
};

/**
 * @public
 * */
FlipBook.prototype.isFlipInProgress = function()
{
	return this.flipInProgress;
};

/**
 * @public
 * */
FlipBook.prototype.clearBook = function()
{
	this.pages = [];
	this.backpage.clearAll();
	this.uppage.clearAll();
	this.downpage.clearAll();
};

/**
 * @param {int} pageNum
 * @public
 * */
FlipBook.prototype.flipToPage = function(pageNum)
{
	if(!this.flipInProgress && 0 <= pageNum && pageNum < this.pages.length && pageNum != this.currentPageNumber)
	{
		this.currentPageNumber = pageNum;
		this.backpage.clearAll();
		this.backpage.addChild(this.pages[this.currentPageNumber]);
		this.flip();
	}
};

/**
 * @param {int} pageNum
 * @public
 * */
FlipBook.prototype.backFlipToPage = function(pageNum)
{
	if(!this.flipInProgress && 0 <= pageNum && pageNum < this.pages.length && pageNum != this.currentPageNumber)
	{
		this.currentPageNumber = pageNum;
		this.downpage.clearAll();
		this.downpage.addChild(this.pages[this.currentPageNumber]);
		this.backFlip();
	}
};

/**
 * @public
 * */
FlipBook.prototype.backFlipOnePage = function()
{
	this.backFlipToPage(this.currentPageNumber - 1);

};


/**
 * @public
 * */
FlipBook.prototype.flipOnePage = function()
{
	this.flipToPage(this.currentPageNumber + 1);
};


/**
 * Event listener
 * @private
 * */
FlipBook.prototype.onFlipComplete = function()
{
	this.whenFlipComplete();
	this.dispatchEvent(new Event(FlipBook.EVENT.FLIP_COMPLETE));
};

/**
 * Event listener
 * @private
 * */
FlipBook.prototype.onBackFlipComplete = function()
{
	this.whenFlipComplete();
	this.dispatchEvent(new Event(FlipBook.EVENT.BACK_FLIP_COMPLETE));
};

/**
 * @private
 * */
FlipBook.prototype.whenFlipComplete = function()
{
	this.uppage.clearAll();
	this.uppage.removeClassName('page3DBase');
	this.uppage.removeClassName('pageFliped');
	this.downpage.clearAll();
	this.downpage.removeClassName('page3DBase');
	this.downpage.addClassName('pageFliped');
	this.backpage.clearAll();

	this.uppage.addChild(this.pages[this.currentPageNumber]);
	this.flipInProgress = false;
};

/**
 * @private
 *
 * @return {CssDisplayObject}
 * */
FlipBook.prototype.addPage = function()
{
	this.pages.push(new CssDisplayObject('page '+this.pages.length));

	//if this is the 1st page add to book, put as up page directly
	if(1 == this.pages.length)
	{
		this.uppage.clearAll();
		this.uppage.addChild(this.pages[0]);
		this.currentPageNumber = 0;
	}

	return this.pages[this.pages.length - 1];
};

/**
 * @private
 * */
FlipBook.prototype.flip = function()
{
	this.flipInProgress = true;
	this.uppage.addClassName('page3DBase');
	this.uppage.addClassName('pageFliped');
};

/**
 * @private
 * */
FlipBook.prototype.backFlip = function()
{
	this.flipInProgress = true;
	this.downpage.addClassName('page3DBase');
	this.downpage.removeClassName('pageFliped');
};



