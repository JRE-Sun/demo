'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 九宫格抽奖
 */
var LuckDraw = function () {
    /**
     *
     * @param callback 停止后的毁掉
     * @param selector 选择器
     * @param speed    初始速度
     * @param minCircleNum 至少转几圈
     */
    function LuckDraw() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$callback = _ref.callback,
            callback = _ref$callback === undefined ? null : _ref$callback,
            _ref$selector = _ref.selector,
            selector = _ref$selector === undefined ? null : _ref$selector,
            _ref$speed = _ref.speed,
            speed = _ref$speed === undefined ? 300 : _ref$speed,
            _ref$minCircleNum = _ref.minCircleNum,
            minCircleNum = _ref$minCircleNum === undefined ? 4 : _ref$minCircleNum;

        _classCallCheck(this, LuckDraw);

        if (selector == null) return;
        this.$luckDraw = $(selector);
        this.callback = callback;
        this.speed = speed; // 默认开始滚动速度
        this.minCircleNum = minCircleNum; // 最小的圈数
        this.init();
    }

    _createClass(LuckDraw, [{
        key: 'init',
        value: function init() {
            this.prizeNum = -1; // 获奖下标->后台传过来的值
            this.currIndex = this.$luckDraw.find('li.active').index(); // 获取当前带有active->li的下标
            this.$li = this.$luckDraw.find('li');
            this.length = this.$li.length;
            this.lastNum = 3; // 接受到后台数据,并且转了minCircleNum圈后,开始减速运动,并转动1圈
            this.adoptLiNum = 0; // 已经通过了多少li
            this.timer = null;
            // 开始滚动
            this.run();
        }
    }, {
        key: 'run',
        value: function run() {
            var _this = this;

            // 开启定时器->说白了就是开始运动
            this.timer = setTimeout(function () {
                // 直接走向下一个
                _this.currIndex++;
                // 判断界限
                if (_this.currIndex >= _this.length) {
                    // 说明走了一圈了
                    _this.currIndex = 0;
                    // 圈数减一
                    _this.minCircleNum = _this.minCircleNum - 1 <= 0 ? 0 : _this.minCircleNum - 1;
                }
                _this.adoptLiNum = _this.adoptLiNum + 1;
                // 第一圈加速 // 前4个加速
                if (_this.adoptLiNum < _this.length) {
                    _this.speed -= Math.ceil(Math.random() * 40 + 10);
                }
                // 当获取到后台数据,并且 已经转完minCircleNum圈,开始减速
                if (_this.prizeNum != -1 && _this.minCircleNum == 0) {
                    console.log(1);
                    _this.speed += Math.ceil(Math.random() * 60);
                }
                // 更改选中的li
                _this.$li.removeClass('active').eq(_this.currIndex).addClass('active');
                // 判断是否已经接受到后台传来的值 && 已经转完minCircleNum圈 && 当前li就是获奖li
                if (_this.prizeNum != -1 && _this.minCircleNum == 0 && _this.prizeNum == _this.currIndex) {
                    // 满足条件后,继续减速转一圈
                    _this.lastNum = _this.lastNum - 1;
                    if (_this.lastNum == 0) {
                        clearTimeout(_this.timer);
                        _this.callback && _this.callback();
                    }
                }
                // 继续开启run方法
                _this.lastNum != 0 && _this.run();
            }, this.speed);
        }
    }]);

    return LuckDraw;
}();
