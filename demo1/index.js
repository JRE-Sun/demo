"use strict";

function drawRound(index) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ccc';
    ctx.arc(90, 90, 74, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#f30';
    // 设置开始处为0点钟方向(-90 * Math.PI / 180)
    // x为百分比值(0-100)
    ctx.arc(90, 90, 74, -90 * Math.PI / 180, (index * 3.6 - 90) * Math.PI / 180);
    ctx.stroke();
    ctx.font = '40px Arial';
    ctx.fillStyle = '#f30';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(index + '%', 90, 90);
}

var aa = 0;
(function drawFrame() {
    requestAnimationFrame(function () {
        drawFrame();
        drawRound(aa);
    });
})();

new Progress({
    speedArray: [1, 5],
    endPositionArray: [75, 95],
    init: function init(index) {
        aa = index;
    },
    loading: function loading(index) {
        aa = index;
        document.querySelector('#progress').style.cssText = "width:" + index + "%";
        // drawRound(index);
    },
    onLoad: function onLoad() {
        setTimeout(function () {
            document.querySelector('#progress').classList.add("progress-hide");
        }, 500);
    }
});
