'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PageGallery = function () {
    function PageGallery() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$selector = _ref.selector,
            selector = _ref$selector === undefined ? null : _ref$selector,
            _ref$index = _ref.index,
            index = _ref$index === undefined ? 0 : _ref$index;

        _classCallCheck(this, PageGallery);

        if (selector == null) return;
        this.$img = $(selector);
        this.index = index; // 当前打开的图片下标
        this.init();
    }

    _createClass(PageGallery, [{
        key: 'creatDom',
        value: function creatDom() {
            var html = '';
            // 获取所有选择的img,生成新dom
            [].concat(_toConsumableArray(this.$img)).forEach(function (item) {
                html += '<div class="img-content"><img src="' + $(item).attr('src') + '" ></div>';
            });
            html = '<div class="page-gallery" style="position:fixed;background:rgba(0, 0, 0, .5);top:0;left:0;right:0;bottom:0;z-index:99999;display:none;"><div class="img-wrap">' + html + '<div></div>';
            return html;
        }
    }, {
        key: 'init',
        value: function init() {
            this.html = this.creatDom();
            this.screenWidth = $(window).width();
            this.lineOfPoint = Math.ceil(this.screenWidth * 0.25); // 子元素移动多长距离才能滚动到下一个
            $('body').append(this.html);
            this.$pageGallery = $('.page-gallery'); // 这个是最外面div,fixed全屏的
            this.$imgContent = this.$pageGallery.find('.img-content'); // 每个图片的包裹元素
            this.$imgContent.css({
                'flex': '1',
                'align-items': 'center',
                'display': 'flex',
                'justify-content': 'center'
            });
            // 禁止拖拽img
            $('img').attr('draggable', 'false');
            this.childLength = this.$imgContent.length; // 所有img元素的个数
            this.currPosition = this.index * this.childLength * -1; // 初始位置
            this.$imgWrap = this.$pageGallery.find('.img-wrap'); // 包裹着所有.img-content的元素,就是来移动这个形成滚动
            this.$imgWrap.css({
                'display': 'flex',
                'height': '100%',
                'width': this.childLength * this.screenWidth,
                'transform': 'translateX(0)'
            });
            this.transitionTime = '.3'; // 设置移动动画时间为0.3s
            // 开启事件绑定
            this.bindEvent();
        }

        /**
         * 移动
         * @param index
         * @param callback
         */

    }, {
        key: 'move',
        value: function move() {
            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                targetPosition = _ref2.targetPosition,
                _ref2$callback = _ref2.callback,
                callback = _ref2$callback === undefined ? null : _ref2$callback,
                _ref2$time = _ref2.time,
                time = _ref2$time === undefined ? this.transitionTime : _ref2$time;

            var $imgWrap = this.$imgWrap;
            if (callback != null) {
                setTimeout(function () {
                    callback();
                }, time * 1000);
            }
            $imgWrap.css({
                transform: 'translateX(' + targetPosition + 'px)'
            });
        }
    }, {
        key: 'removePx',
        value: function removePx(val) {
            var length = val.length;
            return val.substr(0, length - 2);
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
    }, {
        key: 'setTransitionTime',
        value: function setTransitionTime(time) {
            this.$imgWrap.css({
                'transition-duration': time + 's'
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
            return start - end > 0 ? 'right' : 'left';
        }

        /**
         * 增加触摸事件
         */

    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            var startPosition = {},
                // 触摸开始位置
            endPosition = {},
                // 触摸结束位置
            screenWidth = this.screenWidth,
                moveDistance = 0,
                // 移动距离
            absMoveDistance = 0,
                // 移动距离的绝对值
            direction = 0,
                // 移动方向
            self = this,
                index = 0,
                // 默认index,不等于this.index哦,这里只是缓存
            transitionTime = this.transitionTime,
                $pageGallery = this.$pageGallery;

            [].concat(_toConsumableArray(this.$img)).forEach(function (item, index) {
                $(item).on('click', function () {
                    self.index = index;
                    $pageGallery.show();
                    self.currPosition = -index * 1 * screenWidth;
                    self.$imgWrap.css({
                        'transition': '0',
                        'transform': 'translateX(' + self.currPosition + 'px)'
                    });
                });
            });

            var startTime = '';
            var endTime = '';
            var eventStart = function eventStart(e) {
                startTime = new Date().getTime();
                // 在左右移动的时候,禁止上下移动
                _this.disableTouchMove();
                _this.setTransitionTime('0');
                if (typeof e.changedTouches == 'undefined') {
                    startPosition = e.clientX;
                } else {
                    startPosition = e.changedTouches[0].pageX;
                }
            };

            var eventMove = function eventMove(e) {
                if (typeof e.changedTouches == 'undefined') {
                    endPosition = e.clientX;
                } else {
                    endPosition = e.changedTouches[0].pageX;
                }
                moveDistance = Math.ceil(endPosition - startPosition);
                absMoveDistance = Math.abs(moveDistance);
                // 可拖动的距离,默认是元素的宽
                if (absMoveDistance > screenWidth) {
                    moveDistance = moveDistance > 0 ? screenWidth : screenWidth * -1;
                }
                _this.move({ targetPosition: _this.currPosition * 1 + moveDistance * 1 });
            };

            var eventEnd = function eventEnd(e) {
                _this.enableTouchMove();
                _this.setTransitionTime(transitionTime);
                direction = _this.getDirection(startPosition, endPosition);
                index = _this.index;
                if (absMoveDistance > _this.lineOfPoint) {
                    if (direction == 'left') {
                        index--;
                        _this.index = index < 0 ? 0 : index;
                    }
                    if (direction == 'right') {
                        index++;
                        _this.index = index >= _this.childLength ? _this.childLength - 1 : index;
                    }
                }
                _this.currPosition = screenWidth * _this.index * -1;
                var self = _this;
                self.move({
                    targetPosition: _this.currPosition,
                    callback: function callback() {
                        absMoveDistance = 0;
                    }
                });
            };
            // 是否是通过鼠标
            var isMouse = false;
            this.$imgWrap.on('touchstart mousedown', function (e) {
                // 是通过鼠标
                if (typeof e.changedTouches == 'undefined') {
                    if (e.buttons != 1) {
                        return;
                    }
                }
                eventStart(e);
            });
            this.$imgWrap.on('touchmove mousemove', function (e) {
                // 是通过鼠标
                if (typeof e.changedTouches == 'undefined') {
                    if (e.buttons != 1) {
                        return;
                    }
                    isMouse = true;
                }
                eventMove(e);
            });
            this.$imgWrap.on('touchend mouseup', function (e) {
                endTime = new Date().getTime();
                if (endTime - startTime < 200 && absMoveDistance < 20) {
                    $pageGallery.hide();
                    e.stopPropagation();
                    e.preventDefault();
                    return false;
                }
                // 是通过鼠标
                if (typeof e.changedTouches == 'undefined') {
                    if (!isMouse) {
                        return;
                    }
                    isMouse = false;
                }
                eventEnd(e);
            });
        }
    }]);

    return PageGallery;
}();
