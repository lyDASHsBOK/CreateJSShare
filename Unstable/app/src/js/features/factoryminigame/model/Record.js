/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-31
 * Time: 上午2:40
 * To change this template use File | Settings | File Templates.
 */
goog.provide('miniiw.features.factoryminigame.model.Record');

miniiw.features.factoryminigame.model.Record = function() {
    EventDispatcher.call(this);

    this.data = {
        score: 0,
        enterGridTimes: 0,
        playerSwapTimes: 0,
        playerSwapTimesOnGrid: 0,
        revealedGrid: 0,
        reactTimes:0,
        reactCombo:0
    };
};
BOK.inherits(miniiw.features.factoryminigame.model.Record, EventDispatcher);

miniiw.features.factoryminigame.model.Record.prototype.listenToBoard = function(board) {
    GAME_RECORD = this;
    var recordData = this.data;
    var that = this;
    board.addEventListener('reactingStart', function(){
        recordData.reactTimes++;
        recordData.reactCombo++;
        that.dispatchEvent(new Event('comboUpdate', recordData.reactCombo));
    });

    board.addEventListener('reactingStop', function(){
        recordData.reactCombo = 0;
        that.dispatchEvent(new Event('comboUpdate', recordData.reactCombo));
    });
};
miniiw.features.factoryminigame.model.Record.prototype.listenToGrid = function(grid) {
    grid.addEventListener('playerSwapIcon', Delegate.create(this, this.onPlayerSwapIcon_));
    grid.addEventListener('unlocked', Delegate.create(this, this.onGridRevealed_));
    grid.addEventListener('basicMatchClear', Delegate.create(this, this.onBasicMatch_));
    grid.addEventListener('massClearScore', Delegate.create(this, this.onMassMatch_));
};

miniiw.features.factoryminigame.model.Record.prototype.playerChoseGrid = function(grid) {
    this.data.playerSwapTimesOnGrid = 0;
    this.data.enterGridTimes++;

    this.dispatchEvent(new Event('gridEntryUpdate'));
};


/////////////////////////////////// Listeners /////////////////////////////////////////
miniiw.features.factoryminigame.model.Record.prototype.onMassMatch_ = function(e) {
    var score = e.clearCount * (this.data.reactCombo || 1);
    this.data.score += score;

    this.dispatchEvent(new Event('scoreUpdate', score));
};

miniiw.features.factoryminigame.model.Record.prototype.onBasicMatch_ = function(e) {
    var score = e.clearCount * (this.data.reactCombo || 1);
    this.data.score += score;

    this.dispatchEvent(new Event('scoreUpdate', score));
};

miniiw.features.factoryminigame.model.Record.prototype.onGridRevealed_ = function() {
    this.data.revealedGrid++;
};

miniiw.features.factoryminigame.model.Record.prototype.onPlayerSwapIcon_ = function() {
    this.data.playerSwapTimes++;
    this.data.playerSwapTimesOnGrid++;
    this.dispatchEvent(new Event('gridEntryUpdate'));

    if(this.data.playerSwapTimesOnGrid >= CONST.GAME_PLAY.SWAP_TIMES_FOR_VIEW_BTN
        && this.data.revealedGrid > 1)
        this.dispatchEvent(new Event('enableViewBtn'));
};