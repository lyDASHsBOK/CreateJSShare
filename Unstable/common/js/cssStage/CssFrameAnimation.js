//inherits

goog.provide("bok.cssstage.CssFrameAnimation");
goog.require("bok.cssstage.CssImage");

BOK.inherits(CssFrameAnimation, CssImage);

/**
 * @param {string} path The path of src sprit sheet image.
 * @param {int} width The width of a single frame.
 * @param {int} height The height of a single frame.
 * @param {int} gridWidth Number of frames in a row, a sprite sheet can have multiple rows.
 * @param {int} totalFrame The total frames of this animation.
 * @param {number} interval The play interval of this animation.
 * */
function CssFrameAnimation(path, width, height, gridWidth, totalFrame, interval)
{
  CssImage.call(this, path, 0, 0, width, height);

  this.gridWidth = gridWidth;
  this.totalFrame = totalFrame;
  this.currentFrame = 0;
  this.isLooping = false;
  this.isPlaying = false;
  this.interval = interval;
}

////////////////////////////////////////////////////////////////////////////////
//public functions
CssFrameAnimation.prototype.nextFrame = function()
{
  this.currentFrame++;
  if(this.currentFrame >= this.totalFrame)
    this.currentFrame = 0;

  this.updateImage();
};

CssFrameAnimation.prototype.play = function()
{
  if(!this.isPlaying)
  {
    this.isPlaying = true;
    this.updateAnimation();
  }
};

CssFrameAnimation.prototype.stop = function()
{
  this.isPlaying = false;
};
////////////////////////////////////////////////////////////////////////////////
//private functions
CssFrameAnimation.prototype.updateAnimation = function()
{
  if(this.isPlaying)
  {
    this.nextFrame();
    if(!this.isLooping && this.currentFrame == this.totalFrame-1)
    {
      this.isPlaying = false;
      this.dispatchEvent(new Event(Event.COMPLETE));
    }
    else
      cssStageTool.requestAnimationFrame(Delegate.create(this, this.updateAnimation), this.interval);
  }
};

CssFrameAnimation.prototype.updateImage = function()
{
  var row = Math.floor(this.currentFrame / this.gridWidth);
  var column = this.currentFrame - row * this.gridWidth;
  this.spriteX = -column * this.spriteWidth;
  this.spriteY = -row * this.spriteHeight;

  this.div.style.backgroundPosition = this.spriteX+"px "+this.spriteY+"px";
};
