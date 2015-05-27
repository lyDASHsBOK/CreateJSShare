/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 18/03/14
 * Time: 16:47
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.easelui.EsUIComponent");
goog.require("org.createjs.easeljs.EaselJS");


BOK.inherits(EsUIComponent, createjs.Container);

/**
 * UI base class, all Es UI derives from this class.
 * Handle all UI common base action/operations.
 * @constructor
 * */
function EsUIComponent()
{
    createjs.Container.call(this);

    /** @type {Array} UI components that share the show/hide state with this UI*/
    this.linkedUIComponents_ = [];

    /** @type {Array} UI components that has its show/hide state mutually exclusive with this UI*/
    this.mutuallyExclusiveUIComponents_ = [];

    /** @type {boolean}*/
    this.isHide_ = false;
}

/**
 * @return {boolean}
 * */
EsUIComponent.prototype.isHide = function()
{
    return this.isHide_;
};
/**
 * @param {EsUIComponent}
 * */
EsUIComponent.prototype.link = function(component)
{
    var existed = false;
    BOK.each(this.linkedUIComponents_, function(com){
        if(com == component)
            existed = true;
    });

    if(!existed)
    {
        this.linkedUIComponents_.push(component);
    }
};

/**
 * @param {EsUIComponent}
    * */
EsUIComponent.prototype.mutuallyExclude = function(component)
{
    var existed = false;
    BOK.each(this.mutuallyExclusiveUIComponents_, function(com){
        if(com == component)
            existed = true;
    });

    if(!existed)
    {
        this.mutuallyExclusiveUIComponents_.push(component);
        component.mutuallyExclude(this);
    }
};

EsUIComponent.prototype.hide = function()
{
    if(!this.isHide_)
    {
        this.isHide_ = true;
        BOK.each(this.linkedUIComponents_, function(com){
            com.hide();
        });

        //in a 1-on-1 mutually exclusive system it will trigger flickering
        if(1 == this.mutuallyExclusiveUIComponents_.length)
            this.mutuallyExclusiveUIComponents_[0].show();
    }
};

EsUIComponent.prototype.show = function()
{
    if(this.isHide_)
    {
        this.isHide_ = false;
        var showDelay = 0;
        BOK.each(this.linkedUIComponents_, function(com){
            setTimeout(Delegate.create(com, com.show), showDelay);
            showDelay += 200;
        });

        BOK.each(this.mutuallyExclusiveUIComponents_, function(com){
            com.hide();
        });
    }
};


