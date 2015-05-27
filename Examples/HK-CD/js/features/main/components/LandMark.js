/**
 * Created by xinyiliu on 3/7/15.
 */

goog.provide("hkcd.features.main.components.LandMark");
goog.require("org.createjs.easeljs.EaselJS");

BOK.inherits(LandMark, createjs.Container);
function LandMark(name) {
    createjs.Container.call(this);

    if(name)
        this.img_ = new createjs.Bitmap(imgContainer['assets/img/'+name+'.png']);
    else
        this.img_ = new createjs.Bitmap(imgContainer['assets/img/boc.png']);
    this.img_.set({x:-this.img_.image.width/2, y:-this.img_.image.height + (name?15:-25)});
    var node = new createjs.Container();
    node.set({scaleX:1.3, scaleY:1.3});
    node.addChild(this.img_);

    this.pointer_ = new createjs.Bitmap(imgContainer['assets/img/land-pointer.png']);
    this.pointer_.set({x: -20, y: -450, scaleX:1.6, scaleY:1.6});

    this.notice_ = new TapNotice();
    this.notice_.set({x: 50, y:-150});

    this.addChild(node);
    this.addChild(this.notice_);
    this.addChild(this.pointer_);

    this.update();
}



LandMark.prototype.showMarks = function() {
    this.showPointer();
    this.showTapNotice();
};

LandMark.prototype.hideMarks = function() {
    this.hidePointer();
    this.hideTapNotice();
};

LandMark.prototype.showPointer = function() {
    this.pointer_.visible = true;
};
LandMark.prototype.hidePointer = function() {
    this.pointer_.visible = false;
};
LandMark.prototype.showTapNotice = function() {
    EaselAnimationHelper.fadeIn(this.notice_);
};

LandMark.prototype.hideTapNotice = function() {
    EaselAnimationHelper.disappear(this.notice_);
};

LandMark.prototype.update = function() {
    if(this.pointer_.y < -450)
        EaselAnimationHelper.moveTo(this.pointer_, -20, -450, 500).call(Delegate.create(this, this.update));
    else {
        EaselAnimationHelper.moveTo(this.pointer_, -20, -500, 500).call(Delegate.create(this, this.update));
    }
};
