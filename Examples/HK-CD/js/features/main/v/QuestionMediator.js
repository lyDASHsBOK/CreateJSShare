/**
 * Created by xinyiliu on 3/19/15.
 */

goog.provide("hkcd.features.main.v.QuestionMediator");
goog.require('bok.framework.core.BaseMediator');

goog.requireAll('hkcd.features.main.components.ui.QuestionPanel');


BOK.inherits(QuestionMediator, BaseMediator);

function QuestionMediator(questionPanel) {
    BaseMediator.call(this);

    /** @type {QuestionPanel}*/
    this.panel_ = questionPanel;
    this.questions = CONST.QUESTION;
    this.currentQuestionNo_ = 0;
    this.score_ = 0;

    this.panel_.nextBtn.click(Delegate.create(this, this.onNextClicked));
}

/**
 * @override
 * */
QuestionMediator.prototype.declareInterestedNotifications = function() {
    this.declareInterest(MainFeature.Notes.getInternalNote('QUESTION_START'), this.onQuestionStart);
};


/**
 * Notification Handler
 * */
QuestionMediator.prototype.onQuestionStart = function() {
    //index starts as -1 because the first page is introduction
    this.currentQuestionNo_ = -1;
    this.score_ = 0;
    this.panel_.showPanel('有奖知识问答', '欢迎来到有奖问答活动。参与活动可以获得主办方提供的精美奖品。点击下一页按钮开始答题。');
};

/**
 * Event handler
 * */
QuestionMediator.prototype.onNextClicked = function() {
    if(!this.checkResultUpdateScore_()) {
        return;
    }

    //prep next question
    this.currentQuestionNo_++;
    if(this.currentQuestionNo_ < this.questions.length) {
        var question = this.questions[this.currentQuestionNo_];
        var titleAppendix = question.correct.length > 1 ? ' (多选)' : '';
        this.panel_.showNextQuestion(question.title + titleAppendix, question.question, question.answer);
    } else {
        switch (this.currentQuestionNo_) {
            case this.questions.length:
                var questionNumber = this.questions.length,
                    title, content;
                if(this.score_ == questionNumber) {
                    title = '太棒了！';
                    content = '恭喜你答对了所有问题！请点击下一页领取奖品。<br>谢谢您的参与。';
                } else {
                    title = '答题结束';
                    content = '您答对了'+questionNumber+'道题中的'+this.score_+'道。<br>请点击下一页领取奖品。<br>谢谢您的参与。';
                }
                this.panel_.showNextQuestion(title, content);
                break;
            case this.questions.length + 1:
                this.panel_.showNextQuestion(CONST.REWARD_MSG.title, CONST.REWARD_MSG.content);
                this.panel_.nextBtn.hide();
                var qrDiv = this.panel_.content.find('div');
                var sideLength = Math.min(qrDiv.width(), qrDiv.height());
                qrDiv.width(sideLength);
                qrDiv.height(sideLength);
                qrDiv.css('position', 'static');
                break;
        }
    }
};

QuestionMediator.prototype.checkResultUpdateScore_ = function() {

    //skip index -1 as it's intro
    if(this.currentQuestionNo_ < 0)
        return true;
    //skip index higher than question list as it's post message
    if(this.currentQuestionNo_ >= this.questions.length)
        return true;

    //check result
    var answer = this.panel_.getCurrentAnswer();
    if (answer.length) {
        //check result
        var expected = this.questions[this.currentQuestionNo_].correct;
        if (expected.toString() == answer.toString()) {
            this.score_++;
        }

        return true;
    } else
        return false;
};

