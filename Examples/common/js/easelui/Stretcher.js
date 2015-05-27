/**
 * Created by lys.
 * User: Liu Xinyi
 * Date: 14-8-5
 * Time: 下午5:25
 * Write the description in this section.
 */
goog.provide("bok.easelui.Stretcher");

goog.require('bok.BOK');
goog.require("org.createjs.easeljs.EaselJS");
goog.require("org.createjs.tweenjs.TweenJS");

BOK.inherits(Stretcher, createjs.Container);

function Stretcher(canvasDom, defaultWidth, defaultHeight, bgColor, FPSColor) {
    createjs.Container.call(this);

    this.dWidth_ = defaultWidth || canvasDom.width;
    this.dHeight_ = defaultHeight || canvasDom.height;

    this.canvasDom = canvasDom;
    this.stage = new createjs.Stage(canvasDom);
    this.stage.addChild(this);

    this.base_ = new createjs.Shape();
    this.base_.graphics.beginFill(bgColor || 'rgba(0, 0, 0, 1)').drawRect(0, 0, this.dWidth_, this.dHeight_);
    this.addChild(this.base_);

    this.fps_ = new createjs.Text('', "25px Arial bold", FPSColor || "#FFFFFF");
    this.stage.addChild(this.fps_);

    //stage setup
    createjs.Ticker.setFPS(40);
    createjs.Ticker.addEventListener("tick", Delegate.create(this, this.update_));
    createjs.Touch.enable(this.stage);

    this.layout_();

    window.addEventListener('resize', Delegate.create(this, this.onWindowResize_));
}


Stretcher.prototype.onWindowResize_ = function() {
    if(this.timeoutId_)
        clearTimeout(this.timeoutId_);

    this.timeoutId_ = setTimeout(Delegate.create(this, function(){
        this.layout_();
        this.timeoutId_ = null;
    }), 500);
};

Stretcher.prototype.hideFPS = function() {
    this.fps_.visible = false;
};

Stretcher.prototype.showFPS = function() {
    this.fps_.visible = true;
};

Stretcher.prototype.update_ = function(e) {
    this.stage.update(e);
    if(this.fps_.visible){
        var now = new Date().getTime();
        if(this.then_ && !this.showFpsInterval_--){
            this.fps_.text = 'FPS: ' + Math.ceil(1000 / (now - this.then_));
            this.showFpsInterval_ = 20;
        }
        this.then_ = now;
    }
};
Stretcher.prototype.layout_ = function() {
    //give 2 px space to prevent scroll bar
    var wWidth = window.innerWidth - 2;
    var wHeight = window.innerHeight - 2;

    var scaleX = wWidth / this.dWidth_;
    var scaleY = wHeight / this.dHeight_;
    var scale = scaleX < scaleY ? scaleX : scaleY;
    var cWidth = this.dWidth_ * scale;
    var cHeight = this.dHeight_ * scale;

    this.canvasDom.width = cWidth;
    this.canvasDom.height = cHeight;
    this.canvasDom.style.left = (wWidth - cWidth) / 2 + 'px';
    this.canvasDom.style.top = (wHeight - cHeight) / 2 + 'px';
    this.set({scaleX: scale, scaleY: scale, x:0, y:0 });
};

