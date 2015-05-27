/**
 * @author lys.BOK
 * Date: 14-2-17
 * Time: 下午7:23
 *
 * File over view.
 */
goog.provide("bok.util.BOK2DGeo");

var BOK2DGeo = {};

/**
 * Valid usage:
 *   - new BOK2DGeo.Vec2(a, b)
 *   - new BOK2DGeo.Vec2({x:a, y:b})
 * @param {Number|Object} x
 * @param {Number=} y
 * */
BOK2DGeo.Vec2 = function(x, y)
{
    if('number' == typeof x)
    {
        this.x = x;
        this.y = y;
    }
    else if('object' == typeof x)
    {
        this.x = x.x;
        this.y = x.y;
    }
};

/**
 * @param {BOK2DGeo.Vec2} v1
 * @param {BOK2DGeo.Vec2} v2
 * */
BOK2DGeo.Vec2['+'] = function(v1, v2)
{
    return new BOK2DGeo.Vec2(v1.x + v2.x, v1.y + v2.y);
};
/**
 * @param {BOK2DGeo.Vec2} v1
 * @param {BOK2DGeo.Vec2} v2
 * */
BOK2DGeo.Vec2['-'] = function(v1, v2)
{
    return new BOK2DGeo.Vec2(v1.x - v2.x, v1.y - v2.y);
};

BOK2DGeo.Vec2.prototype.normalize = function()
{
    var abs = this.abs();
    this.x /= abs;
    this.y /= abs;
};

/**
 * The reduced number of vector
 * @return {Number}
 * */
BOK2DGeo.Vec2.prototype.abs = function()
{
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * The angle of this vector
 * @return {Number} in degree
 * */
BOK2DGeo.Vec2.prototype.toAngle = function()
{
    //it is minus on y axis because it is the other way round for Y
    //as y increases objects moving down instead of up
    return Math.atan2(this.x, -this.y) * 180 / Math.PI;
};

/**
 * Rotate vector counter-clock wise.
 * @param {Number} deg Rotation angle, in degree.
 * */
BOK2DGeo.Vec2.prototype.rotate = function(deg)
{
    var rad = deg / 180 * Math.PI;

    var cs = Math.cos(rad);
    var sn = Math.sin(rad);
    var newX = this.x * cs - this.y * sn;
    var newY = this.x * sn + this.y * cs;

    this.x = newX;
    this.y = newY;

    return this;
};
/**
 * @param {Number} scaleX
 * @param {Number=} scaleY
 * */
BOK2DGeo.Vec2.prototype.scale = function(scaleX, scaleY)
{
    if(undefined == scaleY)
        scaleY = scaleX;
    this.x *= scaleX;
    this.y *= scaleY;

    return this;
};

/**
 * Find the distance between two pos
 * @param {BOK2DGeo.Vec2} posA
 * @param {BOK2DGeo.Vec2} posB
 * */
BOK2DGeo.dist = function(posA, posB)
{
    var distX = posA.x - posB.x;
    var distY = posA.y - posB.y;
    return Math.sqrt(distX * distX + distY * distY);
};

/**
 * Find a empty spot in the grid close to given spot.
 * @param {Array} grid2D 2D Array with true on cell means it's taken and false on cell means it's empty
 * @param {BOK2DGeo.Vec2} pos
 * */
BOK2DGeo.findNearestEmptySpot = function(grid2D, pos)
{
    var MAX_RANGE = 100;
    var searchRange = 1;
    var foundPos = null;

    while(!foundPos && searchRange < MAX_RANGE)
    {
        for(var i=pos.x-searchRange; i<pos.x+searchRange; ++i)
        {
            if(i < 0)
                i = 0;

            var offX = Math.abs(pos.x - i);
            var offY = searchRange - offX;
            if(!grid2D[i][pos.y+offY])
            {
                foundPos = {x:i, y:pos.y+offY};
                break;
            }
            if(offY > 0 && pos.y-offY > 0 && !grid2D[i][pos.y-offY])
            {
                foundPos = {x:i, y:pos.y-offY};
                break;
            }
        }

        searchRange++;
    }

    return foundPos;
};
