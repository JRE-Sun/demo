'use strict';

$(document).ready(function () {
    // 纯dom彩蛋!
    new PullToRefresh({
        mainDom: 'body',
        pullStartDom: '<div class="vertical-center"><img src="https://c1.zcimg.com/static/index/img/g.png"\n    alt=""><p>\u7531\u638C\u5708\u63D0\u4F9B\u6280\u672F\u652F\u6301</p></div>'
    });

    // 执行下拉刷新
    new PullToRefresh({
        mainDom: '.main',
        pullStartDom: '<span>\u4E0B\u62C9\u52A0\u8F7D</span>',
        pullEndDom: '<span>\u52A0\u8F7D\u4E2D...</span>',
        pullCallBack: function pullCallBack(pull) {
            // 外界手动关闭pull,再执行外部刷新逻辑的时候,dom是不隐藏的,需要ajax后自己手动隐藏
            // pull.pullHide();
            console.log('pullCallBack,执行刷新;逻辑!');
        }
    });
});