function arrange(){
    // 原生JS的写法
    // var w = document.documentElement.clientWidth
    var w = $(window).width()
    var h = $(window).height()
    var centerX = w / 2
    var centerY = h / 2
    $('#xc div').each(function(){
        var left = Math.random() * centerX + centerX / 2 - 50
        var top = Math.random() * centerY + centerY / 2 - 60
        // Math.random()取值0~1 但是永远取不到1
        var rotate = Math.random() * 80 - 40
        $(this).css({
            //  变量调用的时候不加引号,但是html,css写入时必须要加引号,不然js会把它当做变量处理
            'top':top,
            'left':left,
            'position':'absolute',
            //  字符串拼接
            'transform':'rotate('+ rotate +'deg)'
        })
    }) 
}
// 函数必须调用才可以执行,匿名函数不能调用
arrange()
// 当浏览器窗口发生变化的时候,重新获取浏览器视窗口的宽高,重新定位图片
// $(window).resize(arrange)
// 当页面加载完后
$(function(){
    $('#xc div a').fancybox({
        //开启弹性弹出和关闭的效果
        openEffect:'elastic',
        closeEffect:'elastic',
        closeBtn:false,
        autoPlay:true,
        helpers:{
            buttons:{},
            title:{type:'inside'},
            thumbs:{alwaysCenter:true},           
        },
        //load:加载,在加载之前
        beforeLoad:function(){
            this.title=$(this.element).text()
        }
    })
})