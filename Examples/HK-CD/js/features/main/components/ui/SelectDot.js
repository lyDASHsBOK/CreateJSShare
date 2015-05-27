/**
 * Created by xinyiliu on 3/15/15.
 */
goog.provide("hkcd.features.main.components.ui.SelectDot");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");

BOK.inherits(SelectDot, createjs.Container);
function SelectDot() {
    createjs.Container.call(this);

    this.base_ = new createjs.Bitmap('assets/img/dotBase.png');
    this.inner_ = new createjs.Bitmap('assets/img/dotInner.png');
    this.inner_.set({x: 5, y: 5, visible: false});
    this.addChild(this.base_);
    this.addChild(this.inner_);
}


SelectDot.prototype.select = function() {
    this.inner_.visible = true;
};

SelectDot.prototype.release = function() {
    this.inner_.visible = false;
};

