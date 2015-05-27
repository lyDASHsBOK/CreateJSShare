/**
 * Created by Envee.
 * Date: 14-8-12
 * Time: 下午3:57
 * Author: <mail>526597516@qq.com</mail>
 */
goog.provide("bok.apps.preloader.components.BlueCanvasSkin");
goog.require("bok.apps.preloader.interfaces.IPreloaderSkin");
goog.require("bok.Delegate");

goog.require("org.createjs.easeljs.EaselJS");
goog.require("org.createjs.tweenjs.TweenJS");

BOK.inherits(BlueCanvasSkin, createjs.Container);
BOK.implement(BlueCanvasSkin, IPreloaderSkin);

/**
 * @override
 * @param {createjs.Bitmap} loadingBG loading background pg
 * @param {string=} barColor (optional) loading background color in format 'rgba(255,255,255,0.8)'
 */
function BlueCanvasSkin(loadingBG, barColor)
{
    createjs.Container.call(this);
    this.loadingBar_ = null;
    this.skinReadyCallback = null;
    this.displayFinishCallback = null;
    this.BAR_HEIGHT = 21;
    this.BAR_WIDTH = 500;
    this.bars_ = [];
    this.entities_= [];
    this.PERCENT_PER_BAR = 1;
    this.loadingBarColor = barColor || 'rgba(255,255,255,0.8)';

    this.addChild(loadingBG);
}

/** @override
 * @param {number} loadingPercentage
 * */
BlueCanvasSkin.prototype.update = function(loadingPercentage)
{
    if(loadingPercentage > 100)
        loadingPercentage = 100;
    var TOTAL_BARS_NUM = 100 / this.PERCENT_PER_BAR;
    var BAR_WIDTH = this.BAR_WIDTH / TOTAL_BARS_NUM;
    var fullBarNum = Math.floor(loadingPercentage / this.PERCENT_PER_BAR);
    var completeBarPercent = loadingPercentage % this.PERCENT_PER_BAR;
    var lastBarIndex = this.bars_.length-1;

    this.removeChild(this.bars_[lastBarIndex]);
    var completeWidth = 0;
    for(var i = lastBarIndex; i < fullBarNum; ++i)
    {
        this.bars_[i] = true;

        var per1 = new createjs.Shape();
        if(i == 0){
            per1.graphics.beginFill(this.loadingBarColor).drawRoundRectComplex(150 + i * BAR_WIDTH, 250 + 2, BAR_WIDTH , this.BAR_HEIGHT - 4, 5, 0, 0, 5);
        }else if(i == 99 ){
            per1.graphics.beginFill(this.loadingBarColor).drawRoundRectComplex(150 + i * BAR_WIDTH, 250 + 2, BAR_WIDTH , this.BAR_HEIGHT - 4, 0, 5, 5, 0);
        }else{
            per1.graphics.beginFill(this.loadingBarColor).drawRect(150 + i * BAR_WIDTH, 250 + 2, BAR_WIDTH , this.BAR_HEIGHT - 4);
        }
        this.addChild(per1);
        this.entities_.push(per1);
    }


    this.bars_[i] = new createjs.Shape();
    this.bars_[i].graphics.beginFill(this.loadingBarColor).drawRoundRectComplex(150 + i * BAR_WIDTH , 250 + 2, BAR_WIDTH  * completeBarPercent / this.PERCENT_PER_BAR + 2 , this.BAR_HEIGHT - 4, 0, 5, 5, 0);
    this.addChild(this.bars_[i]);
    if(loadingPercentage == 100){
        this.removeChild(this.bars_[i]);
    }
};

/**
 * @override
 * */
BlueCanvasSkin.prototype.finish = function()
{
    this.update(100);

    createjs.Tween.get(this).wait(1000).to({alpha:0}, 500).call(Delegate.create(this, this.skinDisplayFinish));
};

/**
 * @override
 * */
BlueCanvasSkin.prototype.displayStart = function()
{
    this.loadingBar_= new createjs.Shape();
    this.loadingBar_.graphics.beginStroke("#C8C5C3").drawRoundRectComplex(150 - 2, 250, this.BAR_WIDTH + 4, this.BAR_HEIGHT, 5, 5, 5, 5 );

    //this.stage.setVisible(true);

    //this.addChild(this.loadingBar_);

    this.bars_[0] = new createjs.Shape();
    this.bars_[0].graphics.beginFill(this.loadingBarColor).drawRoundRectComplex(150 , 250 + 2, 2 , this.BAR_HEIGHT - 4, 5, 0, 0, 5);
    this.addChild(this.bars_[0]);
    this.skinReadyCallback();
};

/**
 * @override
 * */
BlueCanvasSkin.prototype.regSkinReadyCallback = function(callback)
{
    this.skinReadyCallback = callback;
};

/**
 * @override
 * */
BlueCanvasSkin.prototype.regSkinFinishCallback = function(callback)
{
    this.displayFinishCallback = callback;
};

/**
 * @override
 * */
BlueCanvasSkin.prototype.dismiss = function()
{
};

/**
 * @private
 * */
BlueCanvasSkin.prototype.skinDisplayFinish = function()
{
    this.removeAllChildren();
    this.bars_ = [];
    this.entities_ = [];
    this.displayFinishCallback();
};
