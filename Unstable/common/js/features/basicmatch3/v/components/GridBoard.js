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
goog.require("bok.features.basicmatch3.v.model.GridModel");

bok.features.basicmatch3.v.components.GridBoard = function()
{
    createjs.Container.call(this);

    this.FLAIR_RATE = 50;
    /** @type {bok.features.basicmatch3.v.components.DashBoard}*/
    this.dashBoard_ = new bok.features.basicmatch3.v.components.DashBoard();
    //interaction disable flag
    this.interActionDisbaled_ = false;
    this.root_ = new createjs.Container();
    this.addChild(this.root_);
    //init icons
    this.icons_ = [];
    this.dataUpdateCallback_ = null;
    this.unstable_ = false;
    this.reacting = false;
    this.locked = true;
    this.isShut_ = false;
    this.root_.visible = false;

    this.iconfront = false;
    this.init_();
};
BOK.inherits(bok.features.basicmatch3.v.components.GridBoard, createjs.Container);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.GridBoard.SETTINGS = {};

/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.shutDown = function(){
    this.disableUserInteraction();
    this.isShut_ = true;
};
/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.unlock = function(){
    this.locked = false;
    this.root_.visible = true;
    this.root_.y = -500;
    createjs.Tween.get(this.root_).to({y:0}, 300, createjs.Ease.bounceOut);
    this.dispatchEvent(new createjs.Event('unlocked'));
};
/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.unstabilize = function(){
    if(this.unstable_)
        return;

    this.unstable_ = true;
    this.frame2_.visible = true;
    this.frame_.visible = false;
};
/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.stabilize = function(){
    this.unstable_ = false;
    this.frame_.visible = true;
    this.frame2_.visible = false;
};
/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.clearColor = function(type){
    if(this.locked) {
        return;
    }

    var totalClear = 0;
    BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH, Delegate.create(this, function(i){
        BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT, Delegate.create(this, function(j){
            setTimeout(Delegate.create(this, function(i){
                if(this.icons_[i][j] && this.icons_[i][j].type == type){
                    if(this.removeOnPos_(i, j)){
                        this.flairExplode_(i, j);
                        totalClear++;
                    }
                }
            }, i), BOK.randN(600));
        }), this);
    }), this);
    setTimeout(Delegate.create(this, function(){
        var e = new createjs.Event('massClearScore');
        e.clearCount = totalClear;
        this.dispatchEvent(e);
    }), 600);
};

