//inherits

goog.provide("bok.cssstage.CssStage");
goog.require("bok.cssstage.CssDisplayObject");

BOK.inherits(CssStage, CssDisplayObject);

/**
 * @param {Element} stageDivElement
 * @param {string=} name
 * */
function CssStage(stageDivElement, name)
{
    var stageName = name || 'unnamedStage';
	//alert("sub CssStage");
	CssDisplayObject.call(this, stageName);
	
	if(stageDivElement)
	{
		//setup to use external stage dev element if given
		this.div = stageDivElement;
        this.setName(stageName);
	}
	
	//set stage
	this.stage = this;
}
