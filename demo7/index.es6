$(document).ready(() => {
    let list = [];

    $('#div img').forEach(function (img) {
        console.log(1);
        let self = $(img);
        let data = {
            type : 'img',
            src  : self.attr('src'),
            style: {
                top   : self.offset().top,
                left  : self.offset().left,
                width : self.width(),
                height: self.height(),
            },
        };
        list.push(data);
    });

    $('#div *').forEach(function (ele) {
        let self = $(ele);



        if (self[0].innerText == '') return;
        let data = {
            text : self[0].innerText,
            style: {
                top : self.offset().top,
                left: self.offset().left,
                font: {
                    family: 'PingFang',
                    size  : self.css('font-size'),
                    color : self.css('color'),
                }
            }
        };
        list.push(data);
    });

    new ScreenShot({
        canvas  : {
            width : $('body').width(),
            height: $('body').height(),
            style : {
                width : $('body').width(),
                height: $('body').height()
            }
        },
        complete: () => {
            console.log('img生成!');
        },
        list    : list,
    });
});