"use strict";

$(document).ready(function () {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#title");
    // 上个页面是不是为空,或者为undefined->直接跳转undefined
    window.addEventListener("popstate", function (e) {
        //根据自己的需求实现自己的功能
        if (typeof document.referrer == 'undefined' || document.referrer == '') {
            window.location.href = "http://jresun.gotoip4.com/blog/index.php/index/article/detail/art_id/62";
            e.stopPropagation();
            e.stopPropagation();
            return false;
        }
        window.history.go(-1);
    }, false);

    new DrawSvg({
        width: 500,
        height: 500,
        list: [{
            title: '流量',
            content: '第3名',
            distance: 1
        }, {
            title: '发布',
            content: '第25名',
            distance: .8
        }, {
            title: '发布',
            content: '第5名',
            distance: .79
        }, {
            title: '发布',
            content: '第25名',
            distance: 1
        }, {
            title: '发布',
            content: '第5名',
            distance: .6
        }]
    });
});
