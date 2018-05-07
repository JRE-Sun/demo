'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 基于zepto的移动端下拉刷新
 */
var PullToRefresh = function () {
    function PullToRefresh() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$pullStartDom = _ref.pullStartDom,
            pullStartDom = _ref$pullStartDom === undefined ? null : _ref$pullStartDom,
            _ref$pullEndDom = _ref.pullEndDom,
            pullEndDom = _ref$pullEndDom === undefined ? null : _ref$pullEndDom,
            _ref$mainDom = _ref.mainDom,
            mainDom = _ref$mainDom === undefined ? null : _ref$mainDom,
            _ref$pullCallBack = _ref.pullCallBack,
            pullCallBack = _ref$pullCallBack === undefined ? null : _ref$pullCallBack;

        _classCallCheck(this, PullToRefresh);

        if (mainDom == null) {
            console.log('mainDom为必填');
            return;
        }
        this.pullCallBack = pullCallBack;
        this.mainDom = mainDom && $(mainDom);
        this.pullEndDom = pullEndDom;
        this.pullStartDom = pullStartDom;
        this.init();
    }

    _createClass(PullToRefresh, [{
        key: 'init',
        value: function init() {
            this.screenHeight = $(window).height();
            this.maxMoveDis = Math.ceil(this.screenHeight / 4);
            this.pullDom = $('<div class="pull-start"></div>');
            this.pullDom.css({
                position: 'absolute',
                top: 0,
                overflow: 'hidden',
                width: '100%',
                'box-sizing': 'border-box',
                height: this.maxMoveDis + 'px',
                transform: 'translateY(-100%)'
            });
            this.pullDom.html(this.pullStartDom);
            this.transitonTime = 0.2; // 默认transtion
            this.direction = ''; // 两个值up,down,
            this.startPosition = {};
            this.endPositon = {};
            this.bindEvent();
        }

        /**
         * 设置transition后的回调
         */

    }, {
        key: 'transitionCallBack',
        value: function transitionCallBack(callback) {
            setTimeout(function () {
                callback && callback();
            }, this.transitonTime * 1000);
        }

        /**
         * 隐藏顶部dom
         */

    }, {
        key: 'pullHide',
        value: function pullHide() {
            var _this = this;

            var mainDom = this.mainDom;
            mainDom.css({
                'transition': this.transitonTime + 's',
                'transform': 'translateY(0px)'
            });
            this.transitionCallBack(function () {
                // $(this.pullDom).remove();
                _this.pullDom.html(_this.pullStartDom);
                mainDom.css({
                    'transition': '0s'
                });
            });
        }
    }, {
        key: 'bindEvent',
        value: function bindEvent() {
            var _this2 = this;

            var isTouchStart = false;
            var mainDom = this.mainDom;
            var maxMoveDis = this.maxMoveDis;
            var moveDistance = 0;
            var isAlreadyPull = false; // 是否已经执行过下拉
            $(document).on('touchstart', function (e) {
                if ($(window).scrollTop() == 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    _this2.direction = 'up';
                    var touch = e.touches[0];
                    _this2.startPosition.x = touch.pageX;
                    _this2.startPosition.y = touch.pageY;
                    isTouchStart = true;
                }
            });
            $(document).on('touchmove', function (e) {
                if (!isTouchStart) return;
                var touch = e.touches[0];
                _this2.endPositon.x = touch.pageX;
                _this2.endPositon.y = touch.pageY;
                moveDistance = Math.ceil(_this2.endPositon.y - _this2.startPosition.y);
                if (moveDistance > 0) {
                    !isAlreadyPull && mainDom.prepend(_this2.pullDom);
                    isAlreadyPull = true;
                    if (moveDistance >= maxMoveDis) {
                        moveDistance = maxMoveDis;
                        _this2.pullEndDom && _this2.pullDom.html(_this2.pullEndDom);
                    }
                    mainDom.css({
                        'transform': 'translateY(' + moveDistance + 'px)'
                    });
                }
            });
            $(document).on('touchend', function () {
                if (!isTouchStart) return;
                // 当全部拉出才执行 回调
                if (moveDistance == maxMoveDis && _this2.pullCallBack) {
                    _this2.pullCallBack(_this2);
                } else {
                    _this2.pullHide();
                }
                isTouchStart = false;
            });
        }
    }]);

    return PullToRefresh;
}();
