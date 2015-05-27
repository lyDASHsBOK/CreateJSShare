/**
 * Created by xinyiliu on 3/17/15.
 */
goog.provide("hkcd.features.main.components.ui.TextPanel");


var TextPanel = {
    init: function (){
        this.panel = $('#descText');
        this.title = this.panel.find('h1');
        this.content = this.panel.find('p');

        this.closeBtn = this.panel.find('.close-button');
        this.closeBtn.click(Delegate.create(this,function(){
            this.hide();
        }));
    }
};


TextPanel.showPanel = function(title, showCloseBtn) {
    this.title.html(title);
    this.content.html('');
    AnimateHelper.animateOnceAndShow(this.panel, 'fadeInDownBig');
    AnimateHelper.fadeInStringContent(this.title, 'fadeInDown', 0, 200);

    if(!showCloseBtn)
        this.closeBtn.hide();
    else
        this.closeBtn.show();
};

TextPanel.populateContent = function(content) {
    this.content.html(content);

    AnimateHelper.animateOnce(this.content, 'fadeIn');
};

TextPanel.hide = function() {
    if(this.panel.is(':visible'))
        AnimateHelper.animateOnceAndHide(this.panel, 'bounceOutUp');
};

