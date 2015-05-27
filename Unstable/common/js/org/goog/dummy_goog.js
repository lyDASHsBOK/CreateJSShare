/**
 * @fileoverview
 * //TODO: write file description here
 *
 * @author xliu
 * Date: 11/06/13
 * Time: 15:00
 */
goog = {};
goog.provide = function(str){
	var ary = str.split('.');
	var scope = window;
	for(var i=0; i<ary.length; ++i)
	{
		if(ary[i] && !scope[ary[i]])
			scope[ary[i]] = {};
		scope = scope[ary[i]];
	}
};
goog.require = function(str){};
goog.requireAll = function(str){};
goog.exportSymbol = function(name, obj){};
