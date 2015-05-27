/**
 * @fileoverview
 * @author: lys
 * Date: 12-10-17
 * Time: 下午10:07
 *
 * This feature provide the functionality of save game to local/remote archive.
 */
goog.provide("bok.features.gamesave.GameSaveFeature");
goog.require("bok.features.gamesave.GameSaveFeatureNotes");
goog.require("bok.framework.core.MVCFeature");
goog.require("org.jsv.jsv");
goog.requireAll("bok.features.gamesave.c.*");
goog.requireAll("bok.features.gamesave.m.*");

BOK.inherits(GameSaveFeature, MVCFeature);

function GameSaveFeature()
{
	MVCFeature.call(this, 'GameSaveFeature');

	//install actors
	//m
	this.addProxy(new LocalSaveProxy(JSV.createEnvironment()));

	//c
	this.addCommand(GameSaveFeatureNotes.getInputNote('QUICK_SAVE'), QuickSaveCMD);
	this.addCommand(GameSaveFeatureNotes.getInputNote('QUICK_LOAD'), QuickLoadCMD);
	this.addCommand(GameSaveFeatureNotes.getInputNote('SAVE'), SaveGameCMD);
	this.addCommand(GameSaveFeatureNotes.getInputNote('LOAD'), LoadGameCMD);
	this.addCommand(GameSaveFeatureNotes.getInputNote('REG_SLOT_SCHEMA'), RegSlotSchemaCMD);
}


/**
 * Note body: {Object}
 * body format:
 * {
 *     name: {string}   //name of save slot
 *     data: {Object}   //data content
 * }
 * */
GameSaveFeature.notes.input.SAVE = '[IN]SAVE';

/**
 * Note body: {Object}
 * body format:
 * {
 *     name: {string}   //name of save slot
 *     callback: {Function}   //callback function for loaded data
 * }
 * */
GameSaveFeature.notes.input.LOAD = '[IN]LOAD';

/**
 * Note body: {Object}
 * Any game save data will be stored in JSON format.
 * Game save can be any data structure.
 * */
GameSaveFeature.notes.input.QUICK_SAVE = '[IN]QUICK_SAVE';

/**
 * Note body: {String}
 * The notification to feedback the loaded save data
 * */
GameSaveFeature.notes.input.QUICK_LOAD = '[IN]QUICK_LOAD';
