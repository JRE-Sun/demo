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
            this.screenHeight = $(window).height();
            this.transitionTime = '.3'; // 设置移动动画时间为0.3s
            this.lineOfPoint = Math.ceil(this.screenWidth * 0.25); // 子元素移动多长距离才能滚动到下一个
            $('body').append(this.html);
            this.$pageGallery = $('.page-gallery'); // 这个是最外面div,fixed全屏的
            this.$imgContent = this.$pageGallery.find('.img-content'); // 每个图片的包裹元素
            this.$imgWrap = this.$pageGallery.find('.img-wrap'); // 包裹着所有.img-content的元素,就是来移动这个形成滚动
            this.$galleryImg = this.$imgWrap.find('img'); // 画廊的所有img
            this.childLength = this.$imgContent.length; // 所有img元素的个数
            this.currPosition = this.index * this.childLength * -1; // 初始位置
            // 设置每个包裹img的div样式
            this.$imgContent.css({
                'flex': '1',
                'align-items': 'center',
                'display': 'flex',
                'justify-content': 'center'
            });
            // 设置img样式
            this.setGalleryImgStyle();
            // 设置包裹.img-content的div,.img-wrap样式
            this.$imgWrap.css({
                'display': 'flex',
                'height': '100%',
                'width': this.childLength * this.screenWidth,
                'transform': 'translateX(0)'
            });
            // 初始化电脑端箭头
            this.initBtn();
            // 开启事件绑定
            this.bindEvent();
        }
    }, {
        key: 'initBtn',
        value: function initBtn() {
            // 当 当前设备小于平板分辨率
            if (this.screenWidth < 768) {
                return;
            }
            var self = this;
            // 认为是大屏幕,出现按钮
            self.$pageGallery.append('<i class="next-btn"></i><i class="pre-btn"></i>');
            self.$nextBtn = self.$pageGallery.find('.next-btn');
            self.$preBtn = self.$pageGallery.find('.pre-btn');
            var $btn = self.$pageGallery.find('i');
            $btn.data('action', 'next');
            $btn.css({
                'position': 'absolute',
                'border': '34px solid transparent',
                'top': '50%',
                'border-right-color': '#fff',
                'cursor': 'pointer',
                'transform': 'translateY(-50%)'
            });
            self.$preBtn.css({
                'right': '0',
                'border-right-color': 'transparent',
                'border-left-color': '#fff'
            });
            self.$preBtn.data('action', 'pre');
            $btn.on('click', function () {
                var index = self.index;
                var childLength = self.childLength;

                // 上一个
                if ($(this).data('action') == 'next') {
                    index--;
                    self.index = index < 0 ? 0 : index;
                } else {
                    index++;
                    self.index = index >= childLength ? childLength - 1 : index;
                }
                self.currPosition = self.screenWidth * self.index * -1;
                self.move({
                    targetPosition: self.currPosition
                });
            });
        }
    }, {
        key: 'setGalleryImgStyle',
        value: function setGalleryImgStyle() {
            var _this = this;

            var $galleryImg = this.$galleryImg;
            $galleryImg.css({
                'height': 'auto',
                'width': 'auto',
                'max-width': '100%',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            });
            // 禁止拖拽img
            $galleryImg.attr('draggable', 'false');
            [].concat(_toConsumableArray($galleryImg)).forEach(function (img) {
                img.onerror = function () {
                    console.log(img + '\u52A0\u8F7D\u5931\u8D25');
                    return;
                };
                img.onload = function () {
                    var currWidth = img.width;
                    var currHeight = img.height;
                    var $img = $(img);
                    // 图片高超出
                    if (currHeight > _this.screenHeight && _this.screenHeight > 768) {
                        $img.css({
                            'max-height': _this.screenHeight + 'px',
                            'width': Math.ceil(currWidth * _this.screenHeight / currHeight) + 'px'
                        });
                    }
                };
            });
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
            var _this2 = this;

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
                _this2.disableTouchMove();
                _this2.setTransitionTime('0');
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
                _this2.move({ targetPosition: _this2.currPosition * 1 + moveDistance * 1 });
            };

            var eventEnd = function eventEnd(e) {
                _this2.setTransitionTime(transitionTime);
                direction = _this2.getDirection(startPosition, endPosition);
                index = _this2.index;
                if (absMoveDistance > _this2.lineOfPoint) {
                    if (direction == 'left') {
                        index--;
                        _this2.index = index < 0 ? 0 : index;
                    }
                    if (direction == 'right') {
                        index++;
                        _this2.index = index >= _this2.childLength ? _this2.childLength - 1 : index;
                    }
                }
                _this2.currPosition = screenWidth * _this2.index * -1;
                var self = _this2;
                self.move({
                    targetPosition: _this2.currPosition,
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
                _this2.enableTouchMove();
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
            // 当鼠标移出元素
            this.$imgWrap.on('mouseleave', function (e) {
                eventEnd(e);
            });
        }
    }]);

    return PageGallery;
}();
