'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 封装一个页面加载类
 */
var Progress = function () {
    /**
     *
     * @param ele 元素id
     * @param speed 增长速度范围
     * @param endPosition 最终停在那个位置
     */
    function Progress() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$ele = _ref.ele,
            ele = _ref$ele === undefined ? null : _ref$ele,
            _ref$loading = _ref.loading,
            loading = _ref$loading === undefined ? null : _ref$loading,
            _ref$speedArray = _ref.speedArray,
            speedArray = _ref$speedArray === undefined ? [1, 3] : _ref$speedArray,
            _ref$onLoad = _ref.onLoad,
            onLoad = _ref$onLoad === undefined ? null : _ref$onLoad,
            _ref$endPositionArray = _ref.endPositionArray,
            endPositionArray = _ref$endPositionArray === undefined ? [80, 90] : _ref$endPositionArray;

        _classCallCheck(this, Progress);

        if (ele == null) {
            console.log('ele为必填参数');
            return;
        }
        this.onLoadCallBack = this.isFunction(onLoad);
        this.LoadingCallBack = this.isFunction(loading);
        this.ele = document.querySelector('#' + ele);
        this.speedArray = speedArray;
        this.endPosition = this.getRandomNumBy(endPositionArray[0], endPositionArray[1]);
        this.init();
    }

    _createClass(Progress, [{
        key: 'isFunction',
        value: function isFunction(val) {
            return val && val != null && typeof val == 'function' ? val : false;
        }
    }, {
        key: 'init',
        value: function init() {
            this.imgArray = document.querySelectorAll('img');
            this.index = 0; // 默认加载从0开始
            this.currIndex = 0; // 已经加载了多少默认 0
            this.timer = null;
            this.ele.innerHTML = this.index;
            this.isLoadInit = false; // 是否执行过到达100函数->loadFnished
            this.setProgress(this.endPosition);
            this.loadImg();
            this.onLoad();
        }

        /**
         * 加载图片
         */

    }, {
        key: 'loadImg',
        value: function loadImg() {
            var _this = this;

            if (this.imgArray.length == 0) {
                return;
            }
            var imgLength = this.imgArray.length,
                imgLoadIndex = 0; // 图片已经加载了多少张
            this.imgArray.forEach(function (item) {
                item.onload = function () {
                    imgLoadIndex++;
                    if (imgLoadIndex > imgLoadIndex) {
                        return;
                    }
                    _this.currIndex = _this.currIndex * 1 + Math.ceil(imgLoadIndex / imgLength * _this.endPosition) * 1;
                };
            });
        }
    }, {
        key: 'onLoad',
        value: function onLoad() {
            var _this2 = this;

            window.onload = function () {
                !_this2.isLoadInit && _this2.loadFinished();
            };
            var currTime = new Date().getTime();
            setTimeout(function () {
                !_this2.isLoadInit && _this2.loadFinished();
            }, 8000 - (currTime - loadStartTime));
        }
    }, {
        key: 'loadFinished',
        value: function loadFinished() {
            this.isLoadInit = true;
            // 当window.onload后,速度提升为2倍
            this.speedArray = this.speedArray.map(function (item) {
                return item * 2;
            });
            clearInterval(this.timer);
            this.setProgress(100, 10);
        }

        /**
         * 设置进度
         * @param endPosition 终点值
         * @param time  时间定时ms
         */

    }, {
        key: 'setProgress',
        value: function setProgress(endPosition) {
            var _this3 = this;

            var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var tempTime = time;
            if (tempTime == 0) {
                time = this.getRandomNumBy(500, 800);
            }
            this.timer = setTimeout(function () {
                _this3.index = _this3.currIndex;
                if (endPosition <= _this3.index) {
                    _this3.downPart(endPosition);
                } else {
                    _this3.upPart(tempTime, endPosition);
                }
                _this3.LoadingCallBack && _this3.LoadingCallBack(_this3.index);
            }, time);
        }

        /**
         * 在onload后真实的部分
         */

    }, {
        key: 'downPart',
        value: function downPart(endPosition) {
            var _this4 = this;

            this.index = endPosition;
            this.ele.style.cssText = "width:" + this.index + "%";
            clearTimeout(this.timer);
            if (this.isLoadInit) {
                this.onLoadCallBack && this.onLoadCallBack();
                setTimeout(function () {
                    _this4.ele.classList.add("progress-hide");
                }, 500);
            }
        }

        /**
         * 前面模拟部分
         */

    }, {
        key: 'upPart',
        value: function upPart(tempTime, endPosition) {
            this.currIndex = this.index * 1 + this.getRandomNumBy(this.speedArray[0], this.speedArray[1]) * 1;
            this.ele.style.cssText = "width:" + this.currIndex + '%';
            if (tempTime == 0) {
                this.setProgress(endPosition);
                return;
            }
            this.setProgress(endPosition, tempTime);
        }

        /**
         * 获取start-end内的随机数字
         * @param start
         * @param end
         * @returns {number}
         */

    }, {
        key: 'getRandomNumBy',
        value: function getRandomNumBy(start, end) {
            // 注意向上取整
            return Math.ceil(Math.random() * (end - start) * 1 + start * 1);
        }
    }]);

    return Progress;
}();

new Progress({
    ele: 'progress',
    speedArray: [1, 5],
    endPositionArray: [75, 95],
    loading: function loading(index) {
        console.log(index);
    },
    onLoad: function onLoad() {
        console.log('load already');
    }
});
