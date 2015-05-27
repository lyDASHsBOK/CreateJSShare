/**
 * @author lys.BOK
 * Date: 13-10-4
 * Time: 下午11:16
 *
 * File over view.
 */

goog.provide('miniiw.features.factoryminigame.FactoryMiniGameFeature');
goog.require("bok.framework.core.MVCFeature");

goog.require('miniiw.features.factoryminigame.view.Board');

/**
 * @class
 * @param {CssStage} stage
 * @constructor
 * @extends {MVCFeature}
 * */
miniiw.features.factoryminigame.FactoryMiniGameFeature = function(stage)
{
    MVCFeature.call(this, 'FactoryMiniGameFeature');

    this.stage_ = stage;

    this.loadSettings_(CONST.GRID_SETTINGS);
    this.initUI();

    this.homeView_ = new miniiw.features.factoryminigame.view.HomeView();
    this.homeView_.addEventListener('click', Delegate.create(this, this.onHomeClicked_));
    this.stage_.addChild(this.homeView_);

    this.homeView_.show();
};
BOK.inherits(miniiw.features.factoryminigame.FactoryMiniGameFeature, MVCFeature);

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.returnToHome = function(){
    this.gameBoard_.removeAllEventListeners();
    this.record.removeEventListener('enableViewBtn');
    this.record.removeEventListener('gridEntryUpdate');
    this.record.removeEventListener('scoreUpdate');
    this.record.removeEventListener('comboUpdate');
    this.stage_.removeChild(this.gameBoard_);
    this.homeView_.show();
};
miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.newGame = function(){
    this.homeView_.hide();

    //initial settings:
    this.stableImg_.visible = true;
    this.btnChangeView_.visible = false;
    this.reactingImg_.visible = false;
    this.comboImg_.visible = false;
    this.comboText_.text = 0;
    this.totalScoreText_.text = 0;
    this.txtReaminEntry_.text = CONST.GAME_PLAY.MAX_PLAY_TIMES;

    //model
    this.record = new miniiw.features.factoryminigame.model.Record();
    this.record.addEventListener('enableViewBtn', Delegate.create(this, this.onShowViewBtn_));
    this.record.addEventListener('gridEntryUpdate', Delegate.create(this, this.onGridEntryUpdate_));
    this.record.addEventListener('scoreUpdate', Delegate.create(this, this.onScoreUpdate_));
    this.record.addEventListener('comboUpdate', Delegate.create(this, this.onComboUpdate_));

    //view
    this.gameBoard_ = new miniiw.features.factoryminigame.view.Board(this.record);
    this.gameBoard_.set(CONST.BOARD.pos);

    this.gameBoard_.addEventListener('zoomIn', Delegate.create(this, this.boardZoomIn_));
    this.gameBoard_.addEventListener('reactingStart', Delegate.create(this, this.boardReactingStart_));
    this.gameBoard_.addEventListener('reactingStop', Delegate.create(this, this.boardReactingStop_));

    this.stage_.addChild(this.gameBoard_);
};
miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.initUI = function(){

    // add bg
    this.bg_ = new createjs.Bitmap("resource/bg/bokbg.png");
    this.bg_.x = 0;
    this.bg_.y = 0;
    this.stage_.addChild(this.bg_);

    this.topPanel_ = new createjs.Container();
    this.topPanel_.x = CONST.UI.BUTTON.CHANGE_VIEW.x;
    this.topPanel_.y = CONST.UI.BUTTON.CHANGE_VIEW.y;
    this.stage_.addChild(this.topPanel_);
    this.btnChangeView_ = new createjs.Bitmap("resource/btn/btn_break.png");
    this.btnChangeView_.addEventListener('click', Delegate.create(this, this.onViewChangeClicked_));
    this.topPanel_.addChild(this.btnChangeView_);
    this.stableImg_ = new createjs.Bitmap("resource/btn/stable.png");
    this.topPanel_.addChild(this.stableImg_);
    this.reactingImg_ = new createjs.Bitmap("resource/btn/CHAIN.png");
    this.topPanel_.addChild(this.reactingImg_);

    this.scorePanel_ = new createjs.Container();
    this.scorePanel_.set({x:500, y:186});
    this.stage_.addChild(this.scorePanel_);
    this.scoreTextAry_ = [];
    this.scoreTextAry_.MAX_DISPLAY = 6;

    this.txtReaminEntry_ = new createjs.Text(CONST.GAME_PLAY.MAX_PLAY_TIMES, "40px Impact", "#4a3c32");
    this.txtReaminEntry_.set({x:559, y:110});
    this.stage_.addChild(this.txtReaminEntry_);
    this.comboText_ = new createjs.Text(0, "36px Impact", "#fcf5d8");
    this.comboText_.set({x:586, y:162});
    this.stage_.addChild(this.comboText_);
    this.comboImg_ = new createjs.Bitmap("resource/bg/combo_bg.png");
    this.comboImg_.set({x:557, y:140});
    this.stage_.addChild(this.comboImg_);
    this.totalScoreText_ = new createjs.Text(0, "40px Impact", "#4a3c32");
    this.totalScoreText_.set({x:498, y:362});
    this.stage_.addChild(this.totalScoreText_);

    this.btnExit_ = new createjs.Bitmap("resource/btn/btn_exit.png");
    this.btnExit_.set({x:558, y:423});
    this.btnExit_.addEventListener('click', Delegate.create(this, this.onExitClicked_));
    this.stage_.addChild(this.btnExit_);
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.loadSettings_ = function(settings){
    bok.features.basicmatch3.v.components.Icon.SETTINGS = settings['ICON'];
    bok.features.basicmatch3.v.components.IconCounter.SETTINGS = settings['ICON_COUNTER'];
    bok.features.basicmatch3.v.components.DashBoard.SETTINGS = settings['DASH_BOARD'];
    bok.features.basicmatch3.v.components.GridBoard.SETTINGS = settings['GRID_BOARD'];
    bok.features.basicmatch3.v.components.MainBoard.SETTINGS = settings['MAIN_BOARD'];
};

/////////////////////////////////////Event Handler/////////////////////////////////////////
miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onComboUpdate_ = function(e){
    this.comboText_.text = e.body;
    console.log('combo update');
};
miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onScoreUpdate_ = function(e){
    this.totalScoreText_.text = this.record.data.score;
    var scoreTxt = new createjs.Text('+' + e.body, "25px Impact", "#4a3c32");
    this.scorePanel_.addChild(scoreTxt);
    createjs.Tween.get(scoreTxt).wait(2000).to({alpha:0}, 2000).call(function(){scoreTxt.parent && scoreTxt.parent.removeChild(scoreTxt)});

    this.scoreTextAry_.unshift(scoreTxt);
    BOK.each(this.scoreTextAry_, function(txt, index){
        txt.y = index * 25;
        if(index >= this.MAX_DISPLAY) {
            txt.parent && txt.parent.removeChild(txt);
        }
    });
    this.scoreTextAry_.splice(this.scoreTextAry_.MAX_DISPLAY);
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onGridEntryUpdate_ = function(){
    var remain = CONST.GAME_PLAY.MAX_PLAY_TIMES - this.record.data.enterGridTimes *5 - this.record.data.playerSwapTimes;
    remain < 0 && (remain = 0);
    if(remain <= 0){
        this.gameBoard_.shutDown();
        this.btnChangeView_.visible = true;
        this.stableImg_.visible = false;
    }

    this.txtReaminEntry_.text = remain;
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onExitClicked_ = function(){
    this.returnToHome();
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onHomeClicked_ = function(){
    this.newGame();
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onShowViewBtn_ = function(){
    this.stableImg_.visible = false;
    this.btnChangeView_.visible = true;
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.onViewChangeClicked_ = function(){
    if(this.gameBoard_.isZoomIn())
        this.gameBoard_.zoomOut();
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.boardZoomIn_ = function(){
    if(!this.gameBoard_.isGameOver)
        this.btnChangeView_.visible = false;
};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.boardReactingStart_ = function(){
    this.btnChangeView_.visible = false;
    this.stableImg_.visible = false;
    this.reactingImg_.visible = true;
    this.comboImg_.visible = true;

    if(!this.lightningEffect_){
        this.lightningEffect_ = new miniiw.features.factoryminigame.view.Effect('lightning', {isRow:true, looping:true});
        this.lightningEffect_.x += 482;
        this.lightningEffect_.y += 15;
        this.lightningEffect_.scaleY = 0.32;
        this.stage_.addChild(this.lightningEffect_);
    }

};

miniiw.features.factoryminigame.FactoryMiniGameFeature.prototype.boardReactingStop_ = function(){
    this.lightningEffect_.fadeOut();
    this.lightningEffect_ = null;
    this.stableImg_.visible = true;
    this.reactingImg_.visible = false;
    this.comboImg_.visible = false;
};

