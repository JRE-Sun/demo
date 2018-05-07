$(document).ready(() => {
    new Parabola();
    var flyer = $('<img class="u-flyer" src="http://pic2.sc.chinaz.com/files/pic/pic9/201804/zzpic11491.jpg">');
    flyer.fly({
        start      : {
            left: 300,  //开始位置（必填）#fly元素会被设置成position: fixed
            top : 300,  //开始位置（必填）
        },
        end        : {
            left  : 30, //结束位置（必填）
            top   : 900,  //结束位置（必填）
            // width : 100, //结束时高度
            // height: 100, //结束时高度
        },
        // autoPlay   : false, //是否直接运动,默认true
        speed      : 1.2, //越大越快，默认1.2
        vertex_Rtop: 100, //运动轨迹最高点top值，默认20
        onEnd      : function () {
        }
    });

    // flyer.play(); //autoPlay: false后，手动调用运动
    // $('#fly').destroy(); //移除dom
});