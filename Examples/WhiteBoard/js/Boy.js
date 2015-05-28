/**
 * Created by xinyiliu on 5/28/15.
 */

BOK.inherits(Boy, createjs.Container);
function Boy() {
    createjs.Container.call(this);

    var sheet = new createjs.SpriteSheet({
        framerate: 7,
        images: ['img/maleRun.png'],
        frames: {width:148, height:256},
        animations: {run:[0,5]}
    });
    this.sprite = new createjs.Sprite(sheet, 'run');
    this.sprite.x = this.sprite.regX = 79;

    this.addChild(this.sprite);
    this.stop();
}

Boy.prototype.run = function(){
    this.sprite.gotoAndPlay(0);
};

Boy.prototype.stop = function(){
    this.sprite.gotoAndStop(2);
};

Boy.prototype.turn = function(){
    this.sprite.scaleX = -this.sprite.scaleX;
};

Boy.prototype.move = function(){
    this.run();

    var theSprite = this.sprite;
    var self = this;
    (function animateFunc() {
        createjs.Tween.get(self.sprite).
            to({x: BOK.randN(400)+400}, 1200).
            call(function () {self.stop(); }).
            wait(800).
            call(function(){self.turn();self.run();}).
            to({x: 100}, 1000).
            call(function () {self.turn();}).
            call(animateFunc);
    })();
};

