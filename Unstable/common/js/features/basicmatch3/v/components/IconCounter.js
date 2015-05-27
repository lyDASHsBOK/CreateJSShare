/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:32
 *
 */
goog.provide("bok.features.basicmatch3.v.components.IconCounter");

goog.require("bok.util.EaselAnimationHelper");
goog.require("bok.features.basicmatch3.v.components.Icon");


/**
 * @param {number} type Type of icon.
 * */
bok.features.basicmatch3.v.components.IconCounter = function(type)
{
    createjs.Container.call(this);

    /** @public
     * @type {number}*/
    this.iconCount_ = 0;

    /** @private*/
    this.icon_ = new bok.features.basicmatch3.v.components.Icon(-1, -1, type);
    this.addChild(this.icon_);

    this.plusNumber_ = new createjs.Text("+ 0", "30px Arial bold", "#000000");
    this.plusNumber_.alpha = 0;
    this.iconCounter_ = new createjs.Text("X 0", "20px Arial bold", "#000000");
    this.iconCounter_.set(bok.features.basicmatch3.v.components.IconCounter.SETTINGS.TEXT_POS);

    this.addChild(this.iconCounter_);
    this.addChild(this.plusNumber_);
};
BOK.inherits(bok.features.basicmatch3.v.components.IconCounter, createjs.Container);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.IconCounter.SETTINGS = {};

bok.features.basicmatch3.v.components.IconCounter.prototype.getIconCount = function()
{
    return this.iconCount_;
};

bok.features.basicmatch3.v.components.IconCounter.prototype.setIconCount = function(count)
{
    this.iconCount_ = count;
    this.iconCounter_.text = 'X '+this.iconCount_;
};
bok.features.basicmatch3.v.components.IconCounter.prototype.reset = function()
{
    this.setIconCount(0);
};

bok.features.basicmatch3.v.components.IconCounter.prototype.addIconCount = function(count, suppressAnimation)
{
    this.setIconCount(this.iconCount_ + count);

    if(!suppressAnimation)
    {
        createjs.Tween.get(this).
            to({alpha:0}, 300, createjs.Ease.bounceOut).
            to({alpha:1}, 600, createjs.Ease.bounceOut);

        this.plusNumber_.text = '+ ' + count;
        this.plusNumber_.alpha = 1;
        this.plusNumber_.y = bok.features.basicmatch3.v.components.IconCounter.SETTINGS.PLUS_TEXT_FLOAT_HEIGHT;
        EaselAnimationHelper.moveTo(this.plusNumber_, 0, -10, 300).to({alpha: 0}, 900);
    }
};