/**
 * Created by xinyiliu on 3/17/15.
 */
goog.provide("hkcd.features.main.components.ui.QuestionPanel");


var QuestionPanel = {
    init: function (){
        this.currentTitle_ = '';
        this.panel = $('#questionText');
        this.title = this.panel.find('h1');
        this.content = this.panel.find('p');
        this.answers = this.panel.find('input');

        this.nextBtn = this.panel.find('.next-button');
        this.closeBtn = this.panel.find('.close-button');
        this.closeBtn.click(Delegate.create(this,function(){
            this.hide();
        }));
    }
};


QuestionPanel.showPanel = function(title, content, answers) {
    AnimateHelper.animateOnceAndShow(this.panel, 'fadeInDownBig');
    this.nextBtn.show();

    this.populateTitle(title);
    this.showQuestion(content, answers);
};

QuestionPanel.showNextQuestion = function(title, content, answers) {
    if(this.currentTitle_ != title) {
        this.populateTitle(title);
    }

    this.showQuestion(content, answers);
};



QuestionPanel.getCurrentAnswer = function() {
    var result = [];
    this.answers.each(function(i) {
        if($(this).is(':checked')) {
            result.push(i);
        }
    });

    return result;
};

QuestionPanel.showQuestion = function(question, answers) {
    this.populateContent(question);
    this.populateAnswer(answers);
};


QuestionPanel.populateTitle = function(title) {
    this.currentTitle_ = title;
    this.title.html(title);
    this.content.html('');
    AnimateHelper.fadeInStringContent(this.title, 'fadeInDown', 0, 200);
};

QuestionPanel.populateAnswer = function(answers) {
    if (answers) {
        this.panel.find('.answer').show();
        this.resetInput();
        this.answers.each(function (i) {
            $(this).next().next().html(answers[i]);
        });
        AnimateHelper.fadeInElementList(this.panel.find('.answer>div'), 'fadeInLeft', 1000, 500);
    } else {
        this.panel.find('.answer').hide();
    }
};

QuestionPanel.populateContent = function(content) {
    this.content.html('');
    this.content.html(content);

    AnimateHelper.animateOnceWithFadeInDelay(this.content, 'fadeInRight', 500);
};

QuestionPanel.resetInput = function() {
    this.answers.prop('checked', false);
};

QuestionPanel.hide = function() {
    if(this.panel.is(':visible'))
        AnimateHelper.animateOnceAndHide(this.panel, 'bounceOutUp');
};

