'use strict';

$(document).ready(function () {
    var list = [];

    $('#div img').forEach(function (img) {
        console.log(1);
        var self = $(img);
        var data = {
            type: 'img',
            src: self.attr('src'),
            style: {
                top: self.offset().top,
                left: self.offset().left,
                width: self.width(),
                height: self.height()
            }
        };
        list.push(data);
    });

    $('#div *').forEach(function (ele) {
        var self = $(ele);

        if (self[0].innerText == '') return;
        var data = {
            text: self[0].innerText,
            style: {
                top: self.offset().top,
                left: self.offset().left,
                font: {
                    family: 'PingFang',
                    size: self.css('font-size'),
                    color: self.css('color')
                }
            }
        };
        list.push(data);
    });

    new ScreenShot({
        canvas: {
            width: $('body').width(),
            height: $('body').height(),
            style: {
                width: $('body').width(),
                height: $('body').height()
            }
        },
        complete: function complete() {
            console.log('img生成!');
        },
        list: list
    });
});
