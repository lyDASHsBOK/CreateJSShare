/**
 * Created by xinyiliu on 3/15/15.
 */
goog.provide("hkcd.features.main.components.BottomMap");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");
goog.require("hkcd.features.main.components.ui.SelectDot");



BOK.inherits(BottomMap, createjs.Container);
function BottomMap() {
    createjs.Container.call(this);

    this.standingPos_ = 0;
    this.dots_ = [];
}

BottomMap.prototype.selectPlace = function(number) {
    this.standingPos_ = number;
    BOK.each(this.dots_, function(place){
        place.dot.release();
    });

    this.dots_[number].dot.select();
};

BottomMap.prototype.canMoveRight = function() {
    return this.standingPos_ > 0;
};
BottomMap.prototype.canMoveLeft = function() {
    return this.standingPos_ < this.dots_.length-1;
};
BottomMap.prototype.moveRight = function() {
    if(this.canMoveRight()) {
        this.selectPlace(this.standingPos_-1);
        BOK.each(this.dots_[this.standingPos_].connectingDots, function(item, i){
            EaselAnimationHelper.disappear(item, 600, (this.length - i - 1) * 400);
        });
        return true;
    } else {
        return false;
    }
};

BottomMap.prototype.moveLeft = function() {
    if(this.canMoveLeft()) {
        BOK.each(this.dots_[this.standingPos_].connectingDots, function(item, i){
            EaselAnimationHelper.fadeIn(item, 600, i * 400);
        });
        this.selectPlace(this.standingPos_+1);
        return true;
    } else {
        return false;
    }
};

BottomMap.prototype.addDot = function(name, noTrail) {
    var place = new createjs.Container();
    place.x = this.dots_.length * 140;
    place.y = -(this.dots_.length % 2) * 170;

    place.dot = new SelectDot();
    place.dot.set({x: -3, y: -6, scaleX: 1.7, scaleY:1.7});
    place.addChild(place.dot);

    place.text = new createjs.Text(name, "40px Arial bold", '#FFFFFF');
    place.text.set({x: 40, y: -7});
    place.addChild(place.text);

    if(!noTrail) {
        place.connectingDots = [];
        for (var i = 0; i < 5; ++i) {
            var baseDot = new createjs.Shape();
            var coverDot = new createjs.Shape();
            baseDot.graphics.beginFill('rgba(100, 100, 100, 1)').drawCircle(10, 10, 10);
            coverDot.graphics.beginFill('rgba(200, 200, 40, 1)').drawCircle(10, 10, 10);

            baseDot.x = coverDot.x = 35 + i * 20;
            baseDot.y = coverDot.y = (37 + i * 24) * (this.dots_.length % 2 ? 1 : -1);
            place.connectingDots.push(coverDot);
            place.connectingDots[i].alpha = 0;
            place.addChild(baseDot);
            place.addChild(coverDot);
        }
    }

    this.dots_.push(place);
    this.addChild(place);
};
