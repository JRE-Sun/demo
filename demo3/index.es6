$(function () {
    new Carousel({
        parentClass: '.swiper0',
        childClass : '.slide0',
        autoPlay   : '2000',
        seize      : 1,
        loop       : true,
    });


    new Carousel({
        parentClass: '.swiper1',
        childClass : '.slide1',
        autoPlay   : '4000',
        loop       : true,
        init       : function (index) {
            console.log(`初始化index:${index}`);
        },
        changed    : function (index) {
            console.log('当前下标:' + index);
        },
    });

    new Carousel({
        parentClass: '.swiper2',
        childClass : '.slide2',
        autoPlay   : '2000',
        seize      : .7,
        loop       : true,
    });
});