/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 21/02/14
 * Time: 21:05
 * To change this template use File | Settings | File Templates.
 */

goog.provide("bok.cssstage.ui.PopPanel");
goog.require("bok.cssstage.ui.CssPanel");

/**
 * @param {String} name
 * @param {Number=} width
 * @param {Number=} height
 * @param {String=} dockingSide default docking on left
 * */
function PopPanel(name, width, height, dockingSide)
{
    CssPanel.call(this, name, width, height, 0, 0);

    this.dockingSide_ = dockingSide ? dockingSide : PopPanel.DOCK_SIDE.LEFT;
    this.expanded_ = true;

    this.addClassName("PopPanel");
    this.triggerButton_ = new CssButton('popButton', 'j');
    CssHelper.useFont(this.triggerButton_, 'Sosa', '30px');
    this.triggerButton_.setX(this.width);
    this.triggerButton_.addEventListener(Event.MOUSE.CLICK, Delegate.create(this, this.onTriggerClicked_));
    this.addChild(this.triggerButton_);
}
BOK.inherits(PopPanel, CssPanel);

PopPanel.DOCK_SIDE = {
    LEFT: 'left',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom'
};


PopPanel.prototype.onTriggerClicked_ = function()
{
    if(this.expanded_)
    {
        this.moveToX(-this.width, 0.5, cssStageTool.EASE_TYPE.BOUNCE_PULL_DOWN);
        this.triggerButton_.setAlpha(0.2);
    }
    else
    {
        this.moveToX(0, 0.5, cssStageTool.EASE_TYPE.BOUNCE_PULL_DOWN);
        this.triggerButton_.setAlpha(1);
    }

    this.expanded_ = !this.expanded_;
};

