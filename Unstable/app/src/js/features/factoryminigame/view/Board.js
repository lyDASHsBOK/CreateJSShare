/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-30
 * Time: 上午2:47
 * To change this template use File | Settings | File Templates.
 */
goog.provide('miniiw.features.factoryminigame.view.Board');
goog.require('miniiw.features.factoryminigame.view.Effect');
goog.require('miniiw.features.factoryminigame.model.Record');

miniiw.features.factoryminigame.view.Board = function(record) {
    createjs.Container.call(this);

    this.board_ = new createjs.Container();
    this.addChild(this.board_);

    //flag vars
    this.isGameOver = false;
    this.isZoomIn_ = true;
    this.reacting_ = false;
    this.record = record;
    this.record.listenToBoard(this);

    //view components
    this.grids_ = [];
    BOK.loop(CONST.BOARD.width, function(i){
        this.grids_[i] = [];
        BOK.loop(CONST.BOARD.height, function(j) {
            var grid = new bok.features.basicmatch3.v.components.GridBoard();
            grid.x = CONST.BOARD.offsetX * i;
            grid.y = CONST.BOARD.offsetY * j;
            grid.loadBoardData({});
            grid.boardPos = {x:i, y:j};
            this.board_.addChild(grid);

            this.grids_[i][j] = grid;
            grid.addEventListener('click', Delegate.create(this, this.onGridClicked_, {x:i, y:j}));
            grid.addEventListener('normalClear', Delegate.create(this, this.onGridNormalClear_));
            grid.addEventListener('massClear', Delegate.create(this, this.onGridMassClear_));
            grid.addEventListener('megaClear', Delegate.create(this, this.onGridMegaClear_));
            grid.addEventListener('reactFinish', Delegate.create(this, this.onGridReactFinished_));
            grid.addEventListener('flair', Delegate.create(this, this.onGridFlair_));
            this.record.listenToGrid(grid);
        }, this);
    }, this);

    //effect layer
    this.gridEffects_ = new createjs.Container();
    this.gridEffects_.set({x:10, y:10});
    this.board_.addChild(this.gridEffects_);
    this.boardEffects_ = new createjs.Container();
    this.boardEffects_.set({x:2, y:2});
    this.addChild(this.boardEffects_);

    this.grids_[2][2].unlock();
    this.showSingleGrid_({x:2, y:2});
    this.grids_[2][2].enableFrontIcon(true);
};
BOK.inherits(miniiw.features.factoryminigame.view.Board, createjs.Container);

miniiw.features.factoryminigame.view.Board.prototype.shutDown = function(){
    BOK.loop(CONST.BOARD.width, function(i){
        BOK.loop(CONST.BOARD.height, function(j) {
            this.grids_[i][j].shutDown();
        }, this);
    }, this);
    this.isGameOver = true;
};

miniiw.features.factoryminigame.view.Board.prototype.isZoomIn = function(){
    return this.isZoomIn_;
};

miniiw.features.factoryminigame.view.Board.prototype.zoomIn = function(pos){
    var setting = {
        x: -pos.x * CONST.BOARD.offsetX,
        y: -pos.y * CONST.BOARD.offsetY,
        scaleX:CONST.BOARD.scaleZoomIn,
        scaleY:CONST.BOARD.scaleZoomIn
    };

    this.fadeAllButOneGrid_(pos);
    createjs.Tween.get(this.board_).wait(CONST.BOARD.fadeDuration).to(setting, CONST.BOARD.zoomingDuration, createjs.Ease.cubicIn);
    this.isZoomIn_ = true;
    this.grids_[pos.x][pos.y].enableFrontIcon(true);
    this.dispatchEvent(new createjs.Event('zoomIn'));

    this.record.playerChoseGrid(this.grids_[pos.x][pos.y]);
};

