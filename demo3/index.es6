$(function () {
    new Carousel({
        parentClass: '.swiper0',
        childClass : '.slide0',
        seize      : 1,
        loop       : true,
    });


    new Carousel({
        parentClass: '.swiper1',
        childClass : '.slide1',
        autoPlay   : '4000',
        seize      : 1,
    });

    new Carousel({
        parentClass: '.swiper2',
        childClass : '.slide2',
        autoPlay   : '4000',
        seize      : .7,
        loop       : true,
    });
});