/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:29
 *
 */
goog.provide("bok.features.basicmatch3.v.components.Icon");
goog.require("org.createjs.easeljs.EaselJS");

/**
 * @param {number} type Type of icon.
 * */
bok.features.basicmatch3.v.components.Icon = function(x, y, type, front)
{
    createjs.Container.call(this);

    this.type = type;
    this.gridPos_ = {x:x, y:y};
    this.selected_ = false;

    //the maximum color type coverage for this algorithm is 12
    //well a normal match 3 game should never exceeds this barrier
    var base = Math.floor(type / 3);
    var plus = type % 3;
    var r = 205 - (base + (plus > 0)) * 50;
    var g = 205 - (base + (plus > 1)) * 50;
    var b = 205 - base * 50;
    var color = 'rgba('+r+','+g+','+b+',1)';

    var SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;
    //this.icon_ = new createjs.Shape();
    //this.icon_.graphics.beginFill(color).drawRoundRect(0, 0,
    //    SETTINGS.WIDTH, SETTINGS.HEIGHT, SETTINGS.ROUND_CORNER);

    this.icon_ = new createjs.Container();
    var iconb =  new createjs.Bitmap("resource/icon/icon_"+type+".png");
    this.icon_.addChild(iconb);

    this.icon_f = new createjs.Bitmap("resource/icon/icon_f_"+type+".png");
    this.icon_.addChild(this.icon_f);
    this.icon_f.visible = front;
    this.addChild(this.icon_);
};
BOK.inherits(bok.features.basicmatch3.v.components.Icon, createjs.Container);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.Icon.SETTINGS = {};

bok.features.basicmatch3.v.components.Icon.prototype.getGridX = function()
{
    return this.gridPos_.x;
};
bok.features.basicmatch3.v.components.Icon.prototype.getGridY = function()
{
    return this.gridPos_.y;
};

bok.features.basicmatch3.v.components.Icon.prototype.moveToGridPos = function(x, y)
{
    this.gridPos_.x = x;
    this.gridPos_.y = y;
};
bok.features.basicmatch3.v.components.Icon.prototype.isSelected = function()
{
    return this.selected_;
};

bok.features.basicmatch3.v.components.Icon.prototype.selectIcon = function()
{
    if(!this.selected_)
        EaselAnimationHelper.standOut(this.icon_, 5, bok.features.basicmatch3.v.components.Icon.SETTINGS.ANIMATION_LENGTH);
    this.selected_ = true;
};

bok.features.basicmatch3.v.components.Icon.prototype.releaseIcon = function()
{
    if(this.selected_)
        EaselAnimationHelper.putDown(this.icon_, bok.features.basicmatch3.v.components.Icon.SETTINGS.ANIMATION_LENGTH);
    this.selected_ = false;
};
