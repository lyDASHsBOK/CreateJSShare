/**
 * @fileoverview
 * //TODO: write file description here
 *
 * @author xliu
 * Date: 26/10/12
 * Time: 11:53
 */
goog.provide("bok.framework.util.frameworkUtil");

var frameworkUtil = {};

frameworkUtil.getDomainPath = function(parentDomain, currentDomain)
{
	return parentDomain ? parentDomain + '.' + currentDomain : currentDomain;
};

frameworkUtil.getParentDomain = function(currentDomain)
{
    var path = currentDomain.split('.');
    path.splice(-1);
	return path.join('.');
};

/**
 * @param {Function} actorClass
 * @param {string} actorName
 * */
frameworkUtil.getActorDomain = function(actorClass, actorName)
{
	return frameworkUtil.getDomainPath(actorClass.domain, actorName);
};