/**
 * Created by xinyiliu on 3/15/15.
 */
goog.provide("hkcd.features.main.v.MainStageMediator");
goog.require('bok.framework.core.BaseMediator');

goog.requireAll('hkcd.features.main.components.*');


BOK.inherits(MainStageMediator, BaseMediator);
function MainStageMediator(stage) {
    BaseMediator.call(this);

    this.stage_ = new createjs.Container();
    stage.addChild(this.stage_);
}

MainStageMediator.prototype.init = function(player, place) {
    this.sceneName_ = place;
    this.isZoomin_ = false;
    this.isZooming_ = false;
    this.isUIHidden_ = false;

    this.uiLayer_ = new createjs.Container();
    this.uiLayer_.alpha = 0;

    this.btmMap_ = new BottomMap();
    this.btmMap_.set({x: 50, y: 1280, alpha:0});
    this.btmMap_.addDot(this.getPlaceName(0));
    this.btmMap_.addDot(this.getPlaceName(1));
    this.btmMap_.addDot(this.getPlaceName(2));
    this.btmMap_.addDot(this.getPlaceName(3));
    this.btmMap_.addDot(this.getPlaceName(4), true);
    this.btmMap_.selectPlace(0);

    this.player_ = player;
    this.bg_ = new CloseBG(this.player_);
    this.bg_.set({y:CONST.BG.Y});

    this.btnGoLeft_ = new MoveButton(true);
    this.btnGoLeft_.set({x: 650, y: 600});
    this.btnGoRight_ = new MoveButton(false);
    this.btnGoRight_.set({x: 100, y: 600});
    this.uiLayer_.addChild(this.btnGoLeft_);
    this.uiLayer_.addChild(this.btnGoRight_);

    this.btnBack_ = new createjs.Bitmap('assets/img/btn-back.png');
    this.btnBack_.set({x:690, y: 20});
    this.uiLayer_.addChild(this.btnBack_);
    this.btnAbout_ = new AboutButton();
    this.uiLayer_.addChild(this.btnAbout_);

    var landmarkNameBase = this.isAtChengDu() ? 'CD' : 'HK';
    for(var i=0; i<4; ++i)
        this.bg_.addLandMark(new LandMark(landmarkNameBase+(i+1)), i);
    this.bg_.addLandMark(new LandMark(), 4);

    this.stage_.addChild(this.bg_);
    this.stage_.addChild(this.player_);
    this.stage_.addChild(this.uiLayer_);
    this.stage_.addChild(this.btmMap_);

    this.btnGoLeft_.addEventListener('click', Delegate.create(this, this.onLeftClick));
    this.btnGoRight_.addEventListener('click', Delegate.create(this, this.onRightClick));
    this.btnBack_.addEventListener('click', Delegate.create(this, this.onBackClick));
    this.bg_.addEventListener('moveFinished', Delegate.create(this, this.onMovePlayerFinished));
    this.bg_.addEventListener('markClicked', Delegate.create(this, this.landMarkClicked));
    this.bg_.addEventListener('sceneConstructed', Delegate.create(this, this.bgConstructed));
};


/**
 * @override
 * */
MainStageMediator.prototype.declareInterestedNotifications = function() {
    this.declareInterest(MainFeature.Notes.getInternalNote('PLAYER_SELECTED'), this.onPlayerSelected);
};

/**
 * Notification Handler
 * */
MainStageMediator.prototype.onPlayerSelected = function(msg) {
    this.init(msg.body.player, msg.body.place);
};

/**
 * Event Handler
 * */
MainStageMediator.prototype.onBackClick = function() {
    //clear stage
    this.stage_.removeAllChildren();
    this.btnGoLeft_.removeAllEventListeners();
    this.btnGoRight_.removeAllEventListeners();
    this.btnBack_.removeAllEventListeners();
    this.bg_.removeAllEventListeners();

    this.sendNotification(MainFeature.Notes.getInternalNote('RETURN_TO_TAIKOO'));
};

/**
 * Event Handler
 * */
MainStageMediator.prototype.bgConstructed = function(msg) {
    this.showUI();
    EaselAnimationHelper.fadeIn(this.btmMap_);
};

/**
 * Event Handler
 * */
MainStageMediator.prototype.landMarkClicked = function(e) {
    if(this.bg_.getCurrentPos() >= 4) {
        //special handle question place
        this.sendNotification(MainFeature.Notes.getInternalNote('QUESTION_START'));
    } else {
        if(!this.isZooming_) {
            if (this.isZoomin_) {
                this.zoomOut();
            } else if (!this.isUIHidden_) {
                this.zoomIn();
            }
        }

    }

};

/**
 * Event Handler
 * */
MainStageMediator.prototype.onMovePlayerFinished = function(e) {
    this.showUI();
};

/**
 * Event Handler
 * */
MainStageMediator.prototype.onLeftClick = function(e) {
    if(!this.bg_.isMoving() && this.btmMap_.moveLeft()) {
        this.bg_.moveLeft();
        this.hideUI();
    }
};

/**
 * Event Handler
 * */
MainStageMediator.prototype.onRightClick = function(e) {
    if(!this.bg_.isMoving() && this.btmMap_.moveRight()) {
        this.bg_.moveRight();
        this.hideUI();
    }
};

MainStageMediator.prototype.hideUI = function() {
    this.isUIHidden_ = true;
    EaselAnimationHelper.disappear(this.uiLayer_);
};

MainStageMediator.prototype.showUI = function() {
    this.isUIHidden_ = false;
    EaselAnimationHelper.fadeIn(this.uiLayer_);

    this.btnGoLeft_.visible = this.btmMap_.canMoveLeft();
    this.btnGoRight_.visible = this.btmMap_.canMoveRight();
};

MainStageMediator.prototype.zoomIn = function() {
    var playerPos = this.bg_.getCurrentPos();
    var self = this;

    this.isZooming_ = true;
    this.isZoomin_ = true;
    this.hideUI();
    self.bg_.getCurrentLandMark().hidePointer();
    TextPanel.showPanel(this.getPlaceName(playerPos));
    createjs.Tween.get(this.stage_).to({scaleX: 1.5, scaleY:1.5, y: -200, x: -300}, 1000, createjs.Ease.cubicOut).call(function(){
        self.isZooming_ = false;
        TextPanel.populateContent(self.getPlaceDesc(playerPos));
    });
};

MainStageMediator.prototype.zoomOut = function() {
    this.isZooming_ = true;
    this.isZoomin_ = false;
    this.showUI();
    TextPanel.hide();
    var self = this;
    createjs.Tween.get(this.stage_).to({scaleX: 1, scaleY:1, y: 0, x: 0}, 1000, createjs.Ease.cubicOut).call(function(){
        self.bg_.getCurrentLandMark().showPointer();
        self.isZooming_ = false;
    });
};

MainStageMediator.prototype.getPlaceDesc = function(pos) {
    return this.isAtChengDu() ? CONST.PLACE.DESC_CD[pos] : CONST.PLACE.DESC_HK[pos];
};

MainStageMediator.prototype.getPlaceName = function(pos) {
    return this.isAtChengDu() ? CONST.PLACE.CD[pos] : CONST.PLACE.HK[pos];
};

MainStageMediator.prototype.isAtChengDu = function() {
    return this.sceneName_ == 'cd';
};
