/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 16/09/13
 * Time: 15:08
 *
 */
goog.provide("bok.framework.core.FeatureNotesCollection");

/**
 * @param {String} featureName
 * @constructor
 * */
function FeatureNotesCollection(featureName)
{
    this.featureName_ = featureName;

    this.input_ = {};
    this.output_ = {};
    this.internal_ = {};
}

FeatureNotesCollection.prototype.getInputNoteWithFeatureName = function(name)
{
    return this.featureName_ + '.' + this.input_[name];
};
FeatureNotesCollection.prototype.getOutputNoteWithFeatureName = function(name)
{
    return this.featureName_ + '.' + this.output_[name];
};


FeatureNotesCollection.prototype.getInputNote = function(name)
{
    return this.input_[name];
};
FeatureNotesCollection.prototype.addInputNote = function(name)
{
    this.input_[name] = '[IN]' + name;
};

FeatureNotesCollection.prototype.getOutputNote = function(name)
{
    return this.output_[name];
};
FeatureNotesCollection.prototype.addOutputNote = function(name)
{
    this.output_[name] = '[OUT]' + name;
};

FeatureNotesCollection.prototype.getInternalNote = function(name)
{
    return this.internal_[name];
};
FeatureNotesCollection.prototype.addInternalNote = function(name)
{
    this.internal_[name] = '[INTERNAL]' + name;
};
