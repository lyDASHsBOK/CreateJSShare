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
(function animationFrame(){
    tick();
    requestAnimationFrame(animationFrame);
})();
//Option 2
//    createjs.Ticker.addEventListener("tick", tick);

//Shape
var shape = new createjs.Shape();
shape.graphics.beginFill('#FF0000').drawCircle(100, 10, 10);
stage.addChild(shape);

//Tween animation
function animate(){
    createjs.Tween.get(shape).
        to({x:300, alpha:0}, 500).
        wait(500).
        to({x:10, alpha:1}, 1000, createjs.Ease.cubicOut).
        call(animate);
}
animate();
