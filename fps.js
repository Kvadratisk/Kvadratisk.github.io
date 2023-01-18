var outCounter = 0;
var element = null;
var frameCounter = new Uint8Array(20);
var counter = 0;
function fixedUpdate(x) {
    counter++;
    window.requestAnimationFrame(fixedUpdate);
}
function reset() {
    let tmp = counter*5;
    counter=0;
    if (outCounter<20) {
       frameCounter[outCounter]=tmp;
       outCounter++;
       return;
    }
    for (let i = 19; i >= 0; i--) {
        let save = frameCounter[i];
        frameCounter[i] = tmp;
        tmp = save;
    }
}
function showFPS() {
    if (element==null) {
        element=document.getElementById("fpsCounter");
        if (element==null) return;
    }
    let average = 0;
    for (let i = 0; i < outCounter; i++) {
       average+=frameCounter[i];
    }
    average=Math.round(average/outCounter);
    element.innerHTML="FPS: "+average;
}
window.onload = function() {
    window.setInterval(reset,200);
    window.setInterval(showFPS,400);
    window.requestAnimationFrame(fixedUpdate);
} 
/*
(5831/144) vs 
*/   