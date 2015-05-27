/**
 */

goog.provide('bok.Delegate');

var Delegate = {};

/**
 * @param {Object} scope
 * @param {Function} func
 * @param {...}
 * */
Delegate.create = function(scope, func) {
	/** @type {Arguments}*/
	var args = Array.prototype.slice.call(arguments, 2);

	//if no extra param provided return a dynamic delegate function 
	//else return a static delegate function using extra param.
	return undefined === args[0] ?
		function () {
			func.apply(scope, arguments);
		}
		:
		function () {
			func.apply(scope, args);
		};
};

/**
 * @param {Object} scope
 * @param {Function} func
 * */
Delegate.createDynamic = function(scope, func) {
	return function () {
		func.apply(scope, arguments);
	};
};