/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.clearRow = function(row, advClear)
{
    if(this.locked) {
        this.unlock();
    }

    if(advClear)
        this.unstabilize();

    var totalClear = 0;
    BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH, Delegate.create(this, function(i){
        this.removeOnPos_(i, row) && totalClear++;
        if(advClear) {
            setTimeout(Delegate.create(this, function(i){
                this.genFlair_(i, row-1) && totalClear++;
                this.genFlair_(i, row+1) && totalClear++;
            }, i), i*190);
        }
    }), this);
    setTimeout(Delegate.create(this, function(){
        var e = new createjs.Event('massClearScore');
        e.clearCount = totalClear;
        this.dispatchEvent(e);
    }), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION + 800);
    setTimeout(Delegate.create(this, this.onReactFinish_), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION + 800);
};
/**
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.clearColumn = function(col, advClear)
{
    if(this.locked) {
        this.unlock();
    }

    if(advClear)
        this.unstabilize();

    var totalClear = 0;
    BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT, Delegate.create(this, function(i){
        this.removeOnPos_(col, i) && totalClear++;
        if(advClear) {
            setTimeout(Delegate.create(this, function(i){
                this.genFlair_(col-1, i) && totalClear++;
                this.genFlair_(col+1, i) && totalClear++;
            }, i), i*190);
        }
   }), this);
    setTimeout(Delegate.create(this, function(){
        var e = new createjs.Event('massClearScore');
        e.clearCount = totalClear;
        this.dispatchEvent(e);
    }), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION + 800);
    setTimeout(Delegate.create(this, this.onReactFinish_), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION + 800);
};

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

bok.features.basicmatch3.v.components.GridBoard.prototype.flairExplode_ = function(x, y) {
    var e = new createjs.Event('flair');
    e.pos = {x:x, y:y};
    this.dispatchEvent(e);
};
bok.features.basicmatch3.v.components.GridBoard.prototype.genFlair_ = function(x, y) {
    if(BOK.randN(100) < this.FLAIR_RATE) {
        this.removeOnPos_(x,y);
        this.flairExplode_(x, y);
        return true;
    }

    return false;
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

    this.startFall_(true);
};


bok.features.basicmatch3.v.components.GridBoard.prototype.init_ = function()
{
    //init grid
    var SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var ICON_SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;
    this.frame_ = new createjs.Shape();
    this.frame_.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    this.frame_.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, SETTINGS.FRAME_WIDTH + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    this.frame_.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);
    this.frame_.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        SETTINGS.FRAME_WIDTH + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);

    this.frame2_ = new createjs.Shape();
    this.frame2_.graphics.beginFill('rgba(200,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    this.frame2_.graphics.beginFill('rgba(200,20,20,1)').drawRect(
        0, SETTINGS.FRAME_WIDTH + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH,
        SETTINGS.FRAME_WIDTH);
    this.frame2_.graphics.beginFill('rgba(200,20,20,1)').drawRect(
        0, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);
    this.frame2_.graphics.beginFill('rgba(200,20,20,1)').drawRect(
        SETTINGS.FRAME_WIDTH + ICON_SETTINGS.WIDTH*SETTINGS.WIDTH, 0,
        SETTINGS.FRAME_WIDTH,
        SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.HEIGHT*SETTINGS.HEIGHT);
    this.frame2_.visible = false;

    this.root_.addChild(this.frame_);
    this.root_.addChild(this.frame2_);

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

bok.features.basicmatch3.v.components.GridBoard.prototype.startFall_ = function(isInit)
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
            this.dropIconOnPos_(i, emptyCount, 'random', isInit);
        }
    }

    if(this.dataUpdateCallback_)
        this.dataUpdateCallback_(this.getBoardRawData_());

    setTimeout(Delegate.create(this, this.onFallFinish_),
        bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION);
};

bok.features.basicmatch3.v.components.GridBoard.prototype.checkAndReact_ = function()
{
    var event, reactPosArray = [];
    for(var i=0; i<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH; i++)
    {
        for(var j=0; j<bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT; j++)
        {
            if(!this.isPosInArray_(i,j, reactPosArray) && this.isActivePos_(i, j))
            {
                var groupPos = this.reactOnPos_(i, j);
                if(groupPos.length == 3) {
                    event = new createjs.Event('normalClear');
                    event.posArray = groupPos;
                    this.dispatchEvent(event);
                } else if(groupPos.length == 4) {
                    event = new createjs.Event('massClear');
                    event.posArray = groupPos;
                    this.dispatchEvent(event);
                } else if(groupPos.length == 5) {
                    event = new createjs.Event('megaClear');
                    event.posArray = groupPos;
                    event.posType = this.icons_[i][j].type;
                    this.dispatchEvent(event);
                }
                reactPosArray = reactPosArray.concat(groupPos);
                console.log(groupPos);
            }
        }
    }

    if(reactPosArray.length > 0)
    {
        BOK.each(reactPosArray, function(pos){
            this.removeOnPos_(pos.x, pos.y);
        }, this);
        event = new createjs.Event('basicMatchClear');
        event.clearCount = reactPosArray.length;
        this.dispatchEvent(event);

        setTimeout(Delegate.create(this, this.onReactFinish_), bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MOVE_DURATION);
    }
    else
    {
        //reset multiplier if no reaction.
        this.reacting = false;
        this.dispatchEvent(new createjs.Event('reactFinish'));
        this.enableUserInteraction();
        console.log('grid ['+this.boardPos.x+']['+this.boardPos.y+'] stablized');
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
    else if(reactYPos.length >= 2)
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
        {
            checkCounter = 0;
            continue;
        }
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
        {
            checkCounter = 0;
            continue;
        }
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

bok.features.basicmatch3.v.components.GridBoard.prototype.isPosInArray_ = function(x, y, posArray) {
    var isInAry = false;
    BOK.each(posArray, function(pos){
        if(pos.x == x && pos.y == y){
            isInAry = true;
            return BOK.BREAK;
        }
    }, this);

    return isInAry;
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
 * @param {string=} type (optional) Icon type
 * */
