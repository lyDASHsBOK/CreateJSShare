/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:23
 *
 */
goog.provide("bok.features.basicmatch3.BasicMatch3Feature");

goog.require("bok.framework.core.MVCFeature");
goog.require("bok.features.basicmatch3.data.Settings");
goog.require("bok.features.basicmatch3.v.components.MainBoard");
goog.require("bok.features.basicmatch3.v.GameMediator");
goog.require("bok.features.basicmatch3.BasicMatch3FeatureNotes");
/**
 * @class
 * @param {CssDisplayObject} stage
 * @param {string=} name
 * @param {Object=} newSettings The new feature settings to override bok.features.basicmatch3.data.Settings
 * @constructor
 * @extends {MVCFeature}
 * */
bok.features.basicmatch3.BasicMatch3Feature = function(stage, name, newSettings)
{
    MVCFeature.call(this, name || 'BasicMatch3Feature');

    var settings = newSettings || bok.features.basicmatch3.data.Settings;
    bok.features.basicmatch3.v.components.Icon.SETTINGS = settings['ICON'];
    bok.features.basicmatch3.v.components.IconCounter.SETTINGS = settings['ICON_COUNTER'];
    bok.features.basicmatch3.v.components.DashBoard.SETTINGS = settings['DASH_BOARD'];
    bok.features.basicmatch3.v.components.GridBoard.SETTINGS = settings['GRID_BOARD'];
    bok.features.basicmatch3.v.components.MainBoard.SETTINGS = settings['MAIN_BOARD'];


    this.board_ = new bok.features.basicmatch3.v.components.MainBoard();
    stage.addChild(this.board_);

    //init actors
    this.addMediator(new bok.features.basicmatch3.v.GameMediator(this.board_));
};
BOK.inherits(bok.features.basicmatch3.BasicMatch3Feature, MVCFeature);


bok.features.basicmatch3.BasicMatch3Feature.prototype.newGameStart = function()
{
    this.board_.stageInit({});
};
