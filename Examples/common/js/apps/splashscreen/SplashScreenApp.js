/**
 * @fileoverview
 * //TODO: write file description here
 *
 * @author xliu
 * Date: 12/06/13
 * Time: 14:20
 */
goog.provide("bok.apps.splashscreen.SplashScreenApp");
goog.require("bok.framework.App");

goog.require("org.createjs.easeljs.EaselJS");
goog.require("org.createjs.tweenjs.TweenJS");

BOK.inherits(SplashScreenApp, App);

SplashScreenApp.DISPLAY_TEXT = 'lys';

/**
 * @param {Element|createjs.Stage} stage
 * */
function SplashScreenApp(stage)
{
	App.call(this);

    if(stage instanceof createjs.Stage)
    {
        this.stage_ = new createjs.Container();
        stage.addChild(this.stage_);
        this.width_ = stage.canvas.width;
        this.height_ = stage.canvas.height;
    }
    else
    {
        var canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        stage.appendChild(canvas);
        this.stage_ = new createjs.Stage(canvas);
        this.stageUpdateFunc_ = Delegate.create(this.stage_, this.stage_.update);
        createjs.Ticker.setFPS(40);
        createjs.Ticker.addEventListener("tick", this.stageUpdateFunc_);
        this.width_ = canvas.width;
        this.height_ = canvas.height;
    }

	var base = new createjs.Shape();
	base.graphics.beginFill('rgba(255,255,255,1)').drawRect(0, 0, this.width_, this.height_);
	this.stage_.addChild(base);
	this.stage_.addEventListener('click', Delegate.create(this, this.finish_));

}

SplashScreenApp.TEXT_X = 155;
SplashScreenApp.TEXT_Y = 140;

/**
 * @override
 * */
SplashScreenApp.prototype.start = function()
{
	SplashScreenApp.superClass_.start.call(this);

	this.show_();
};


/**
 * @private
 * */
SplashScreenApp.prototype.show_ = function()
{
	var textRect = {x:320, y:60};
	var back = new createjs.Shape();
	back.graphics.beginFill('rgba(255,255,255,1)').drawRoundRect(SplashScreenApp.TEXT_X, SplashScreenApp.TEXT_Y, textRect.x, textRect.y, 10);
	back.alpha = 0;
	var text = new createjs.Text(SplashScreenApp.DISPLAY_TEXT, "60px Arial", "#000000");
	text.x = SplashScreenApp.TEXT_X;
	text.y = SplashScreenApp.TEXT_Y;
	text.alpha = 0;

    var that = this;
	var stage = this.stage_;
	var spawnSpeed = 1;
	var dotCount = 0;
	var finishFunc = Delegate.create(this, this.finish_);
	this.spawnFunc = function(){
		if(spawnSpeed > 30)
		{
			stage.addChild(back);
			createjs.Tween.get(back).wait(1000).
				to({alpha:1}, 1500, createjs.Ease.cubicIn).
				call(function(){
					stage.addChild(text);
					createjs.Tween.get(text).wait(100).to({alpha:1}, 500).
						wait(500).to({alpha:0}, 1000, createjs.Ease.cubicOut).call(finishFunc);
				}
			);
            createjs.Ticker.removeEventListener("tick", that.spawnFunc);
			return;
		}

		var randX, randY;
		for(var i=0; i<spawnSpeed; ++i)
		{
			do
			{
				randX = Math.random()*textRect.x;
				randY = Math.random()*textRect.y;
			}while(!text.hitTest(randX, randY));

			var dot = new createjs.Shape();
			var color = 'rgba(0,0,'+(BOK.randN(100)+155)+',0.7)';
			//var color = 'rgba('+BOK.randN(255)+', '+BOK.randN(255)+', '+BOK.randN(255)+', 1)';
			dot.graphics.beginFill(color).drawCircle(0, 0, BOK.randN(2)+2);
			dot.x = Math.random()*that.width_;
			dot.y = Math.random()*that.height_;
			stage.addChild(dot);
			createjs.Tween.get(dot).to({x:text.x + randX, y:text.y + randY}, 1000,createjs.Ease.bounceOut);
			dotCount++;
		}
		spawnSpeed = Math.ceil(dotCount/50);
	};
	createjs.Ticker.addEventListener("tick", this.spawnFunc);
};

/**
 * @private
 * */
SplashScreenApp.prototype.finish_ = function()
{
    if(this.finished_)
        return;

    this.finished_ = true;
    if(this.stageUpdateFunc_)
	    createjs.Ticker.removeEventListener('tick', this.stageUpdateFunc_);
    createjs.Ticker.removeEventListener("tick", this.spawnFunc);
	createjs.Tween.removeAllTweens();
	this.stage_.removeAllChildren();
	this.dispatchEvent(new Event(Event.COMPLETE));
};