bok.features.basicmatch3.v.components.GridBoard.prototype.dropIconOnPos_ = function(x, y, type, isInit)
{
    if('random' == type) {
        do {
            this.icons_[x][y] = new bok.features.basicmatch3.v.components.Icon(x, y,
                BOK.randN(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.MAX_ICON_TYPES), this.iconfront);
        } while(isInit && this.isActivePos_(x, y));
    } else
        this.icons_[x][y] = new bok.features.basicmatch3.v.components.Icon(x, y, type, this.iconfront);

    var displayPos = this.gridPosToIconPos_(x, y);
    this.icons_[x][y].set({x:displayPos.x, y:-bok.features.basicmatch3.v.components.Icon.SETTINGS.HEIGHT});
    this.icons_[x][y].addEventListener('click', Delegate.create(this, this.onIconClick_));
    this.root_.addChild(this.icons_[x][y]);
    EaselAnimationHelper.bounceTo(this.icons_[x][y],
        displayPos.x, displayPos.y,
        bok.features.basicmatch3.v.components.GridBoard.SETTINGS.ANIM_DURATION - BOK.randN(300));
};

bok.features.basicmatch3.v.components.GridBoard.prototype.removeOnPos_ = function(x, y)
{
    if(this.isValidPos_(x, y))
    {
        this.reacting = true;
        var icon = this.icons_[x][y];
        var tween = EaselAnimationHelper.disappear(icon, bok.features.basicmatch3.v.components.GridBoard.SETTINGS.ANIM_DURATION);
        this.removeIconFromLogicPos_(icon);
        var THIS = this;
        tween.call(function(){
            THIS.removeChild(icon);
        });

        return true;
    } else
        return false;
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
    !this.isShut_ && (this.interActionDisbaled_ = false);
};



bok.features.basicmatch3.v.components.GridBoard.prototype.onFallFinish_ = function()
{
    this.checkAndReact_();
    this.pendingFall_ = false;
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onReactFinish_ = function()
{
    if(!this.pendingFall_){
        this.pendingFall_ = true;
        this.startFall_();
    }
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onSwapFinish_ = function()
{
    this.dispatchEvent(new createjs.Event('playerSwapIcon'));

    this.checkAndReact_();
};

bok.features.basicmatch3.v.components.GridBoard.prototype.enableFrontIcon = function(bShow)
{
    this.iconfront = bShow;
    BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.WIDTH, Delegate.create(this, function(i){
        BOK.loop(bok.features.basicmatch3.v.components.GridBoard.SETTINGS.HEIGHT, Delegate.create(this, function(j){
            if(this.icons_[i][j])
            {
                this.icons_[i][j].icon_f.visible = this.iconfront;
            }
        }), this);
    }), this);
};

bok.features.basicmatch3.v.components.GridBoard.prototype.onIconClick_ = function(e)
{
    if(this.interActionDisbaled_)
        return;

    var icon = e.currentTarget;
    this.disableUserInteraction();

    var SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var i = icon.getGridX();
    var j = icon.getGridY();

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
            var root = this.root_;
            root.swapChildrenAt(root.getChildIndex(this.selectedIcon_), root.getNumChildren()-1);
        }

        this.enableUserInteraction();
    }
};

