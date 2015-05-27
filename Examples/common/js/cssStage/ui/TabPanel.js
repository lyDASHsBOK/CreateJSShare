/**
/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 05/04/12
 * Time: 16:28
 *
 */
goog.provide("bok.cssstage.ui.TabPanel");
goog.require("bok.cssstage.CssDisplayObject");


BOK.inherits(TabPanel, CssDisplayObject);


function TabPanel(name)
{
	CssDisplayObject.call(this, name);

	//setup tab button group
	this.tabButtons = new CssDisplayObject("tabButtonGroup");
	this.addChild(this.tabButtons);
	//setup page group
	this.pages = new CssDisplayObject("pageContainer");
	this.addChild(this.pages);
	//setup tab scroller
	this.cornerButtonLeft = this.createCornerButton('leftCorner', '⇦');
	this.cornerButtonLeft.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onLeftCornerClicked));
	this.cornerButtonRight = this.createCornerButton('rightCorner', '⇨');
	this.cornerButtonRight.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onRightCornerClicked));

	this.targetPage = null;
	this.currentPage = null;
	this.currentHeadTab = 0;
	this.pageDisplayTabNumber = 0;

	//setting
	this.settings = {
		tab : {
			size : {w:70, h:17}
		},
		page : {
			size : {w:370, h:240}
		}
	};
}

TabPanel.BORDER_SIZE = 1;
TabPanel.CORNER_WIDTH = 20;

//////////////////////////////////////////////////////////////////////////////////////////
//public functions
/**
 * @param {string} name Page name
 * @return {CssDisplayObject} the page object
 * */
TabPanel.prototype.getPage = function(name)
{
	return this.pages.getChildByName(name);
};

/**
 * @param {string} name Page name
 * @param {string} label Page tab label
 * @return {CssDisplayObject} the page object
 * */
TabPanel.prototype.addPage = function(name, label)
{
	if(!label) label = name;

	if(this.tabButtons.getChildByName(name))
	{
		BOK.warn("in TabPanel.prototype.addPage: page with name ["+name+"] already exist.");
		return this.getPage(name);
	}


	var button = new CssButton(name, label);
	button.setType(CssButton.VIEW_TYPE.BUMP_UP);
	button.setHeight(this.settings.tab.size.h);
	button.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onTabClicked));
	this.tabButtons.addChild(button);

	var page = new CssDisplayObject(name);
	page.div.className = 'TabPanelPage';
	page.setWidth(this.settings.page.size.w);
	page.setHeight(this.settings.page.size.h);
	this.initPageView(page);
	this.pages.addChild(page);

	if(this.currentPage === null)
		this.selectPage(name);
	else
		page.setVisible(false);

	this.layout();

	return page;
};

TabPanel.prototype.setPageTabSize = function(minWidth, height)
{
	this.settings.tab.size.w = minWidth;
	this.settings.tab.size.h = height;
};

TabPanel.prototype.setPageContentSize = function(width, height)
{
	this.settings.page.size.w = width;
	this.settings.page.size.h = height;

	this.layout();
};

/**@public
 * @param {string} name The name of page to select
 * @return {boolean} if page cannot be selected return false
 * */
TabPanel.prototype.selectPage = function(name)
{
	var tab = this.tabButtons.getChildByName(name);
	var page = this.pages.getChildByName(name);
	var panel = this;

	if(tab && page)
	{
		//reset all
		this.tabButtons.eachChild(function(child){
			panel.unselectTab(child);
		});
		this.pages.eachChild(function(child){
			child.setVisible(false);
		});

		//set current page
		this.currentPage = name;
		panel.selectTab(tab);
		page.setVisible(true);
		return true;
	}
	else
		return false;
};

TabPanel.prototype.removePage = function(name)
{
	this.tabButtons.removeChild(this.tabButtons.getChildByName(name));
	this.pages.removeChild(this.pages.getChildByName(name));
	this.layout();
};

