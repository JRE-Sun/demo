'use strict';

$(function () {

    new Carousel({
        parentClass: '.swiper-wrapper',
        childClass: '.img',
        autoPlay: '4000',
        seize: 1,
        loop: true
    });

    new Carousel({
        parentClass: '.swiper0',
        childClass: '.slide0',
        // autoPlay   : '1000',
        seize: .7,
        loop: true
    });

    new Carousel({
        parentClass: '.swiper1',
        childClass: '.slide1',
        autoPlay: '4000',
        loop: true,
        init: function init(index) {
            console.log('\u521D\u59CB\u5316index:' + index);
        },
        changed: function changed(index) {
            console.log('当前下标:' + index);
        }
    });

    new Carousel({
        parentClass: '.swiper2',
        childClass: '.slide2',
        autoPlay: '2000',
        seize: .7,
        loop: true
    });
});
