/**
 * This class requiress backbone.js
 */
goog.provide('bok.backboneplus.BBPView');
goog.require('bok.BOK');

BOK.inherits(BBPView, Backbone.View);
/**
 * @constructor
 * @param {string} template Could be the _ template object
 * */
function BBPView(template){
    Backbone.View.call(this);

    this.template = template ? _.template(template) : function(){
        throw Error('BBPView: please provide template for view.')
    };
}

BBPView.prototype.render = function () {
    this.$el.html(this.template());
    return this;
};
