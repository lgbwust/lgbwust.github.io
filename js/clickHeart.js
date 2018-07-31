(function(window,document,undefined){
var hearts = [];
window.requestAnimationFrame = (function(){
return window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function (callback){
setTimeout(callback,1000/60);
}
})();
init();
function init(){
css(".heart{width: 10px !important;height: 10px !important;position: fixed !important;background: #f00 !important;transform: rotate(45deg) !important;-webkit-transform: rotate(45deg) !important;-moz-transform: rotate(45deg) !important;}.heart:after,.heart:before{content: '';width: inherit !important;height: inherit !important;background: inherit !important;border-radius: 50% !important;-webkit-border-radius: 50% !important;-moz-border-radius: 50% !important;position: absolute !important;}.heart:after{top: -5px !important;}.heart:before{left: -5px !important;}");
attachEvent();
gameloop();
}
function gameloop(){
for(var i=0;i<hearts.length;i++){
if(hearts[i].alpha <=0){
document.body.removeChild(hearts[i].el);
hearts.splice(i,1);
continue;
}
hearts[i].y--;
hearts[i].scale += 0.004;
hearts[i].alpha -= 0.013;
hearts[i].el.style.cssText = "left:"+hearts[i].x+"px;top:"+hearts[i].y+"px;opacity:"+hearts[i].alpha+";transform:scale("+hearts[i].scale+","+hearts[i].scale+") rotate(45deg);background:"+hearts[i].color;
}
requestAnimationFrame(gameloop);
}
function attachEvent(){
var old = typeof window.onclick==="function" && window.onclick;
window.onclick = function(event){
old && old();
createHeart(event);
}
}
function createHeart(event){
var d = document.createElement("div");
d.className = "heart";
hearts.push({
el : d,
x : event.clientX - 5,
y : event.clientY - 5,
scale : 1,
alpha : 1,
color : randomColor()
});
document.body.appendChild(d);
}
function css(css){
var style = document.createElement("style");
style.type="text/css";
try{
style.appendChild(document.createTextNode(css));
}catch(ex){
style.styleSheet.cssText = css;
}
document.getElementsByTagName('head')[0].appendChild(style);
}
function randomColor(){
return "rgb("+(~~(Math.random()*255))+","+(~~(Math.random()*255))+","+(~~(Math.random()*255))+")";
}
})(window,document);
