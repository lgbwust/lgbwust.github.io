$(function(){
  var height=$(window).width();
  $('#test').css({
    'height':height,
  });
  var n=1;
  $('#test').click(function(e){
    if(n%2==0){
      var $i=$('<b></b>').text('你点击了一下');//双数显示这个
    }else{
      var $i=$('<b></b>').text('❤');//单数显示这个
    }
    n++;
    var x=e.pageX,y=e.pageY;//获取鼠标点击的位置坐标
    $i.css({
        "z-index": 9999,
        "top": y - 20,
        "left": x,
        "position": "absolute",
        "color": 'red',
        "font-size": 14,
      });
      $("body").append($i);
      $i.animate({
        "top": y - 180,
        "opacity": 0
      }, 1500, function() {
        $i.remove();
      });//设置动画
  });
});
