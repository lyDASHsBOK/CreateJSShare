/**
 * Created by xinyiliu on 5/27/15.
 */

//init stage
var stage = new createjs.Stage(document.getElementById('canvas'));
function tick(e) {
    stage.update(e);
}
//base render loop
//Option 1
//(function animationFrame(){
//    tick();
//    requestAnimationFrame(animationFrame);
//})();
//Option 2
//    createjs.Ticker.addEventListener("tick", tick);

//Shape
//var shape = new createjs.Shape();
//shape.graphics.beginFill('#FF0000').drawCircle(100, 10, 10);
//stage.addChild(shape);

//var text = new createjs.Text("Canvas Text!", "60px Arial", "#000000");
//stage.addChild(text);

//bitmap
//var house = new createjs.Bitmap('img/CD1.png');
//stage.addChild(house);
//house.scaleX = house.scaleY = 0.5;
//house.x = 200;
//house.y = 100;
//house.rotation = 90;

//container
//var group = new createjs.Container();
//group.addChild(shape);
//group.addChild(house);
//group.set({x:50, y: 50});
//group.set({scaleX:0.5, scaleY: 0.5});
//stage.addChild(group);


//Tween animation
//function animateSomething(obj){
//    var animateFunc = function() {
//        createjs.Tween.get(obj).
//            to({x: 300, alpha: 0}, 500).
//            wait(500).
//            to({x: 10, alpha: 1}, 1000, createjs.Ease.cubicOut).
//            call(animateFunc);
//    };
//
//    animateFunc();
//}
//animateSomething(shape);
//createjs.Ticker.setFPS(60);

//sprite
//var sheet = new createjs.SpriteSheet({
//    framerate: 7,
//    images: ['img/maleRun.png'],
//    frames: {width:148, height:256},
//    animations: {run:[0,5]}
//});
//var boy = new createjs.Sprite(sheet, 'run');
//stage.addChild(boy);
//animateSomething(boy);