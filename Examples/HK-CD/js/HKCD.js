/**
 * Created by Envee.
 *
 * Date: 14-10-21
 * Time: 上午8:56
 * @author: <a href="526597516@qq.com">luyc</a>
 * @version: 0.1
 */

goog.provide("hkcd.HKCDApp");
goog.require("bok.framework.App");

goog.require("hkcd.features.main.MainFeature");

/**
 * @param{createjs.Container} stage
 * */
BOK.inherits(HKCDApp, App);
function HKCDApp(stage) {
    App.call(this);

    this.addFeature(new MainFeature(stage));
}
