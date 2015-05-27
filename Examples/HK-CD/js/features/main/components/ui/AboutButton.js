/**
 * Created by xinyiliu on 3/20/15.
 */

goog.provide("hkcd.features.main.components.ui.AboutButton");
goog.require("bok.util.EaselAnimationHelper");
goog.require("org.createjs.easeljs.EaselJS");

BOK.inherits(AboutButton, createjs.Container);
function AboutButton() {
    createjs.Container.call(this);
    this.btnAbout_ = new createjs.Bitmap('assets/img/btn-about.png');
    this.btnAbout_.set({x:25, y: 25, scaleX:1.1, scaleY:1.1});
    this.addChild(this.btnAbout_);

    this.addEventListener('click', function(){
        QuestionPanel.showPanel(CONST.ABOUT.title, CONST.ABOUT.content);
        QuestionPanel.nextBtn.hide();

        AnimateHelper.fadeInElementList(QuestionPanel.panel.find('p div'), 'bounceInRight', 700, 250);
    });
}