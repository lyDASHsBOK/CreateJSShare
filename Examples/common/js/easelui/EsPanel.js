/**
 * @author lys.BOK
 * Date: 14-3-7
 * Time: 下午11:40
 *
 * File over view.
 */
goog.provide("bok.easelui.EsPanel");
goog.require("bok.easelui.EsUIComponent");
goog.require("org.createjs.easeljs.EaselJS");
goog.require("bok.util.EaselAnimationHelper");

BOK.inherits(EsPanel, EsUIComponent);
/**
 * @param {Number} width
 * @param {Number} height
 * @param {Object=} options Panel init options.
 *
 * @constructor
 * */
function EsPanel(width, height, options)
{
    EsUIComponent.call(this);
    var panelOptions = {
        useDefaultShowHideAnim: true,
        useDefaultCloseButton: true,
        border: 0,
        bgColor: 'rgba(150,150,150,0.3)',
        borderColor: '#000'
    };

    //load custom settings
    for(var key in options)
    {
        //noinspection JSUnfilteredForInLoop
        panelOptions[key] = options[key];
    }

    this.options_ = panelOptions;
    this.width = width;
    this.height = height;

    this.panel_ = new createjs.Shape();
    this.panel_.graphics.beginFill(panelOptions.bgColor).drawRect(0, 0, width, height);
    if(panelOptions.border)
    {
        var bSize = panelOptions.border;
        this.panel_.graphics.beginFill(panelOptions.borderColor).drawRect(-bSize, -bSize, width+bSize*2, bSize);
        this.panel_.graphics.beginFill(panelOptions.borderColor).drawRect(-bSize, height, width+bSize*2, bSize);
        this.panel_.graphics.beginFill(panelOptions.borderColor).drawRect(-bSize, -bSize, bSize, height+bSize*2);
        this.panel_.graphics.beginFill(panelOptions.borderColor).drawRect(width, -bSize, bSize, height+bSize*2);
    }
    this.addChild(this.panel_);

    if(panelOptions.useDefaultCloseButton)
    {
        this.closeButton_ = new SosaIcon(SosaIcon.ICON.CROSS, 20);
        this.closeButton_.x = this.width - this.closeButton_.width;
        this.addChild(this.closeButton_);
        this.closeButton_.addEventListener(Event.CLICK, Delegate.create(this, this.onDefaultCloseButtonClicked_));
    }
}

EsPanel.prototype.show = function()
{
    if(this.options_.useDefaultShowHideAnim)
    {
        this.visible = true;
        createjs.Tween.get(this).to({scaleX: 1, scaleY: 1}, 500, createjs.Ease.bounceOut);
    }

    EsPanel.superClass_.show.call(this);
};
EsPanel.prototype.hide = function()
{
    if(this.options_.useDefaultShowHideAnim)
    {
        createjs.Tween.get(this).to({scaleX: 0, scaleY: 0}, 500, createjs.Ease.bounceOut)
            .call(Delegate.create(this, function(){this.visible = false}));
    }

    EsPanel.superClass_.hide.call(this);
};

/**
 * @private
 * */
EsPanel.prototype.onDefaultCloseButtonClicked_ = function()
{
    this.hide();
};
