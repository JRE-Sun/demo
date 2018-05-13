'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
    var numBox = document.getElementById('num');

    /**
     * 数字滚动
     * @param {Object} num      开始值
     * @param {Object} maxNum   最大值,最终展示的值
     */
    function numRunFun(num, maxNum) {
        var numText = num;
        var golb; // 为了清除requestAnimationFrame
        function numSlideFun() {
            numText += 5; // 速度的计算可以为小数
            if (numText >= maxNum) {
                numText = maxNum;
                cancelAnimationFrame(golb);
            } else {
                golb = requestAnimationFrame(numSlideFun);
            }
            numBox.innerHTML = numText;
        }

        numSlideFun();
    }

    // 运行
    // numRunFun(0, 1100);


    $('.send').on('click', function () {
        new ScrollNumber($('input').val());
    });
    var a = 0;
    setInterval(function () {
        a = Math.ceil(a + Math.random() * 10 + 5);
        new ScrollNumber(a);
    }, 1000);

    var ScrollNumber = function () {
        function ScrollNumber(val) {
            _classCallCheck(this, ScrollNumber);

            if (val == '' || typeof val == 'undefined' || val == null) {
                return;
            }
            this.val = val + '';
            this.init();
        }

        _createClass(ScrollNumber, [{
            key: 'init',
            value: function init() {
                this.$scrollNumber = $('.scroll-number');
                this.runStatus = 'empty';
                if (this.$scrollNumber.html() == '') {
                    this.createDom();
                }
                // 当以有文字,并且变大
                if (this.$scrollNumber.find('span').length < this.val.length) {
                    this.addDom();
                    this.runStatus = 'add';
                }
                // 当以有文字,并且减小
                if (this.$scrollNumber.find('span').length > this.val.length) {
                    this.reduceDom();
                    this.runStatus = 'reduce';
                }
                this.$span = this.$scrollNumber.find('span');
                var spanHeight = this.$span.css('font-size');
                this.$scrollNumber.css('max-height', '' + spanHeight);
                this.spanHeight = spanHeight.replace(/px/ig, '');
                this.run();
            }

            /**
             * 当存在元素,并且数值在减小
             */

        }, {
            key: 'reduceDom',
            value: function reduceDom() {
                var currLength = this.val.length;
                var $span = this.$scrollNumber.find('span');
                $span.forEach(function (item, index) {
                    if (index >= currLength) $(item).remove();
                });
                // this.$scrollNumber.html(html);
            }

            /**
             * 当存在元素,并且数值在增大
             */

        }, {
            key: 'addDom',
            value: function addDom() {
                var currLength = this.val.length;
                var html = this.$scrollNumber.html();
                var $span = this.$scrollNumber.find('span');
                for (var i = $span.length; i < currLength; i++) {
                    html += '<span>0123456789<br>.</span>';
                }
                this.$scrollNumber.html(html);
            }

            /**
             * 滚动数字
             */

        }, {
            key: 'run',
            value: function run() {
                var _this = this;

                [].concat(_toConsumableArray(this.val)).map(function (item, index) {
                    if (item == '.') item = 10;
                    _this.$span.eq(index).css({
                        'transform': 'translateY(-' + item * _this.spanHeight + 'px)'
                    });
                });
            }

            /**
             * 初始化dom
             */

        }, {
            key: 'createDom',
            value: function createDom() {
                var html = '';
                [].concat(_toConsumableArray(this.val)).map(function (item, index) {
                    html += '<span>0123456789<br>.</span>';
                });
                this.$scrollNumber.html(html);
            }
        }]);

        return ScrollNumber;
    }();
});
