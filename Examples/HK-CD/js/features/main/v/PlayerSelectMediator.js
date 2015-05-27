/**
 * Created by xinyiliu on 3/15/15.
 */
goog.provide("hkcd.features.main.v.PlayerSelectMediator");
goog.require('bok.framework.core.BaseMediator');

goog.requireAll('hkcd.features.main.components.*');


BOK.inherits(PlayerSelectMediator, BaseMediator);
function PlayerSelectMediator(stage) {
    BaseMediator.call(this);

    this.selectScreen_ = new createjs.Container();
    stage.addChild(this.selectScreen_);

    this.bg_ = new createjs.Bitmap('assets/img/taiku.png');
    this.selectScreen_.addChild(this.bg_);

    this.charLayer_ = new createjs.Container();
    this.uiLayer_ = new createjs.Container();
    this.uiLayer_.set({y: 100});

    this.clickable1_ = new TapNotice();
    this.clickable1_.set({x: 280, y: 550});
    this.clickable1_.addEventListener('click', function(){
        QuestionPanel.showPanel(CONST.DESC[0].title, CONST.DESC[0].content);
        QuestionPanel.nextBtn.hide();
    });
    this.uiLayer_.addChild(this.clickable1_);
    this.clickable2_ = new TapNotice();
    this.clickable2_.set({x: 360, y: 680});
    this.clickable2_.addEventListener('click', function(){
        QuestionPanel.showPanel(CONST.DESC[1].title, CONST.DESC[1].content);
        QuestionPanel.nextBtn.hide();
    });
    this.uiLayer_.addChild(this.clickable2_);
    this.clickable3_ = new TapNotice();
    this.clickable3_.set({x: 490, y: 600});
    this.clickable3_.addEventListener('click', function(){
        QuestionPanel.showPanel(CONST.DESC[2].title, CONST.DESC[2].content);
        QuestionPanel.nextBtn.hide();
    });
    this.uiLayer_.addChild(this.clickable3_);
    this.btnAbout_ = new AboutButton();
    this.btnAbout_.y = -100;
    this.uiLayer_.addChild(this.btnAbout_);

    this.boy_ = new Player(false);
    this.boy_.set({x:200, y: 800});
    this.boy_.addEventListener('click', Delegate.create(this, this.onPlayerSelected, this.boy_));
    this.charLayer_.addChild(this.boy_);
    var noticeBoy = new TapNotice();
    noticeBoy.set({x:200, y: 880});
    this.uiLayer_.addChild(noticeBoy);
    this.girl_ = new Player(true);
    this.girl_.set({x: 550, y: 800});
    this.girl_.turnLeft();
    this.girl_.addEventListener('click', Delegate.create(this, this.onPlayerSelected, this.girl_));
    this.charLayer_.addChild(this.girl_);
    var noticeGirl = new TapNotice();
    noticeGirl.set({x:550, y: 880});
    this.uiLayer_.addChild(noticeGirl);

    this.selectBoy_ = new SelectDot();
    this.selectBoy_.set({x: 200, y: 950});
    this.uiLayer_.addChild(this.selectBoy_);
    this.selectBoy_.select();
    this.selectGirl_ = new SelectDot();
    this.selectGirl_.set({x: 530, y: 950});
    this.uiLayer_.addChild(this.selectGirl_);

    this.labelCD_ = new createjs.Bitmap('assets/img/cd.png');
    this.labelCD_.set({x: 150, y: 1070});
    this.labelCD_.addEventListener('click', Delegate.create(this, this.onLocationSelected, 'cd'));
    this.uiLayer_.addChild(this.labelCD_);
    this.labelHK_ = new createjs.Bitmap('assets/img/xg.png');
    this.labelHK_.set({x: 450, y: 1070});
    this.labelHK_.addEventListener('click', Delegate.create(this, this.onLocationSelected, 'hk'));
    this.uiLayer_.addChild(this.labelHK_);

    this.moveCD_ = new MoveButton(false);
    this.moveCD_.set({x: 100, y: 1115, scaleX: 0.75, scaleY: 0.75});
    this.moveCD_.addEventListener('click', Delegate.create(this, this.onLocationSelected, 'cd'));
    this.uiLayer_.addChild(this.moveCD_);
    this.moveHK_ = new MoveButton(true);
    this.moveHK_.set({x: 650, y: 1115, scaleX: 0.75, scaleY: 0.75});
    this.moveHK_.addEventListener('click', Delegate.create(this, this.onLocationSelected, 'hk'));
    this.uiLayer_.addChild(this.moveHK_);


    this.selectScreen_.addChild(this.charLayer_);
    this.selectScreen_.addChild(this.uiLayer_);

    /** @type {Player}*/
    this.currentSelected_ = this.boy_;
}


/**
 * @override
 * */
PlayerSelectMediator.prototype.declareInterestedNotifications = function() {
    this.declareInterest(MainFeature.Notes.getInternalNote('RETURN_TO_TAIKOO'), this.onReturned);
};


PlayerSelectMediator.prototype.onReturned = function() {
    createjs.Sound.stop();
    this.charLayer_.addChild(this.boy_);
    this.charLayer_.addChild(this.girl_);

    this.selectScreen_.visible = true;

    if(this.currentSelected_ == this.boy_) {
        this.boy_.turnLeft();
        EaselAnimationHelper.moveTo(this.boy_, 200, 800, CONST.SELECT_SCREEN.PLAYER_MOVE_TIME);
        EaselAnimationHelper.fadeIn(this.girl_);
    } else {
        this.girl_.turnRight();
        EaselAnimationHelper.moveTo(this.girl_, 550, 800, CONST.SELECT_SCREEN.PLAYER_MOVE_TIME);
        EaselAnimationHelper.fadeIn(this.boy_);
    }
    this.currentSelected_.move();

    setTimeout(Delegate.create(this, function(){
        this.boy_.turnRight();
        this.girl_.turnLeft();
        this.currentSelected_.stop();
        this.uiLayer_.visible = true;
        EaselAnimationHelper.fadeIn(this.uiLayer_);
    }), CONST.SELECT_SCREEN.PLAYER_MOVE_TIME);
};

PlayerSelectMediator.prototype.onLocationSelected = function(selected) {
    createjs.Sound.play(selected, {loop: -1});
    this.start(selected);
};

PlayerSelectMediator.prototype.onPlayerSelected = function(selected) {
    if(this.boy_ == selected) {
        this.selectBoy_.select();
        this.selectGirl_.release();
    } else {
        this.selectBoy_.release();
        this.selectGirl_.select();
    }

    this.currentSelected_ = selected;
};

PlayerSelectMediator.prototype.start = function(place) {
    this.uiLayer_.visible = false;

    if(this.boy_ == this.currentSelected_) {
        EaselAnimationHelper.disappear(this.girl_, 700);
    } else {
        EaselAnimationHelper.disappear(this.boy_, 700);
    }

    this.currentSelected_.move();
    EaselAnimationHelper.moveTo(this.currentSelected_, 300, 760, CONST.SELECT_SCREEN.PLAYER_MOVE_TIME, createjs.Ease.linear).call(Delegate.create(this, function(){
        this.currentSelected_.stop();
        this.currentSelected_.turnRight();
        this.selectScreen_.visible = false;
        this.sendNotification(MainFeature.Notes.getInternalNote('PLAYER_SELECTED'), {player: this.currentSelected_, place:place});
    }));
};
