/**
 * Created by Envee.
 *
 * Date: 14-10-21
 * Time: 上午8:55
 * @author: <a href="526597516@qq.com">luyc</a>
 * @version: 0.1
 */

goog.provide("root.main");

goog.require("org.createjs.easeljs.SoundJS");
goog.require("bok.easelui.Stretcher");
goog.require("bok.apps.preloader.CanvasPreloaderApp");
goog.require("bok.apps.preloader.components.MoveObjectSkin");
goog.require("hkcd.HKCDApp");
goog.require("app.AssetsList");

var preloaderApp, game, rootStretcher, imgContainer = {};
window.addEventListener('load', start);

function start() {
    //update title
    document.head.getElementsByTagName('title')[0].innerHTML = CONST.APP.TITLE;

    //setup stretcher
    rootStretcher = new Stretcher(document.getElementById('canvas'), CONST.WINDOW.WIDTH, CONST.WINDOW.HEIGHT, '#f2efe9');
    rootStretcher.hideFPS();

    //setup pre-loader
    var loadingPlayer = new Player();
    loadingPlayer.move();
    var loadCanvasSkin = new MoveObjectSkin(loadingPlayer, '#2d7091');
    loadCanvasSkin.y = 400;
    preloaderApp = new CanvasPreloaderApp(imgList, imgContainer, rootStretcher, loadCanvasSkin);
    preloaderApp.preloadFonts(['Sosa']);
    preloaderApp.setLoadInterval(100);
    preloaderApp.addEventListener(Event.COMPLETE, assetsLoaded);

    preloaderApp.start();

    //reg sound assets
    createjs.Sound.registerSound("assets/audio/cd-bg.mp3", "cd");
    createjs.Sound.registerSound("assets/audio/hk-bg.mp3", "hk");
}

function assetsLoaded() {
    //setup HTML ui components
    TextPanel.init();
    QuestionPanel.init();

    //start game app
    game = new HKCDApp(rootStretcher);
    game.start();
}
