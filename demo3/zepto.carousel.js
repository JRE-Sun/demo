'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 轮播
 */
var Carousel = function () {
    /**
     *
     * @param parentClass 轮播父元素
     * @param childClass 轮播的item
     * @param seize      每个item占用屏幕的多少,默认1
     * @param autoPlay   自动播放时间,默认false
     * @param loop       首尾相连,默认false
     */
    function Carousel() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$parentClass = _ref.parentClass,
            parentClass = _ref$parentClass === undefined ? null : _ref$parentClass,
            _ref$init = _ref.init,
            init = _ref$init === undefined ? null : _ref$init,
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
        this.childClass = childClass;
        this.loop = loop;
        this.initCallBack = init && typeof init == 'function' ? init : function () {};
        this.seize = seize > 1 ? 1 : seize;
        this.init();
    }

    _createClass(Carousel, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.parentEle = $(this.parentClass);
            this.childEles = $(this.childClass);
            this.childLength = this.childEles.length;
            this.direction = 'right';
            this.startIndex = 0; // 初始位置下标
            this.transitionTime = this.parentEle.css('transition');
            if (this.loop) {
                this.parentEle.prepend(this.childEles.eq(this.childLength - 1).clone());
                this.parentEle.append(this.childEles.eq(0).clone());
                this.startIndex = 1; // 初始位置下标
                this.childLength = this.childLength + 2;
                this.childEles = $(this.childClass);
            }
            this.screenWidth = $(window).width();
            this.lineOfPoint = Math.ceil(this.screenWidth / 5);
            this.childEleWidth = this.screenWidth * this.seize;

            this.currPosition = this.startIndex * this.childEleWidth * -1; // 初始位置
            this.timer = null;
            this.childEles.css({
                width: this.childEleWidth
            });
            this.parentEle.css({
                width: this.childEleWidth * this.childLength
            });
            this.setTransitionTime('0s');
            this.move(this.currPosition, function () {
                _this.setTransitionTime(_this.transitionTime);
            });
            this.run();
            this.bindEvent();
        }
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
    }, {
        key: 'disableTouchMove',
        value: function disableTouchMove() {
            $(document).on('touchmove', this.wheel);
            $(window).on('touchmove', this.wheel);
        }
    }, {
        key: 'enableTouchMove',
        value: function enableTouchMove() {
            $(window).off('touchmove', this.wheel);
            $(document).off('touchmove', this.wheel);
        }
    }, {
        key: 'move',
        value: function move(index) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this.parentEle.off('transitionend');
            this.parentEle.off('webkitTransitionEnd');
            this.parentEle.css({
                transform: 'translateX(' + index + 'px)'
            });
            if (callback == null) {
                return;
            }
            this.parentEle.on('transitionend', function () {
                callback();
            });
            this.parentEle.on('webkitTransitionEnd', function () {
                callback();
            });
        }
    }, {
        key: 'setTransitionTime',
        value: function setTransitionTime(time) {
            this.parentEle.css({
                'transition': '' + time
            });
        }
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
                });
            }
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this3 = this;

            var startPosition = {},
                endPosition = {},
                childEleWidth = this.childEleWidth,
                moveDistance = 0,
                absMoveDistance = 0,
                direction = 0,
                startIndex = 0,
                transitionTime = this.transitionTime;
            this.parentEle.on('touchstart', function (e) {
                _this3.disableTouchMove();
                _this3.setTransitionTime('0s');
                clearInterval(_this3.timer);
                _this3.timer = null;
                _this3.loopMove();
                startPosition.x = e.changedTouches[0].pageX;
            });
            this.parentEle.on('touchmove', function (e) {
                console.log(1);
                endPosition.x = e.changedTouches[0].pageX;
                moveDistance = Math.ceil(endPosition.x - startPosition.x);
                absMoveDistance = Math.abs(moveDistance);
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
                _this3.move(_this3.currPosition);
                _this3.run();
            });
        }
    }, {
        key: 'getDirection',
        value: function getDirection(start, end) {
            return start.x - end.x > 0 ? 'right' : 'left';
        }
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
                    if (_this4.startIndex == _this4.childLength - 2 && _this4.loop) {
                        _this4.direction == 'right';
                        _this4.setTransitionTime('0s');
                        _this4.loopMove();
                    }
                });
            }, this.autoPlay);
        }
    }]);

    return Carousel;
}();
