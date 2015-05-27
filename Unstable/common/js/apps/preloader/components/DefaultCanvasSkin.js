/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 06/03/14
 * Time: 15:41
 * To change this template use File | Settings | File Templates.
 */
goog.provide("bok.apps.preloader.components.DefaultCanvasSkin");
goog.require("bok.apps.preloader.interfaces.IPreloaderSkin");
goog.require("bok.Delegate");

goog.require("org.createjs.easeljs.EaselJS");

BOK.inherits(DefaultCanvasSkin, createjs.Container);
BOK.implement(DefaultCanvasSkin, IPreloaderSkin);

function DefaultCanvasSkin()
{
    createjs.Container.call(this);
    
    this.skinReadyCallback = null;
    this.displayFinishCallback = null;

    this.BAR_HEIGHT = 21;
    this.BAR_WIDTH = 500;

    this.bars_ = [];
    this.entities_ = [];
    this.PERCENT_PER_BAR = 1;
}

/**
 * @override
 * @param {number} loadingPercentage 1-100
 * */
DefaultCanvasSkin.prototype.update = function(loadingPercentage)
{
    if(loadingPercentage > 100)
        loadingPercentage = 100;

    var TOTAL_BAR_NUM = 100 / this.PERCENT_PER_BAR;
    var BAR_WIDTH = this.BAR_WIDTH/TOTAL_BAR_NUM;
    var fullBarNum = Math.floor(loadingPercentage / this.PERCENT_PER_BAR);
    var incompleteBarPercent = loadingPercentage % this.PERCENT_PER_BAR;
    var lastBarIndex = this.bars_.length-1;

    this.removeChild(this.bars_[lastBarIndex]);

    for(var i = lastBarIndex; i < fullBarNum; ++i)
    {
        this.bars_[i] = true;

        var s1 = new createjs.Shape();
        var s2 = new createjs.Shape();
        var s3 = new createjs.Shape();
        s1.graphics.beginFill('rgba(212,177,92,1)').drawRect(50 + i * BAR_WIDTH, 400, BAR_WIDTH - 1, this.BAR_HEIGHT/3);
        s2.graphics.beginFill('rgba(212,177,92,1)').drawRect(50 + i * BAR_WIDTH, 400+this.BAR_HEIGHT/3, BAR_WIDTH - 1, this.BAR_HEIGHT/3);
        s3.graphics.beginFill('rgba(212,177,92,1)').drawRect(50 + i * BAR_WIDTH, 400+this.BAR_HEIGHT*2/3, BAR_WIDTH - 1, this.BAR_HEIGHT/3);
        this.addChild(s1);
        this.addChild(s2);
        this.addChild(s3);
        this.entities_.push(s1);
        this.entities_.push(s2);
        this.entities_.push(s3);
    }

    this.bars_[i] = new createjs.Shape();
    this.bars_[i].graphics.beginFill('rgba(212,177,92,1)').drawRect(50 + i * BAR_WIDTH, 400, BAR_WIDTH * incompleteBarPercent / this.PERCENT_PER_BAR, this.BAR_HEIGHT);
    this.addChild(this.bars_[i]);
};

/**
 * @override
 * */
DefaultCanvasSkin.prototype.finish = function()
{
    this.update(100);

    var that = this;
    createjs.Tween.get(this).wait(600).to({alpha:0}, 300).to({alpha:1}, 300)
        .to({alpha:0}, 200).to({alpha:1}, 200)
        .to({alpha:0}, 100).to({alpha:1}, 100)
        .to({alpha:0}, 50).to({alpha:1}, 50)
        .to({alpha:0}, 50).to({alpha:1}, 50)
        .to({alpha:0}, 50).to({alpha:1}, 50)
        .call(function(){
            for(i=0; i<that.entities_.length; ++i)
                createjs.Tween.get(that.entities_[i]).to({x:BOK.randN(400)-200,y:BOK.randN(400)-300, alpha:0}, 1200);
            createjs.Tween.get(that.entities_[0]).wait(1500).call(Delegate.create(this, this.skinDisplayFinish));
        });
};

/**
 * */
DefaultCanvasSkin.prototype.displayStart = function()
{
    //this.stage.setVisible(true);
    this.bars_[0] = new createjs.Shape();

    this.bars_[0].graphics.beginFill('rgba(212,177,92,1)').drawRect(50, 400, 1, this.BAR_HEIGHT);
    this.addChild(this.bars_[0]);

    //there is no preparation in default skin so send ready straight away
    //when skin starts to display
    this.skinReadyCallback();
};

/**
 * */
DefaultCanvasSkin.prototype.dismiss = function()
{
    //this.stage.setVisible(false);
};

/**
 * */
DefaultCanvasSkin.prototype.regSkinReadyCallback = function(callback)
{
    this.skinReadyCallback = callback;
};

/**
 * */
DefaultCanvasSkin.prototype.regSkinFinishCallback = function(callback)
{
    this.displayFinishCallback = callback;
};

/**
 * @private
 * */
DefaultCanvasSkin.prototype.skinDisplayFinish = function()
{
    this.removeAllChildren();
    this.bars_ = [];
    this.entities_ = [];
    this.displayFinishCallback();
};

