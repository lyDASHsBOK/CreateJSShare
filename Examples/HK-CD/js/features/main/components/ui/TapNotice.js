/**
 * Created by xinyiliu on 3/19/15.
 */
goog.provide("hkcd.features.main.components.ui.TapNotice");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");

BOK.inherits(TapNotice, createjs.Container);
function TapNotice() {
    createjs.Container.call(this);

    this.currentFrame_ = BOK.randN(TapNotice.MAX_FRAME);

    this.inner_ = new createjs.Shape();
    this.base_ = new createjs.Shape();
    this.base_.graphics.beginFill('rgba(255, 255, 255, 0.01)').drawCircle(0, 0, 42);


    this.addChild(this.base_);
    this.addChild(this.inner_);

    createjs.Ticker.addEventListener("tick", Delegate.create(this, this.update_));
}

TapNotice.MAX_FRAME = 60;

TapNotice.prototype.update_ = function() {
    if(this.currentFrame_++ > TapNotice.MAX_FRAME)
        this.currentFrame_ = 0;

    var percent = this.currentFrame_ / TapNotice.MAX_FRAME;
    var opacity = 1 - percent;
    this.inner_.graphics.clear();
    this.inner_.graphics.setStrokeStyle(3).beginStroke('rgba(255, 255, 255, '+opacity+')').drawCircle(0, 0, 20 + 17 * percent);
    this.inner_.graphics.setStrokeStyle(1).beginStroke('rgba(255, 255, 255, '+opacity+')').drawCircle(0, 0, 25 + 17 * percent);
    this.inner_.graphics.beginFill('rgba(255, 255, 255, 0.75)').drawCircle(0, 0, 15);
};
