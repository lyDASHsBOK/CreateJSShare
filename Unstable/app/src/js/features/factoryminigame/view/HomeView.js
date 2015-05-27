/**
 * Created by JetBrains PhpStorm.
 * User: Administrator
 * Date: 14-8-31
 * Time: 上午10:13
 * To change this template use File | Settings | File Templates.
 */
goog.provide('miniiw.features.factoryminigame.view.HomeView');

miniiw.features.factoryminigame.view.HomeView = function() {
    createjs.Container.call(this);

    this.bg_ = new createjs.Bitmap('resource/bg/BOKBG0.png');
    this.addChild(this.bg_);

    this.text_ = new createjs.Bitmap('resource/btn/BOKtop.png');
    this.text_.set({x:157, y:373});
    this.addChild(this.text_);
};
BOK.inherits(miniiw.features.factoryminigame.view.HomeView, createjs.Container);

miniiw.features.factoryminigame.view.HomeView.prototype.hide = function() {
    this.visible = false;
    clearInterval(this.flashInterval_);
};
miniiw.features.factoryminigame.view.HomeView.prototype.show = function() {
    this.visible = true;

    createjs.Tween.get(this.text_).to({alpha:0}, 1500).to({alpha:1}, 700);
    this.flashInterval_ = setInterval(Delegate.create(this, function(){
        createjs.Tween.get(this.text_).to({alpha:0}, 1500).to({alpha:1}, 700);
    }), 3000)
};