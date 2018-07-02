'use strict';

$(document).ready(function () {
    var startTime = new Date().getTime() * 1 / 1000;
    var endTime = startTime + 60 * 60 * 60;
    var addZero = function addZero(val) {
        if (val < 10) return '0' + val;
        return val;
    };
    var getDateTime = function getDateTime(startTime, endTime) {
        var time = endTime - startTime;
        console.log(time);
        var day = addZero(Math.floor(time / (24 * 60 * 60)));
        var hour = addZero(Math.floor((time - day * 24 * 60 * 60) / (60 * 60)));
        var minute = addZero(Math.floor((time - day * 24 * 60 * 60 - hour * 60 * 60) / 60));
        var second = addZero(Math.floor(time - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60));
        return {
            day: day,
            hour: hour,
            minute: minute,
            second: second
        };
    };
    var timer = null;
    var date = {};
    setInterval(function () {
        startTime++;
        date = getDateTime(startTime, endTime);
        var ms = 9;
        if (timer) return;
        timer = setInterval(function () {
            ms--;
            if (ms < 0) ms = 9;
            $('p').text(date.day + '\u5929 ' + date.hour + '\u65F6 ' + date.minute + ':' + date.second + ' ' + ms);
        }, 100);
    }, 1000);
});
