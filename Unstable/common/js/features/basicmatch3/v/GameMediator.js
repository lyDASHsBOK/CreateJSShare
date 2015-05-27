/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 22/10/13
 * Time: 16:59
 * To change this template use File | Settings | File Templates.
 */

goog.provide("bok.features.basicmatch3.v.GameMediator");
goog.require('bok.framework.core.BaseMediator');

goog.require("bok.features.basicmatch3.BasicMatch3FeatureNotes");
goog.require("bok.features.basicmatch3.v.components.MainBoard");

/**
 * @param {bok.features.basicmatch3.v.components.MainBoard} gameBoard
 * */
bok.features.basicmatch3.v.GameMediator = function(gameBoard)
{
    BaseMediator.call(this, 'GameMediator');

    this.game_ = gameBoard;
    this.declareInterest(BasicMatch3FeatureNotes.getInputNote('GAME_START'), Delegate.create(this, this.onGameStart));
};
BOK.inherits(bok.features.basicmatch3.v.GameMediator, BaseMediator);


bok.features.basicmatch3.v.GameMediator.prototype.onGameStart = function(msg)
{
    this.game_.stageInit(msg.body || {});
};


