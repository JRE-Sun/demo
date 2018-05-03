'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// new Carousel({
//     parentClass: '.swiper0',
//     childClass : '.slide0',
//     seize      : 1,
//     loop       : true,
//     movePercent: 0.4,
//     init       : function (index) {
//         console.log(index);
//         console.log(`init时下标为${index}`);
//     },
// });
/**
 * 轮播
 */
var Carousel = function () {
    /**
     *
     * @param parentClass 轮播父元素 (必填)
     * @param init        初始化结束后执行init事件
     * @param movePercent 移动多少百分比,自动滚到下个item
     * @param changed     每次轮播结束后执行changed事件
     * @param childClass  轮播的item (必填)
     * @param seize       每个item占用屏幕的多少,默认1
     * @param loop        首尾相连,默认false
     * @param autoPlay    自动播放时间,默认false
     */
    function Carousel() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$parentClass = _ref.parentClass,
            parentClass = _ref$parentClass === undefined ? null : _ref$parentClass,
            _ref$init = _ref.init,
            init = _ref$init === undefined ? null : _ref$init,
            _ref$movePercent = _ref.movePercent,
            movePercent = _ref$movePercent === undefined ? 0.2 : _ref$movePercent,
            _ref$changed = _ref.changed,
            changed = _ref$changed === undefined ? null : _ref$changed,
            _ref$childClass = _ref.childClass,
            childClass = _ref$childClass === undefined ? null : _ref$childClass,
            _ref$seize = _ref.seize,
            seize = _ref$seize === undefined ? 1 : _ref$seize,
            _ref$loop = _ref.loop,
            loop = _ref$loop === undefined ? false : _ref$loop,
            _ref$autoPlay = _ref.autoPlay,
            autoPlay = _ref$autoPlay === undefined ? false : _ref$autoPlay;

        _classCallCheck(this, Carousel);

        if (parentClass == null || childClass == null) {
            console.log('parentClass|childClass没有填写!');
            return;
        }
        this.autoPlay = autoPlay;
        this.parentClass = parentClass;
        this.movePercent = movePercent;
        this.childClass = childClass;
        this.loop = loop;
        this.initCallBack = init && typeof init == 'function' ? init : function () {};
        this.changedCallBack = changed && typeof changed == 'function' ? changed : function () {};
        this.seize = seize > 1 ? 1 : seize;
        this.init();
    }

    /**
     * 返回字符串第n次出现cha的位置
     * @param str
     * @param cha
     * @param num
     * @returns {number}
     */


    _createClass(Carousel, [{
        key: 'find',
        value: function find(str, cha, num) {
            var x = str.indexOf(cha);
            for (var i = 0; i < num; i++) {
                x = str.indexOf(cha, x + 1);
            }
            return x;
        }
    }, {
        key: 'init',
        value: function init() {
            var _this = this;

            this.parentEle = $(this.parentClass); // 获取父元素
            this.childEles = $(this.childClass);
            this.childLength = this.childEles.length; // 子元素长度
            this.direction = 'right'; // 默认移动方向
            this.startIndex = 0; // 初始位置下标
            this.transitionTime = this.parentEle.css('transition');
            var strIndex = this.find(this.transitionTime, 's', 0);
            // 如果没有设置默认缓冲时间,设置成0.4s
            if (this.transitionTime.substr(strIndex - 1, 1) <= 0) {
                this.transitionTime = '0.4s';
            }
            // 当loop为true
            if (this.loop) {
                this.parentEle.prepend(this.childEles.eq(this.childLength - 1).clone());
                this.parentEle.append(this.childEles.eq(0).clone());
                this.startIndex = 1; // 初始位置下标
                this.childLength = this.childLength + 2; // 总长度+2
                this.childEles = $(this.childClass); // 重新获取子元素
            }
            this.screenWidth = $(window).width(); // 屏幕宽
            this.lineOfPoint = Math.ceil(this.screenWidth * this.movePercent); // 子元素移动多长距离才能滚动到下一个
            this.childEleWidth = this.screenWidth * this.seize;

            this.currPosition = this.startIndex * this.childEleWidth * -1; // 初始位置
            this.timer = null; // 自动轮播定时器
            // 获取子元素宽
            this.childEles.css({
                width: this.childEleWidth
            });
            // 设置父元素宽
            this.parentEle.css({
                width: this.childEleWidth * this.childLength,
                display: 'flex'
            });
            // 这里不能设置为0,否则不会触发回调
            this.setTransitionTime('0.000001s');
            // 瞬间移动
            this.move(this.currPosition, function () {
                _this.initCallBack(_this.startIndex);
                _this.setTransitionTime(_this.transitionTime);
            });
            // 开启自动轮播
            this.run();
            // 开启事件绑定
            this.bindEvent();
        }

        /**
         * 阻止默认事件
         * @param e
         */

    }, {
        key: 'wheel',
        value: function wheel(e) {
            e = e || window.event;
            // 判断默认行为是否可以被禁用
            if (event.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!event.defaultPrevented) {
                    event.preventDefault();
                }
            }
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
        }

        /**
         * 禁止移动
         */

    }, {
        key: 'disableTouchMove',
        value: function disableTouchMove() {
            $(document).on('touchmove', this.wheel);
            $(window).on('touchmove', this.wheel);
        }

        /**
         * 恢复移动
         */

    }, {
        key: 'enableTouchMove',
        value: function enableTouchMove() {
            $(window).off('touchmove', this.wheel);
            $(document).off('touchmove', this.wheel);
        }

        /**
         * 移动
         * @param index
         * @param callback
         */

    }, {
        key: 'move',
        value: function move(index) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var parentEle = this.parentEle;
            parentEle.css({
                transform: 'translateX(' + index + 'px)'
            });

            if (callback == null) {
                return;
            }
            parentEle.on('transitionend webkitTransitionEnd', function () {
                callback();
                parentEle.off('transitionend webkitTransitionEnd');
            });
        }
    }, {
        key: 'setTransitionTime',
        value: function setTransitionTime(time) {
            this.parentEle.css({
                'transition': '' + time
            });
        }

        /**
         * 收尾相连移动
         */

    }, {
        key: 'loopMove',
        value: function loopMove() {
            var _this2 = this;

            if (this.loop) {
                // 向右到达最后
                if (this.startIndex == this.childLength - 2 && this.direction == 'right') {
                    this.startIndex = 0;
                }
                // 向左到达最前
                if (this.startIndex == 0 && this.direction == 'left') {
                    this.startIndex = this.childLength - 2;
                }
                this.currPosition = this.childEleWidth * this.startIndex * -1;
                // 瞬间移动
                this.move(this.currPosition, function () {
                    _this2.setTransitionTime(_this2.transitionTime);
                    _this2.changedCallBack(_this2.startIndex);
                });
            }
        }

        /**
         * 增加触摸事件
         */

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this3 = this;

            var startPosition = {},
                // 触摸开始位置
            endPosition = {},
                // 触摸结束位置
            childEleWidth = this.childEleWidth,
                moveDistance = 0,
                // 移动距离
            absMoveDistance = 0,
                // 移动距离的绝对值
            direction = 0,
                // 移动方向
            startIndex = 0,
                // 默认index,不等于this.startIndex哦,这里只是缓存
            transitionTime = this.transitionTime;
            this.parentEle.on('touchstart', function (e) {
                // 在左右移动的时候,禁止上下移动
                _this3.disableTouchMove();
                _this3.setTransitionTime('0s');
                clearInterval(_this3.timer);
                _this3.timer = null;
                _this3.loopMove();
                startPosition.x = e.changedTouches[0].pageX;
            });
            this.parentEle.on('touchmove', function (e) {
                endPosition.x = e.changedTouches[0].pageX;
                moveDistance = Math.ceil(endPosition.x - startPosition.x);
                absMoveDistance = Math.abs(moveDistance);
                // 可拖动的距离,默认是元素的宽
                if (absMoveDistance > childEleWidth) {
                    moveDistance = moveDistance > 0 ? childEleWidth : childEleWidth * -1;
                }
                _this3.move(_this3.currPosition * 1 + moveDistance * 1);
            });
            this.parentEle.on('touchend', function () {
                _this3.enableTouchMove();
                _this3.setTransitionTime(transitionTime);
                _this3.direction = direction = _this3.getDirection(startPosition, endPosition);
                startIndex = _this3.startIndex;
                if (absMoveDistance > _this3.lineOfPoint) {
                    if (direction == 'left') {
                        startIndex--;
                        _this3.startIndex = startIndex < 0 ? 0 : startIndex;
                    }

                    if (direction == 'right') {
                        startIndex++;
                        _this3.startIndex = startIndex >= _this3.childLength ? _this3.childLength - 1 : startIndex;
                    }
                }
                _this3.currPosition = childEleWidth * _this3.startIndex * -1;
                _this3.move(_this3.currPosition, function () {
                    _this3.changedCallBack(_this3.startIndex);
                });
                _this3.run();
            });
        }

        /**
         * 获取移动方向
         * @param start
         * @param end
         * @returns {string}
         */

    }, {
        key: 'getDirection',
        value: function getDirection(start, end) {
            return start.x - end.x > 0 ? 'right' : 'left';
        }

        /**
         * 自动轮播
         */

    }, {
        key: 'run',
        value: function run() {
            var _this4 = this;

            if (!this.autoPlay) {
                return;
            }
            this.timer = setInterval(function () {
                _this4.setTransitionTime(_this4.transitionTime);
                _this4.startIndex++;
                if (_this4.startIndex >= _this4.childLength) {
                    _this4.startIndex = 0;
                }
                _this4.currPosition = _this4.childEleWidth * _this4.startIndex * -1;
                _this4.move(_this4.currPosition, function () {
                    // 当自动轮播到最后克隆的位置
                    if (_this4.startIndex == _this4.childLength - 2 && _this4.loop) {
                        _this4.direction == 'right';
                        _this4.setTransitionTime('0.000001s');
                        _this4.loopMove();
                        return;
                    }
                    _this4.changedCallBack(_this4.startIndex);
                });
            }, this.autoPlay);
        }
    }]);

    return Carousel;
}();
