/**
 * Created by xinyiliu on 3/14/15.
 */
goog.provide("hkcd.features.main.components.Player");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");


BOK.inherits(Player, createjs.Container);
function Player(isGirl) {
    createjs.Container.call(this);

    var playerImg = isGirl ? 'assets/img/femaleRun.png' : 'assets/img/maleRun.png';

    this.root_ = new createjs.Container();
    this.addChild(this.root_);

    this.dust_ = new createjs.Bitmap('assets/img/dust.png');
    this.dust_.set({x: -60, y:209, alpha: 0});
    this.isMoving = false;
    this.isBouncing_ = false;
    var sheet = new createjs.SpriteSheet({
        framerate: 7,
        images: [playerImg],
        frames: {width:CONST.PLAYER.FRAME_WIDTH, height:CONST.PLAYER.FRAME_HEIGHT},
        animations: {run:[0,5]}
    });
    this.anim_ = new createjs.Sprite(sheet, 'run');
    this.anim_.x = -CONST.PLAYER.FRAME_WIDTH/2;
    this.anim_.gotoAndStop(6);
    this.img_ = new createjs.Container();
    this.img_.addChild(this.anim_);

    this.shadow_ = new createjs.Bitmap('assets/img/shadow.png');
    this.shadow_.set({x: -CONST.PLAYER.FRAME_WIDTH/2 + 40, y: CONST.PLAYER.FRAME_HEIGHT - 30});


    this.root_.addChild(this.img_);
    this.root_.addChild(this.dust_);
    this.root_.addChild(this.shadow_);

    createjs.Ticker.addEventListener("tick", Delegate.create(this, this.update));
    this.addEventListener('click', Delegate.create(this, this.onClicked));
}

Player.prototype.turnLeft = function() {
    this.root_.scaleX = -1;
};

Player.prototype.turnRight = function() {
    this.root_.scaleX = 1;
};

Player.prototype.move = function() {
    this.anim_.gotoAndPlay('run');
    this.isMoving = true;
};

Player.prototype.stop = function() {
    this.anim_.gotoAndStop(6);
    this.isMoving = false;
};

Player.prototype.onClicked = function() {
    if(!this.isMoving) {
        this.move();
        setTimeout(Delegate.create(this, function () {
            this.stop();
        }), 400);
    }
};

Player.prototype.update = function() {
    if((!this.isMoving && !this.img_.y) || this.isBouncing_)
        return;

    var self = this;
    if(this.img_.y) {
        EaselAnimationHelper.moveTo(this.img_, 0, 0, CONST.PLAYER.BOUNCE_ANIM_DURATION).call(function(){
            self.isBouncing_ = false;
        });
    } else {
        this.dust_.set({alpha:1, scaleX: 1, scaleY: 1, x:-60});
        createjs.Tween.get(this.dust_).to({alpha:0, scaleX: 1.5, scaleY: 1.5, x:-100}, 400, createjs.Ease.cubicOut);
        EaselAnimationHelper.moveTo(this.img_, 0, -CONST.PLAYER.BOUNCE_HEIGHT, CONST.PLAYER.BOUNCE_ANIM_DURATION).call(function(){
            self.isBouncing_ = false;
        });
    }
    this.isBouncing_ = true;
};

