/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 18/01/12
 * Time: 18:42
 *
 */


BOK.inherits(BGWithSwapFeature, MVCFeature);

/**
 * @param {div} expect a div element on DOM
 * @param {object} the list of BG name and image assets, in the format of:
 *      {
 *          BG_NAME : imagePath
 *      }
 * @return {void}
 * */
function BGWithSwapFeature(bgElement, assetsDef)
{
	MVCFeature.call(this);

	//create actors
	this.mediators.push(new BGMediator(bgElement, assetsDef));
}
//set notes
//receiving note
/**
 * Expecting msg:
 *      {
 *          bgName:name,
 *          connectNote:note
 *      }
 * */
BGWithSwapFeature.notes.DISPLAY_VIEW_CHANGE = "[IN]DisplayViewChange";

//out-going note
/**
 * Sending msg: current back ground name
 * */
BGWithSwapFeature.notes.WHEN_BG_SWAP_COMPLETE = "[OUT]WhenBGSwapComplete";



