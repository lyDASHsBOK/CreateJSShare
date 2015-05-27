/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-31
 * Time: 上午7:49
 * To change this template use File | Settings | File Templates.
 */
goog.provide('miniiw.features.factoryminigame.view.Effect');


miniiw.features.factoryminigame.view.Effect = function(type, option) {
    option = option ? option : {};
    if(!miniiw.features.factoryminigame.view.Effect.spriteSheets[type]) {
        switch(type) {
            case 'lightning':
                miniiw.features.factoryminigame.view.Effect.spriteSheets[type] = new createjs.SpriteSheet({
                    framerate:20,
                    images: ['resource/effect/link.png'],
                    frames: {width:90, height:460},
                    animations: {run:[0,3]}
                });
                break;
            case 'bomb':
                miniiw.features.factoryminigame.view.Effect.spriteSheets[type] = new createjs.SpriteSheet({
                    framerate:20,
                    images: ['resource/effect/bomb.png'],
                    frames: {width:90, height:90},
                    animations: {run:[0,5]}
                });
                break;

            default:
                throw Error('unknown effect name: '+type);
        }
    }

    createjs.Sprite.call(this, miniiw.features.factoryminigame.view.Effect.spriteSheets[type], "run");
    this.gotoAndPlay(0);

    if('lightning' == type) {
        if(option.isRow){
            this.y = 90;
            this.rotation = -90;
        }


        if(!option.looping){
            setTimeout(Delegate.create(this,function(){
                this.fadeOut();
            }), 300);
        }
    }
};
BOK.inherits(miniiw.features.factoryminigame.view.Effect, createjs.Sprite);

miniiw.features.factoryminigame.view.Effect.spriteSheets = {};
miniiw.features.factoryminigame.view.Effect.prototype.fadeOut = function(){
    createjs.Tween.get(this).to({alpha:0}, 200, createjs.Ease.linear).call(function(){
        this.parent.removeChild(this);
    });
};
