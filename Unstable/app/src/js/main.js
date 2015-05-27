/**
 * Created by JetBrains PhpStorm.
 * User: xliu
 * Date: 04/10/13
 * Time: 16:18
 * To change this template use File | Settings | File Templates.
 */

goog.provide("miniiw.main");
goog.require("bok.apps.preloader.PreloaderApp");
goog.require("bok.apps.splashscreen.SplashScreenApp");
goog.require("miniiw.MiniIWApp");

var preloaderApp, game, stretcher;
window.addEventListener('load', loadingStart);

function start()
{
    stretcher = new Stretcher(document.getElementById('canvas'));
    stretcher.showFPS();

    var splashScreen = new SplashScreenApp(stretcher.stage);
    splashScreen.addEventListener(Event.COMPLETE, loadingStart);

    splashScreen.start();
}

imgContainer = {};
function loadingStart()
{
    stretcher = new Stretcher(document.getElementById('canvas'));
    preloaderApp = new CanvasPreloaderApp([
        'resource/bg/BOKBG0.png',
        'resource/bg/BOKTOP.png',
        'resource/bg/bokbg.png',
        'resource/bg/combo_bg.png',
        'resource/btn/BOKtop.png',
        'resource/btn/btn_break.png',
        'resource/btn/CHAIN.png',
        'resource/btn/btn_exit.png',
        'resource/btn/stable.png',
        'resource/icon/icon_0.png',
        'resource/icon/icon_1.png',
        'resource/icon/icon_2.png',
        'resource/icon/icon_3.png',
        'resource/icon/icon_4.png',
        'resource/icon/icon_f_0.png',
        'resource/icon/icon_f_1.png',
        'resource/icon/icon_f_2.png',
        'resource/icon/icon_f_3.png',
        'resource/icon/icon_f_4.png',
        'resource/effect/bomb.png',
        'resource/effect/link.png'], imgContainer, stretcher);
    preloaderApp.addEventListener(Event.COMPLETE, assetsLoaded);

    preloaderApp.start();

    createjs.Sound.registerSound("resource/sound/bomb.ogg", "bomb_l", 2);
    createjs.Sound.registerSound("resource/sound/bomb1.mp3", "bomb_s", 4);
}

function assetsLoaded()
{
    game = new MiniIWApp(stretcher);
    game.start();
}
