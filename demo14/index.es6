$(document).ready(() => {
    let startTime   = new Date().getTime() * 1 / 1000;
    let endTime     = startTime + 60 * 60 * 60;
    let addZero     = val => {
        if (val < 10) return '0' + val;
        return val;
    }
    let getDateTime = (startTime, endTime) => {
        let time = endTime - startTime;
        console.log(time);
        let day    = addZero(Math.floor(time / (24 * 60 * 60)));
        let hour   = addZero(Math.floor((time - (day * 24 * 60 * 60)) / (60 * 60)));
        let minute = addZero(Math.floor((time - (day * 24 * 60 * 60) - (hour * 60 * 60)) / 60));
        let second = addZero(Math.floor(time - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)));
        return {
            day,
            hour,
            minute,
            second,
        }
    };
    let timer       = null;
    let date        = {};
    setInterval(() => {
        startTime++;
        date   = getDateTime(startTime, endTime);
        let ms = 9;
        if (timer) return;
        timer = setInterval(() => {
            ms--;
            if (ms < 0) ms = 9;
            $('p').text(`${date.day}天 ${date.hour}时 ${date.minute}:${date.second} ${ms}`);
        }, 100);
    }, 1000);
});