miniiw.features.factoryminigame.view.Board.prototype.zoomOut = function(){
    createjs.Tween.get(this.board_).to(CONST.BOARD.zoomOutSetting, CONST.BOARD.zoomingDuration, createjs.Ease.cubicOut)
        .call(Delegate.create(this, this.showAllGrid_));
    this.isZoomIn_ = false;

    BOK.loop(CONST.BOARD.width, function(i){
        BOK.loop(CONST.BOARD.height, function(j) {
            this.grids_[i][j].enableFrontIcon(false);
        }, this);
    }, this);
};

/////////////////////////////Listener Private func//////////////////////////////////////
miniiw.features.factoryminigame.view.Board.prototype.onGridFlair_ = function(e){
    //visual effects
    var pos = e.pos;
    var gridPos = e.currentTarget.boardPos;
    var bomb = new miniiw.features.factoryminigame.view.Effect('bomb');
    bomb.x += 470 * gridPos.x + 90 * pos.x;
    bomb.y += 470 * gridPos.y + 90 * pos.y;
    this.gridEffects_.addChild(bomb);
    bomb.gotoAndPlay(0);
    setTimeout(Delegate.create(bomb, function(){
        this.parent.removeChild(this);
    }), 200);
};
miniiw.features.factoryminigame.view.Board.prototype.onGridReactFinished_ = function(pos){
    for(var i=0; i<CONST.BOARD.width; ++i){
        for(var j=0; j<CONST.BOARD.height; ++j){
            if(this.grids_[i][j].reacting)
                return;
        }
    }

    for(i=0; i<CONST.BOARD.width; ++i){
        for(j=0; j<CONST.BOARD.height; ++j){
            this.grids_[i][j].stabilize();
        }
    }
    var wasReacting = this.reacting_;
    this.reacting_ = false;

    //zoom in to random grid
    var randX, randY;
    do {
        randX = BOK.randN(CONST.BOARD.width);
        randY = BOK.randN(CONST.BOARD.height);
    } while(this.grids_[randX][randY].locked);
    if(wasReacting && !this.isZoomIn_){
        this.zoomIn({x:randX, y:randY});
        this.dispatchEvent(new createjs.Event('reactingStop'));
    }
};
miniiw.features.factoryminigame.view.Board.prototype.onGridClicked_ = function(pos){
    if(!this.reacting_ && !this.isZoomIn_) {
        this.zoomIn(pos);
    }
};

miniiw.features.factoryminigame.view.Board.prototype.onGridNormalClear_ = function(e){
    if(e.currentTarget.unstable_) {
        setTimeout(Delegate.create(this, this.sideBeam_, e.posArray, e.currentTarget.boardPos, false), 700);
    }
};
miniiw.features.factoryminigame.view.Board.prototype.onGridMegaClear_ = function(e){
    this.reacting_ = true;
    this.dispatchEvent(new createjs.Event('reactingStart'));
    this.zoomOut();

    var that = this;
    setTimeout(function(){
        var posAry = e.posArray;
        var type = e.posType;
        var gridPos = e.currentTarget.boardPos;

        var lightning;
        if(posAry[0].x == posAry[1].x) {
            var col = posAry[0].x;
            //visual effects
            lightning = new miniiw.features.factoryminigame.view.Effect('lightning');
            lightning.x += 94 * gridPos.x + 18 * (col - 2);
            that.boardEffects_.addChild(lightning);
            createjs.Sound.play("bomb_l");


            BOK.loop(CONST.BOARD.height, function(i){
                that.grids_[gridPos.x][i].clearColumn(col, true);
                that.grids_[gridPos.x][i].clearColor(type);
            });
        } else {
            var row = posAry[0].y;
            //visual effects
            lightning = new miniiw.features.factoryminigame.view.Effect('lightning', {isRow:true});
            lightning.y += 94 * gridPos.y + 18 * (row - 2);
            that.boardEffects_.addChild(lightning);
            createjs.Sound.play("bomb_l");


            BOK.loop(CONST.BOARD.width, function(i){
                that.grids_[i][gridPos.y].clearRow(row, true);
                that.grids_[i][gridPos.y].clearColor(type);
            });
        }
    }, 700);
};
miniiw.features.factoryminigame.view.Board.prototype.onGridMassClear_ = function(e){
    this.reacting_ = true;
    this.dispatchEvent(new createjs.Event('reactingStart'));
    this.zoomOut();

    setTimeout(Delegate.create(this, this.sideBeam_, e.posArray, e.currentTarget.boardPos, true), 700);
};

