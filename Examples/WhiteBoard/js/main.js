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
    createjs.Ticker.addEventListener("tick", tick);

//Shape
var shape = new createjs.Shape();
shape.graphics.beginFill('#FF0000').drawCircle(100, 10, 10);
stage.addChild(shape);

//Text
var text = new createjs.Text("Canvas Text!", "60px Arial", "#000000");
stage.addChild(text);

//bitmap
var house = new createjs.Bitmap('img/CD1.png');
stage.addChild(house);


//transform
house.scaleX = house.scaleY = 0.5;

//translate
house.x = 200;
house.y = 100;

//rotate
//house.rotation = 90;

//shadow filter
house.shadow = new createjs.Shadow('#000000', -5,5,5);

//container
var group = new createjs.Container();
group.addChild(shape);
group.addChild(house);
stage.addChild(group);

group.set({x:150, y: 250});

group.set({scaleX:0.5, scaleY: 0.5});


//Tween animation
function animateSomething(obj){
    var animateFunc = function() {
        createjs.Tween.get(obj).
            to({x: 300, alpha: 0}, 500).
            wait(500).
            to({x: 10, alpha: 1}, 1000, createjs.Ease.cubicOut).
            call(animateFunc);
    };

    animateFunc();
}

animateSomething(shape);

shape.set({scaleX: 2, scaleY:2});

createjs.Ticker.setFPS(60);

//sprite
var sheet = new createjs.SpriteSheet({
    framerate: 7,
    images: ['img/maleRun.png'],
    frames: {width:148, height:256},
    animations: {run:[0,5]}
});
var boy = new createjs.Sprite(sheet, 'run');
stage.addChild(boy);


//class
var aBoy = new Boy();
stage.addChild(aBoy);

aBoy.x = 200;

aBoy.shadow = new createjs.Shadow('#000000', -5,5,5);

group.addChild(aBoy);


