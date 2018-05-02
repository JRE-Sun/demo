'use strict';

$(function () {
    new Carousel({
        parentClass: '.swiper-wrapper',
        childClass: '.swiper-slide',
        autoPlay: '2000',
        seize: 0.7,
        loop: true
    });
});