//////////////////////////////////////////////////////////////////////////////////////////
//private functions
TabPanel.prototype.layout = function()
{
	var pageWidth = this.settings.page.size.w;
	var buttonCount = this.pages.numChild;
	var buttonWidth = pageWidth/buttonCount;

	//tab updates
	var tabSize = this.settings.tab.size;
	var numOfChild = 0;
	var cornerWidth = 0;
	if(buttonWidth < tabSize.w)
	{
		//place corner button
		this.cornerButtonLeft.setVisible(true);
		this.cornerButtonLeft.setX(0);
		this.cornerButtonRight.setVisible(true);
		this.cornerButtonRight.setX(pageWidth - TabPanel.CORNER_WIDTH);

		//get actual tab width
		var useableWidth = pageWidth - TabPanel.CORNER_WIDTH*2;
		this.pageDisplayTabNumber = Math.floor(useableWidth/tabSize.w);
		buttonWidth =useableWidth / this.pageDisplayTabNumber;
		cornerWidth = TabPanel.CORNER_WIDTH;

		this.useIndexAsHeadTab(this.currentHeadTab);
	}
	numOfChild = 0;
	this.tabButtons.eachChild(function(child){
		child.setWidth(buttonWidth - TabPanel.BORDER_SIZE * 2);
		child.setHeight(tabSize.h);
		child.setX(cornerWidth + numOfChild * (buttonWidth));
		numOfChild++;
	});

	//page update
	var pageSize = this.settings.page.size;
	numOfChild = 0;
	this.pages.eachChild(function(child){
		child.setWidth(pageSize.w);
		child.setHeight(pageSize.h);
	});

	//set page group Y position
	this.pages.setY(this.settings.tab.size.h);
};

TabPanel.prototype.createCornerButton = function(name, symbol)
{
	var button = new CssButton(name, symbol);
	button.setWidth(TabPanel.CORNER_WIDTH);
	button.setType(CssButton.VIEW_TYPE.BUMP_UP);
	button.setVisible(false);
	this.addChild(button);

	return button;
};

TabPanel.prototype.useIndexAsHeadTab = function(index)
{
	var MAX_INDEX = this.tabButtons.numChild - this.pageDisplayTabNumber;
	if(index < 0 || index > MAX_INDEX)
		return;

	this.currentHeadTab = index;

	var numOfChild = 0;
	var tabPanel = this;
	this.tabButtons.eachChild(function(child){
		var childDisplayPos = numOfChild - tabPanel.currentHeadTab;
		if(childDisplayPos < 0 || childDisplayPos > tabPanel.pageDisplayTabNumber-1)
			child.setVisible(false);
		else
			child.setVisible(true);
		child.setX(TabPanel.CORNER_WIDTH + childDisplayPos * (child.width + TabPanel.BORDER_SIZE*2));
		numOfChild++;
	});

	this.cornerButtonLeft.enable();
	this.cornerButtonRight.enable();
	if(0 == index)
		this.cornerButtonLeft.disable();
	else if(index == MAX_INDEX)
		this.cornerButtonRight.disable();
};

//base view function, may be overrided
TabPanel.prototype.selectTab = function(tab)
{
	tab.disable();
	tab.div.style.border = TabPanel.BORDER_SIZE+"px solid";
};
//base view function, may be overrided
TabPanel.prototype.unselectTab = function(tab)
{
	tab.enable();
	tab.div.style.border = "";
};
//base view function, may be overrided
TabPanel.prototype.initPageView = function(page)
{
	page.div.innerHTML = "<p>Content of:</p><p>"+page.name+"</p>";
	page.div.style.border = TabPanel.BORDER_SIZE+"px dashed";
};
//////////////////////////////////////////////////////////////////////////////////////////
//event listeners functions
TabPanel.prototype.onTabClicked = function(e)
{
	var targetPage = e.target.name;
	//donothing if selected current page
	if(targetPage == this.currentPage)
		return;

	var panel = this;
	panel.targetPage = targetPage;

	if(this.pages.alpha > 0)
	{
		this.pages.fadeOut(0.3);
		this.pages.addEventListener(Event.COMPLETE, function(){
			panel.selectPage(panel.targetPage);
			panel.pages.fadeIn(0.5);
			panel.pages.removeEventListener(Event.COMPLETE);
			panel.dispatchEvent(new Event(Event.SELECTED, targetPage));
		});
	}
	else
	{
		this.selectPage(panel.targetPage);
		this.pages.fadeIn(0.5);
		this.pages.removeEventListener(Event.COMPLETE);
	}

};

TabPanel.prototype.onLeftCornerClicked = function()
{
	this.useIndexAsHeadTab(this.currentHeadTab-1);
};

TabPanel.prototype.onRightCornerClicked = function()
{
	this.useIndexAsHeadTab(this.currentHeadTab+1);
};