/////////////////////////////Private func//////////////////////////////////////
miniiw.features.factoryminigame.view.Board.prototype.sideBeam_ = function(posAry, gridPos, isAdvBeam){
    var lightning;
    if(posAry[0].x == posAry[1].x) {
        var col = posAry[0].x;
        BOK.loop(CONST.BOARD.height, function(i){
            if(Math.abs(gridPos.y - i) <= 1){
                //visual effects
                lightning = new miniiw.features.factoryminigame.view.Effect('lightning');
                lightning.x += 470 * gridPos.x + 90 * col;
                lightning.y += 470 * i;
                this.gridEffects_.addChild(lightning);
                setTimeout(function() { createjs.Sound.play("bomb_s");}, BOK.randN(100));

                this.grids_[gridPos.x][i].clearColumn(col, isAdvBeam);
            }
        }, this);
    } else {
        var row = posAry[0].y;
        BOK.loop(CONST.BOARD.width, function(i){
            if(Math.abs(gridPos.x - i) <= 1) {
                //visual effects
                lightning = new miniiw.features.factoryminigame.view.Effect('lightning', {isRow:true});
                lightning.x += 470 * i;
                lightning.y += 470 * gridPos.y + 90 * row;
                this.gridEffects_.addChild(lightning);
                setTimeout(function() { createjs.Sound.play("bomb_s");}, BOK.randN(100));

                this.grids_[i][gridPos.y].clearRow(row, isAdvBeam);
            }
        }, this);
    }

    this.dispatchEvent(new createjs.Event('reactingStart'));
};


miniiw.features.factoryminigame.view.Board.prototype.showAllGrid_ = function(){
    BOK.loop(CONST.BOARD.width, function(i){
        BOK.loop(CONST.BOARD.height, function(j) {
            if(!this.grids_[i][j].visible) {
                this.grids_[i][j].visible = true;
                this.grids_[i][j].alpha = 0;
                createjs.Tween.get(this.grids_[i][j]).to({alpha:1}, CONST.BOARD.fadeDuration, createjs.Ease.linear);
            }

            this.grids_[i][j].disableUserInteraction();
        }, this);
    }, this);
};
miniiw.features.factoryminigame.view.Board.prototype.showSingleGrid_ = function(pos){
    var setting = {
        x: -pos.x * CONST.BOARD.offsetX,
        y: -pos.y * CONST.BOARD.offsetY,
        scaleX:CONST.BOARD.scaleZoomIn,
        scaleY:CONST.BOARD.scaleZoomIn
    };
    this.board_.set(setting);
    this.hideAllGrid_();
    this.grids_[pos.x][pos.y].visible = true;
    this.grids_[pos.x][pos.y].enableUserInteraction();
};
miniiw.features.factoryminigame.view.Board.prototype.hideAllGrid_ = function(){
    BOK.loop(CONST.BOARD.width, function(i){
        BOK.loop(CONST.BOARD.height, function(j) {
            this.grids_[i][j].visible = false;
        }, this);
    }, this);
};
miniiw.features.factoryminigame.view.Board.prototype.isValidPos_ = function(x, y){
    return x >=0 && x < CONST.BOARD.width && y >=0 && y < CONST.BOARD.height;
};

miniiw.features.factoryminigame.view.Board.prototype.fadeAllButOneGrid_ = function(pos){
    BOK.loop(CONST.BOARD.width, function(i){
        BOK.loop(CONST.BOARD.height, function(j) {
            if(pos.x != i || pos.y != j) {
                createjs.Tween.get(this.grids_[i][j]).to({alpha:0.1}, 500, createjs.Ease.linear).set({visible:false});
            }
        }, this);
    }, this);

    this.grids_[pos.x][pos.y].enableUserInteraction();
};
