/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:27
 *
 */
goog.provide("bok.features.basicmatch3.v.components.MainBoard");

goog.require("bok.cssstage.widgets.EaselStage");
goog.require("bok.features.basicmatch3.v.components.DashBoard");
goog.require("bok.features.basicmatch3.v.components.GridBoard");

/**
 * */
bok.features.basicmatch3.v.components.MainBoard = function()
{
    EaselStage.call(this, 'Match3MainBoard');

    this.dashBoard_ = new bok.features.basicmatch3.v.components.DashBoard();
    this.dashBoard_.set(bok.features.basicmatch3.v.components.MainBoard.SETTINGS.DASH_BOARD_POS);
    this.stage_.addChild(this.dashBoard_);

    this.grid_ = new bok.features.basicmatch3.v.components.GridBoard();
    this.grid_.setDashBoard(this.dashBoard_);
    this.grid_.setDataUpdateListener(Delegate.create(this, this.onGridDataUpdate_));
    this.grid_.set(bok.features.basicmatch3.v.components.MainBoard.SETTINGS.GRID_BOARD_POS);
    this.stage_.addChild(this.grid_);
};
BOK.inherits(bok.features.basicmatch3.v.components.MainBoard, EaselStage);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.MainBoard.SETTINGS = {};

bok.features.basicmatch3.v.components.MainBoard.Event = {
    'GRID_DATA_UPDATE': 'GridDataUpdate'
};

bok.features.basicmatch3.v.components.MainBoard.prototype.stageInit = function(data)
{
    this.grid_.loadBoardData(data);
};

bok.features.basicmatch3.v.components.MainBoard.prototype.onGridDataUpdate_ = function(data)
{
    this.dispatchEvent(new Event(bok.features.basicmatch3.v.components.MainBoard.Event.GRID_DATA_UPDATE, data));
};
