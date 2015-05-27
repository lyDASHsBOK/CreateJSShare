/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:31
 *
 */
goog.provide("bok.features.basicmatch3.v.components.GridBoard");
goog.require("bok.util.EaselAnimationHelper");
goog.require("bok.features.basicmatch3.v.components.Icon");


bok.features.basicmatch3.v.components.GridBoard = function()
{
    createjs.Container.call(this);

    /** @type {bok.features.basicmatch3.v.components.DashBoard}*/
    this.dashBoard_ = null;
    //interaction disable flag
    this.interActionDisbaled_ = false;
    //init icons
    this.icons_ = [];
    this.dataUpdateCallback_ = null;
    this.scoreMultiplier_ = 1;

    this.init_();

    this.addEventListener('click', Delegate.create(this, this.onClick_));
};
BOK.inherits(bok.features.basicmatch3.v.components.GridBoard, createjs.Container);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.GridBoard.SETTINGS = {};

/**
 * @param {Function} listener
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.setDataUpdateListener = function(listener)
{
    this.dataUpdateCallback_ = listener;
};

/**
 * @param {bok.features.basicmatch3.v.components.DashBoard} dashBoard
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.setDashBoard = function(dashBoard)
{
    this.dashBoard_ = dashBoard;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.loadBoardData = function(data)
{
    this.dashBoard_.setBoardData(data['dashboard']);
    this.initGridData_(data['grid']);
};

/**
 * @param {Array=} gridData  (optional) A 2D array for initial grid layout.
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.initGridData_ = function(gridData)
{
    if(gridData)
    {
        for(var i=0; i<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH; ++i)
        {
            for(var j=0; j<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT; ++j)
            {
                this.removeOnPos_(i, j);
                this.dropIconOnPos_(i, j, gridData[i][j]);
            }
        }
    }

    this.startFall_();
};


bok.features.basicmatch3.v.components.GridBoard.prototype.init_ = function()
{
    //init grid
    var SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var ICON_SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;
    var area = new createjs.Shape();
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, SETTINGS.FRAME_WIDTH + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        SETTINGS.FRAME_WIDTH + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);

    this.addChild(area);

    for(var i=0; i<SETTINGS.WIDTH; ++i)
    {
        this.icons_[i] = [];
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.getBoardRawData_ = function()
{
    var data = {};

    //get dashboard data
    data['dashboard'] = this.dashBoard_.getRawData();

    //get grid data
    var raw = [];
    for(var i=0; i<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH; ++i)
    {
        raw[i] = [];
        for(var j=0; j<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT; ++j)
        {
            raw[i][j] = this.icons_[i][j].type;
        }
    }
    data['grid'] = raw;

    return data;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.startFall_ = function()
{
    for(var i=0; i<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH; ++i)
    {
        var emptyCount = 0;
        for(var j=bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT-1; j>=0; --j)
        {
            if(this.icons_[i][j])
            {
                var k = j;
                while(!this.icons_[i][++k] && k < bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT);
                if(--k != j)
                    this.moveIconToPos_(this.icons_[i][j], i, k);
            }
            else
                ++emptyCount;
        }

        while(emptyCount--)
        {
            //drop random icon
            this.dropIconOnPos_(i, emptyCount, BOK.randN(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MAX_ICON_TYPES));
        }
    }

    if(this.dataUpdateCallback_)
        this.dataUpdateCallback_(this.getBoardRawData_());

    setTimeout(Delegate.create(this, this.onFallFinish_),
        bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION);
};

bok.features.basicmatch3.v.components.GridBoard.prototype.checkAndReact_ = function()
{
    var reactPosArray = [];
    for(var i=0; i<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH; i++)
    {
        for(var j=0; j<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT; j++)
        {
            if(this.isActivePos_(i, j))
            {
                reactPosArray = reactPosArray.concat(this.reactOnPos_(i, j));
            }
        }
    }

    if(reactPosArray.length > 0)
    {
        var scoreKeeper = [];
        var reactWinning = 0;
        BOK.each(reactPosArray, function(pos){
            this.removeOnPos_(pos.x, pos.y);
            var type = pos.type;
            scoreKeeper[type] = scoreKeeper[type] ? scoreKeeper[type] + 1 : 1;
        }, this);

        BOK.each(scoreKeeper, function(score, type){
            if(score)
            {
                var winning = score * this.scoreMultiplier_;
                this.dashBoard_.addIconCount(type, winning);
                reactWinning += winning;
            }
        }, this);

        //record react winning
        this.dashBoard_.setRecord(bok.features.basicmatch3.v.components.DashBoard.RECORD_ITEMS.BIGGEST_REACT_WINNING, reactWinning);

        //update multiplier
        this.scoreMultiplier_++;
        this.dashBoard_.setRecord(bok.features.basicmatch3.v.components.DashBoard.RECORD_ITEMS.BIGGEST_MULTIPLIER, this.scoreMultiplier_);

        setTimeout(Delegate.create(this, this.onReactFinish_), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION);
    }
    else
    {
        //reset multiplier if no reaction.
        this.scoreMultiplier_ = 1;
        this.enableUserInteraction();
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.reactOnPos_ = function(x, y)
{
    if(!this.isValidPos_(x, y))
        return;

    var rootType = this.icons_[x][y].type;
    var reactPos = [{x:x, y:y, type:rootType}];
    var reactXPos = [];
    var reactYPos = [];
    var xp=xm=yp=ym=true;
    for(var i=1; i<5; ++i)
    {
        if(xm && this.isValidPos_(x-i, y) && this.icons_[x-i][y].type == rootType)
            reactXPos.push({x:x-i, y:y});
        else
            xm = false;
        if(xp && this.isValidPos_(x+i, y) && this.icons_[x+i][y].type == rootType)
            reactXPos.push({x:x+i, y:y});
        else
            xp = false;
    }
    for(var j=1; j<5; ++j)
    {

        if(ym && this.isValidPos_(x, y-j) && this.icons_[x][y-j].type == rootType)
            reactYPos.push({x:x, y:y-j});
        else
            ym = false;
        if(yp && this.isValidPos_(x, y+j) && this.icons_[x][y+j].type == rootType)
            reactYPos.push({x:x, y:y+j});
        else
            yp = false;
    }

    if(reactXPos.length >= 2)
        reactPos = reactPos.concat(reactXPos);
    if(reactYPos.length >= 2)
        reactPos = reactPos.concat(reactYPos);

    return reactPos;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.trySwapIcon_ = function(iconA, iconB)
{
    if(this.isValidSwap_(iconA, iconB))
    {
        //do swap
        var ax = iconA.getGridX();
        var ay = iconA.getGridY();
        var bx = iconB.getGridX();
        var by = iconB.getGridY();

        this.moveIconToPos_(iconA, bx, by);
        this.moveIconToPos_(iconB, ax, ay);

        setTimeout(Delegate.create(this, this.onSwapFinish_),
            bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION);
    }
    else
    {
        this.enableUserInteraction();
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.isValidSwap_ = function(iconA, iconB)
{
    if(!iconA || !iconB)
        return false;

    this.swapLogicPos_(iconA, iconB);

    var result = false;
    if( this.isActivePos_(iconA.getGridX(), iconA.getGridY()) ||
        this.isActivePos_(iconB.getGridX(), iconB.getGridY()))
        result = true;

    this.swapLogicPos_(iconA, iconB);

    return result;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.isActivePos_ = function(x, y)
{
    if(!this.isValidPos_(x, y))
        return false;

    var rootType = this.icons_[x][y].type;
    //H check
    var checkCounter = 0;
    for(var i=x-2; i<=x+2; ++i)
    {
        if(!this.isValidPos_(i, y))
            continue;
        if(this.icons_[i][y].type == rootType)
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
        if(this.icons_[x][j].type == rootType)
            ++checkCounter;
        else
            checkCounter = 0;

        if(checkCounter >= 3)
            return true;
    }

    return false;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.gridPosToIconPos_ = function(x, y)
{
    var SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var ICON_SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;

    return {
        x:SETTINGS.FRAME_WIDTH + x * ICON_SETTINGS.WIDTH,
        y: SETTINGS.FRAME_WIDTH + y * ICON_SETTINGS.HEIGHT
    };
};

bok.features.basicmatch3.v.components.GridBoard.prototype.isValidPos_ = function(x, y)
{
    return x >=0 && x < bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH &&
        y >= 0 && y < bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT &&
        this.icons_[x][y];
};

bok.features.basicmatch3.v.components.GridBoard.prototype.swapLogicPos_ = function(iconA, iconB)
{
    if(iconA && iconB)
    {
        var ax = iconA.getGridX();
        var ay = iconA.getGridY();
        var bx = iconB.getGridX();
        var by = iconB.getGridY();

        this.removeIconFromLogicPos_(iconA);
        this.removeIconFromLogicPos_(iconB);

        this.moveIconToLogicPos_(iconB, ax, ay);
        this.moveIconToLogicPos_(iconA, bx, by);
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.moveIconToPos_ = function(icon, x, y)
{
    var pos = this.gridPosToIconPos_(x, y);

    this.moveIconToLogicPos_(icon, x, y);
    EaselAnimationHelper.moveTo(icon, pos.x, pos.y, bok.features.basicmatch3.v.components.GridBoard.SETTINGS.ANIM_DURATION);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number=} type (optional) Icon type
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.dropIconOnPos_ = function(x, y, type)
{
    var displayPos = this.gridPosToIconPos_(x, y);
    this.icons_[x][y] = new bok.features.basicmatch3.v.components.Icon(x, y, type);
    this.icons_[x][y].set({x:displayPos.x, y:-bok.features.basicmatch3.v.components.Icon.SETTINGS.HEIGHT});
    this.addChild(this.icons_[x][y]);
    EaselAnimationHelper.bounceTo(this.icons_[x][y],
        displayPos.x, displayPos.y,
        bok.features.basicmatch3.v.components.GridBoard.SETTINGS.ANIM_DURATION - BOK.randN(300));
};

bok.features.basicmatch3.v.components.GridBoard.prototype.removeOnPos_ = function(x, y)
{
    if(this.isValidPos_(x, y))
    {
        var icon = this.icons_[x][y];
        var tween = EaselAnimationHelper.disappear(icon, bok.features.basicmatch3.v.components.GridBoard.SETTINGS.ANIM_DURATION);
        this.removeIconFromLogicPos_(icon);
        var THIS = this;
        tween.call(function(){
            THIS.removeChild(icon);
        });
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.removeIconFromLogicPos_ = function(icon)
{
    var oldIconX = icon.getGridX();
    var oldIconY = icon.getGridY();
    if(this.isValidPos_(oldIconX, oldIconY) && icon == this.icons_[oldIconX][oldIconY])
        this.icons_[oldIconX][oldIconY] = null;

    icon.moveToGridPos(-1, -1);
};

bok.features.basicmatch3.v.components.GridBoard.prototype.moveIconToLogicPos_ = function(icon, x, y)
{
    //release old logic pos
    this.removeIconFromLogicPos_(icon);

    icon.moveToGridPos(x, y);
    this.icons_[x][y] = icon;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.disableUserInteraction = function()
{
    this.interActionDisbaled_ = true;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.enableUserInteraction = function()
{
    this.interActionDisbaled_ = false;
};



bok.features.basicmatch3.v.components.GridBoard.prototype.onFallFinish_ = function()
{
    this.checkAndReact_();
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onReactFinish_ = function()
{
    this.startFall_();
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onSwapFinish_ = function()
{
    this.checkAndReact_();
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onClick_ = function(e)
{
    if(this.interActionDisbaled_)
        return;

    this.disableUserInteraction();

    var SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var ICON_SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;
    var absX = e.stageX - this.x - SETTINGS.FRAME_WIDTH;
    var absY = e.stageY - this.y - SETTINGS.FRAME_WIDTH;
    var i = Math.floor(absX/ICON_SETTINGS.WIDTH);
    var j = Math.floor(absY/ICON_SETTINGS.HEIGHT);

    if(this.selectedIcon_)
    {
        if(this.isValidPos_(i, j))
        {
            //put down selected icon
            this.selectedIcon_.releaseIcon();
            //try to swap
            this.trySwapIcon_(this.icons_[i][j], this.selectedIcon_);
        }
        else
        {
            this.removeOnPos_(this.selectedIcon_.getGridX(), this.selectedIcon_.getGridY());
            setTimeout(Delegate.create(this, this.onReactFinish_), SETTINGS.MOVE_DURATION);
        }

        this.selectedIcon_ = null;
    }
    else
    {
        if(this.isValidPos_(i, j))
        {
            this.icons_[i][j].selectIcon();
            this.selectedIcon_ = this.icons_[i][j];
            this.setChildIndex(this.selectedIcon_, 0);
        }

        this.enableUserInteraction();
    }
};

