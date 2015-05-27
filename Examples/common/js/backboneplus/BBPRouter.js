/**
 * This class requiress backbone.js
 */
goog.provide('bok.backboneplus.BBPRouter');
goog.require('bok.BOK');

BOK.inherits(BBPRouter, Backbone.Router);
/**
 * @constructor
 * @param {BBPView} shellView
 * */
function BBPRouter(shellView){
    Backbone.Router.call(this);

    this.viewFunc = {};
    this.views = {};

    //init shell view
    this.views.shell = shellView;
    $('body').html(this.views.shell.render().el);
}

/**
 * @param {Object} routes Reg routes by provide key pairs
 * */
BBPRouter.prototype.regRoutes = function(routes) {
    if(!BBPRouter.prototype.routes)
        BBPRouter.prototype.routes = {};

    for(var key in routes) {
        BBPRouter.prototype.routes[key] = routes[key];
    }

    this._bindRoutes();
};

/**
 * @override
 * Due to backbone implementation the only way to override this execute function is this hacky way.
 * */
BBPRouter.prototype.execute = function (callback, args) {
    if('function' == typeof callback)
        callback.apply(this, args);
    else {
        var routeName = Backbone.history.getFragment().replace(/\/.*/, '');
        var defaultFunc = this.viewFunc[routeName];
        defaultFunc && defaultFunc.apply(this, args);
    }
};

/**
 * @param {string} viewName
 * @param {BBPView} view
 * */
BBPRouter.prototype.createGenericView = function(viewName, view) {
    this.views[viewName] = view;
    view.render();

    this.viewFunc[viewName] = Delegate.create(this, function() {
        var shell = this.views.shell;
        var routeArgs = arguments;
        shell.writeContent(view);
        view.refresh && view.refresh.apply(view, routeArgs);
    });
};

