/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 17/09/13
 * Time: 18:04
 *
 */
goog.provide("bok.features.gamesave.GameSaveFeatureNotes");
goog.require("bok.framework.core.FeatureNotesCollection");
var GameSaveFeatureNotes = new FeatureNotesCollection('GameSaveFeature');

/**
 * Note body: {Object}
 * body format:
 * {
 *     name: {string}   //name of save slot
 *     data: {Object}   //data content
 * }
 * */
GameSaveFeatureNotes.addInputNote('SAVE');

/**
 * Note body: {Object}
 * body format:
 * {
 *     name: {string}   //name of save slot
 *     callback: {function(data){}}   //callback function for loaded data
 * }
 * */
GameSaveFeatureNotes.addInputNote('LOAD');

/**
 * Note body: {Object}
 * Any game save data will be stored in JSON format.
 * Game save can be any data structure.
 * */
GameSaveFeatureNotes.addInputNote('QUICK_SAVE');

/**
 * Note body: {String|Function|Object}
 * The body can be:
 *      1. String: The notification to feedback the loaded save data
 *      2. Function: The call back function will be invoked and loaded data as the parameter.
 *      3. Object: Expecting format {data:null} The loadded data will be placed under container key named 'data'
 * */
GameSaveFeatureNotes.addInputNote('QUICK_LOAD');

/**
 * Note body: {
 *     name: {string},
 *     schema: {Object}
 * }
 * The notification to feedback the loaded save data
 * */
GameSaveFeatureNotes.addInputNote('REG_SLOT_SCHEMA');
