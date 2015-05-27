/**
 * Created by xinyiliu on 3/2/15.
 */

goog.provide("hkcd.features.main.MainFeature");
goog.require("bok.framework.core.MVCFeature");

goog.requireAll("hkcd.features.main.v.*");

BOK.inherits(MainFeature, MVCFeature);
/**
 * @constructor
 * @param {Container} stage
 * */
function MainFeature(stage) {
    MVCFeature.call(this);

    this.addMediator(new MainStageMediator(stage));
    this.addMediator(new PlayerSelectMediator(stage));
    this.addMediator(new QuestionMediator(QuestionPanel));
}

MainFeature.Notes = new FeatureNotesCollection('MainFeature');
MainFeature.Notes.addInternalNote('PLAYER_SELECTED');
MainFeature.Notes.addInternalNote('QUESTION_START');
MainFeature.Notes.addInternalNote('RETURN_TO_TAIKOO');

