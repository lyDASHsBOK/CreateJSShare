/**
 * This class requiress backbone.js
 */
goog.provide('bok.backboneplus.BBPShellView');
goog.require('bok.backboneplus.BBPView');

BOK.inherits(BBPShellView, BBPView);
/**
 * @constructor
 * @param {Function} template Could be the _ template object
 * */
function BBPShellView(template){
    BBPView.call(this, template);
}

/**
 * @param {BBPView} view
 * */
BBPShellView.prototype.writeContent = function (view) {
    $('#shellContent', this.$el).html(view.el);

    view.delegateEvents();
};
