'use strict';

$(document).ready(function () {
    var titleList = [{}, {
        minID: 1,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登掌圈领主等级，当之无愧的王者！'
    }, {
        minID: 2,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登掌控四海等级，再努力一把即是巅峰！'
    }, {
        minID: 3,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈霸一方等级，离王者只差两步！'
    }, {
        minID: 4,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈荣耀等级，您是掌圈的荣耀！'
    }, {
        minID: 10,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈锋芒等级，锋芒初露的您必将所向披靡！'
    }, {
        minID: 50,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈之傲等级，掌圈以您为傲！'
    }, {
        minID: 100,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈守护等级，掌圈愿与您风雨兼程！'
    }, {
        minID: 250,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈入门等级，在前进的路上切勿贪恋沿途的风景！'
    }, {
        minID: 550,
        text: '昨日掌圈力已经达到topid，超越xx%的圈圈，荣登圈圈新锐等级，从萌新中脱颖而出！'
    }];

    var topId = 1;
    for (var item in titleList) {
        if (438 >= titleList[item].minID) topId = item;
    }
    console.log(topId, titleList[topId].text.replace(/topid/ig, 438).replace(/xx/ig, Math.ceil((10000 - 438) * 100) / 10000));
    // $('#honor-text').text();


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

    new SvgRadar({
        selector: '.text',
        width: 500,
        height: 500,
        dottedLine: '#fff',
        titleSize: 30,
        titleColor: '#fff',
        virtual: {
            borderColor: '#000'
        },
        vertex: {
            width: 2,
            color: '#333',
            r: 2
        },
        targetG: {
            fillColor: '#A4DAFF',
            borderColor: '#73A7FE'
        },
        list: [{
            title: '流量',
            distance: 1
        }, {
            title: '流量',
            distance: 1
        }, {
            title: '发布',

            distance: .8
        }, {
            title: '发布',

            distance: .79
        }, {
            title: '发布',

            distance: 1
        }, {
            title: '发布',

            distance: .6
        }]
    });

    setTimeout(function () {
        createScreenshot();
    }, 1000);

    function createScreenshot() {
        //海报html2canvas
        var srcDom = $('.text')[0],
            shareContent = srcDom,
            width = srcDom.offsetWidth,
            height = srcDom.offsetHeight,
            top = srcDom.offsetTop,
            scale = 2,
            canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
        canvas.width = width * scale;
        canvas.height = (height + top) * scale;
        ctx.scale(scale, scale);

        var opts = {
            allowTaint: false,
            taintTest: false,
            scale: scale,
            useCORS: true,
            canvas: canvas,
            async: true,
            width: width,
            height: height + top
        };
        if (location.href.search(/_h2cdeb/ig) > -1) {
            window.console.log = window.onerror;
            opts.logging = true;
        }

        try {
            html2canvas(shareContent, opts).then(function (canvas) {
                ;
                try {
                    var url = canvas.toDataURL("image/jpeg");
                    $('body').append('<img src="' + url + '" />');
                } catch (e) {
                    alert('生成海报失败，请截屏保存');
                }
            });
        } catch (e) {
            alert('生成海报失败:' + e.message);
        }
    }
});
