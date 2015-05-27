/**
 * Created by xinyiliu on 3/14/15.
 */
goog.provide("hkcd.features.main.components.MoveButton");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");


BOK.inherits(MoveButton, createjs.Container);
function MoveButton(isLeftBtn) {
    createjs.Container.call(this);
    this.btnImg_ = new createjs.Bitmap('assets/img/arrow.png');
    this.btnImg_.set({regX: 110, regY: 110, rotation: isLeftBtn?90:-90, scaleX: 0.7, scaleY: 0.7});

    this.addChild(this.btnImg_);
    this.update();
}

MoveButton.prototype.update = function() {
    if(this.btnImg_.x)
        EaselAnimationHelper.moveTo(this.btnImg_, 0, 0, 300).call(Delegate.create(this, this.update));
    else {
        EaselAnimationHelper.moveTo(this.btnImg_, this.btnImg_.rotation > 0 ? 30 : -30, 0, 300).call(Delegate.create(this, this.update));
    }
};
