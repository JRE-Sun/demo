"use strict";

new Progress({
    speedArray: [1, 5],
    endPositionArray: [75, 95],
    loading: function loading(index) {
        document.querySelector('#progress').style.cssText = "width:" + index + "%";
    },
    onLoad: function onLoad() {
        setTimeout(function () {
            document.querySelector('#progress').classList.add("progress-hide");
        }, 500);
    }
});
