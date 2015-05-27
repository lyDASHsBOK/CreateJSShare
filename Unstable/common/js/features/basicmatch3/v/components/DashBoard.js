/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-10-3
 * Time: 下午8:31
 *
 */
goog.provide("bok.features.basicmatch3.v.components.DashBoard");

goog.require("bok.easelui.EsButton");
goog.require("bok.util.EaselAnimationHelper");
goog.require("bok.features.basicmatch3.v.components.Icon");
goog.require("bok.features.basicmatch3.v.components.IconCounter");


bok.features.basicmatch3.v.components.DashBoard = function()
{
    createjs.Container.call(this);

    /** icon score record
     * @type {Array} with content of {bok.features.basicmatch3.v.components.IconCounter} instances
     */
    this.iconGroups_ = [];

    /** game records
     * @type {Object}
     */
    this.records_ = {};

    this.init_();

    this.visible = bok.features.basicmatch3.v.components.DashBoard.SETTINGS.DISPLAY;
};
BOK.inherits(bok.features.basicmatch3.v.components.DashBoard, createjs.Container);

//settings are loaded in feature class
bok.features.basicmatch3.v.components.DashBoard.SETTINGS = {};

bok.features.basicmatch3.v.components.DashBoard.RECORD_ITEMS = {
    BIGGEST_MULTIPLIER: 'BiggestMultiplier',
    BIGGEST_SINGLE_WINNING: 'BiggestSingleWinning',
    BIGGEST_REACT_WINNING: 'BiggestReactWinning'
};

bok.features.basicmatch3.v.components.DashBoard.prototype.setRecord = function(name, number)
{
    var current = this.records_[name];
    if(current && number <= current)
        return;

    this.records_[name] = number;
};

bok.features.basicmatch3.v.components.DashBoard.prototype.addIconCount = function(type, count)
{
    this.iconGroups_[type].addIconCount(count);
    this.setRecord(bok.features.basicmatch3.v.components.DashBoard.RECORD_ITEMS.BIGGEST_SINGLE_WINNING, count);
};

/**
 * @return {Object}
 * */
bok.features.basicmatch3.v.components.DashBoard.prototype.getRawData = function()
{
    var raw = {};

    var icons = {};
    BOK.each(this.iconGroups_, function(item, index){
        if(item)
            icons[index] = item.getIconCount();
    });

    var records = BOK.cloneObject(this.records_);

    raw['icons'] = icons;
    raw['records'] = records;

    return raw;
};

/**
 * @param {Object} data The raw data loaded from external.
 * */
bok.features.basicmatch3.v.components.DashBoard.prototype.setBoardData = function(data)
{
    if(!data)
        return;

    var iconData = data['icons'];
    var recordData = data['records'];

    BOK.each(this.iconGroups_, function(item, index){
        if(iconData[index] && item)
            item.setIconCount(iconData[index]);
    });

    this.records_ = recordData || {};
};

/**
 * @private
 * */
bok.features.basicmatch3.v.components.DashBoard.prototype.init_ = function()
{
    //init grid
    var SETTINGS = bok.features.basicmatch3.v.components.DashBoard.SETTINGS;
    var ICON_SETTINGS = bok.features.basicmatch3.v.components.Icon.SETTINGS;
    var GRID_SETTINGS = bok.features.basicmatch3.v.components.GridBoard.SETTINGS;
    var area = new createjs.Shape();
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        GRID_SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*GRID_SETTINGS.WIDTH,
        GRID_SETTINGS.FRAME_WIDTH);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, SETTINGS.HEIGHT,
        GRID_SETTINGS.FRAME_WIDTH*2 + ICON_SETTINGS.WIDTH*GRID_SETTINGS.WIDTH,
        GRID_SETTINGS.FRAME_WIDTH);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        0, 0,
        GRID_SETTINGS.FRAME_WIDTH,
        SETTINGS.HEIGHT);
    area.graphics.beginFill('rgba(20,20,20,1)').drawRect(
        GRID_SETTINGS.FRAME_WIDTH + ICON_SETTINGS.WIDTH*GRID_SETTINGS.WIDTH, 0,
        GRID_SETTINGS.FRAME_WIDTH,
        SETTINGS.HEIGHT);
    this.addChild(area);

    //init icon group
    for(var i=0; i<GRID_SETTINGS.MAX_ICON_TYPES; ++i)
    {
        var row = Math.floor(i / SETTINGS.MAX_COLUMN);
        var column = i % SETTINGS.MAX_COLUMN;
        this.iconGroups_[i] = new bok.features.basicmatch3.v.components.IconCounter(i);
        this.iconGroups_[i].set({
            x: SETTINGS.LEFT + SETTINGS.ICON_SPACE_H * column,
            y: SETTINGS.TOP + SETTINGS.ICON_SPACE_V * row });
        if(row >= SETTINGS.MAX_ROW)
            this.iconGroups_[i].visible = false;
        this.addChild(this.iconGroups_[i]);
    }
};

