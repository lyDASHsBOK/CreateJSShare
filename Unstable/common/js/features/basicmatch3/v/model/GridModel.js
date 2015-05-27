/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-30
 * Time: 上午12:33
 * To change this template use File | Settings | File Templates.
 */

goog.provide("bok.features.basicmatch3.v.model.GridModel");

bok.features.basicmatch3.v.model.GridModel = function(settings) {
    this.icons_ = [];

    this.WIDTH = settings.WIDTH;
    this.HEIGHT = settings.HEIGHT;
};
BOK.inherits(bok.features.basicmatch3.v.model.GridModel, EventDispatcher);

bok.features.basicmatch3.v.model.GridModel.EVENT = {
    SWAP: 'swap',
    CLEAR: 'clear',
    DROP: 'drop'
};

bok.features.basicmatch3.v.model.GridModel.prototype.postSwap = function(pos1, pos2) {
    if(this.isValidSwap_(pos1, pos2)) {
        this.swapLogicPos_(pos1, pos2);
        return true;
    } else
        return false;
};





bok.features.basicmatch3.v.model.GridModel.prototype.isActivePos_ = function(pos)
{
    var x = pos.x;
    var y = pos.y;

    if(!this.isValidPos_(x, y))
        return false;

    var rootType = this.icons_[x][y];
    //H check
    var checkCounter = 0;
    for(var i=x-2; i<=x+2; ++i)
    {
        if(!this.isValidPos_(i, y))
            continue;
        if(this.icons_[i][y] == rootType)
            ++checkCounter;
        else
            checkCounter = 0;

        if(checkCounter >= 3)
            return true;
    }

    //V check
    checkCounter = 0;
    for(var j=y-2; j <=y+2; ++j)
    {
        if(!this.isValidPos_(x, j))
            continue;
        if(this.icons_[x][j] == rootType)
            ++checkCounter;
        else
            checkCounter = 0;

        if(checkCounter >= 3)
            return true;
    }

    return false;
};

bok.features.basicmatch3.v.model.GridModel.prototype.isValidPos_ = function(x, y)
{
    return x >=0 && x < this.WIDTH &&
        y >= 0 && y < this.HEIGHT;
};

bok.features.basicmatch3.v.model.GridModel.prototype.swapLogicPos_ = function(pos1, pos2) {
    var t = this.icons_[pos1.x][pos1.y];
    this.icons_[pos1.x][pos1.y] = this.icons_[pos2.x][pos2.y];
    this.icons_[pos2.x][pos2.y] = t;
};

bok.features.basicmatch3.v.model.GridModel.prototype.isValidSwap_ = function(pos1, pos2)
{
    this.swapLogicPos_(pos1, pos2);
    var result = this.isActivePos_(pos1) || this.isActivePos_(pos2);
    this.swapLogicPos_(pos1, pos2);

    return result;
};

