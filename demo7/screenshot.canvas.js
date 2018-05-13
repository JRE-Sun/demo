'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * canvas截屏
 */
var ScreenShot = function () {
    function ScreenShot() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$canvas = _ref.canvas,
            canvas = _ref$canvas === undefined ? null : _ref$canvas,
            _ref$list = _ref.list,
            list = _ref$list === undefined ? null : _ref$list,
            _ref$init = _ref.init,
            init = _ref$init === undefined ? null : _ref$init,
            _ref$complete = _ref.complete,
            complete = _ref$complete === undefined ? null : _ref$complete;

        _classCallCheck(this, ScreenShot);

        this.initCallback = init;
        this.canvas = canvas;
        this.list = list;
        this.complete = complete;
        this.init();
    }

    _createClass(ScreenShot, [{
        key: 'init',
        value: function init() {
            this.initCallback && this.initCallback();
            this.initCanvas();
        }

        /**
         * 初始化canvas
         */

    }, {
        key: 'initCanvas',
        value: function initCanvas() {
            var _this = this;

            var canvas = document.createElement('canvas');
            // 这里设置成2倍,为了能够显示更清楚
            // $(canvas).css({
            //     width : this.canvas.style.width,
            //     height: this.canvas.style.height
            // });
            canvas.width = this.canvas.width;
            canvas.height = this.canvas.height;

            var ctx = canvas.getContext('2d');

            var currLoadIndex = 0;
            var imgLength = 0;
            var timer = null;
            this.list.map(function (item) {
                var style = item.style;
                if (item.type != 'img') {
                    ctx.textBaseline = "top";
                    ctx.font = style.font.size + ' ' + style.font.family;
                    ctx.fillText(item.text, style.left, style.top);
                    return;
                }
                imgLength++;
                // 是图片类型就加载图片
                _this.loadImg(item.src, function (img) {
                    currLoadIndex++;
                    ctx.drawImage(img, style.left, style.top, style.width, style.height);
                });
                timer = setTimeout(function () {
                    if (imgLength != currLoadIndex) return;
                    clearInterval(timer);
                    _this.complete && _this.complete();
                    _this.loadImg(canvas.toDataURL("image/png"), function (img) {
                        $('body').append(img);
                    });
                }, 20);
            });
        }

        /**
         * 预加载图片
         */

    }, {
        key: 'loadImg',
        value: function loadImg(url, callback) {
            var img = document.createElement('img');
            img.onload = function () {
                callback(img);
            };
            img.src = url;
        }
    }]);

    return ScreenShot;
}();
