'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 画svg
 */
var DrawSvg = function () {
    /**
     *
     * @param width   svg 宽
     * @param height  svg高
     * @param r       图形半径
     * @param list    传进来的顶点列表
     * @param titleSize  title文字字号
     * @param contentSize  content文字字号
     */
    function DrawSvg() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$width = _ref.width,
            width = _ref$width === undefined ? 500 : _ref$width,
            _ref$height = _ref.height,
            height = _ref$height === undefined ? 500 : _ref$height,
            _ref$r = _ref.r,
            r = _ref$r === undefined ? 175 : _ref$r,
            _ref$list = _ref.list,
            list = _ref$list === undefined ? null : _ref$list,
            _ref$titleSize = _ref.titleSize,
            titleSize = _ref$titleSize === undefined ? 20 : _ref$titleSize,
            _ref$contentSize = _ref.contentSize,
            contentSize = _ref$contentSize === undefined ? 16 : _ref$contentSize;

        _classCallCheck(this, DrawSvg);

        if (list == null) return;
        this.list = list; // 存储的是坐标数据
        this.width = width; // svg的宽
        this.height = height; // svg的高
        this.r = r; // 圆的半径
        this.titleSize = titleSize;
        this.contentSize = contentSize;
        this.init();
        console.log(this);
    }

    _createClass(DrawSvg, [{
        key: 'init',
        value: function init() {
            this.screenWidth = $(window).width();
            this.screenHeight = $(window).height();
            // 屏幕状态,true横屏,false竖屏
            var screenStatus = this.screenWidth > this.screenHeight ? true : false;
            // 当竖屏 svg的宽超过屏幕宽
            if (!screenStatus && this.screenWidth < this.width) {
                this.height = this.width = this.screenWidth;
            }
            // 当横屏 svg的高超过屏幕高
            if (screenStatus && this.screenHeight < this.height) {
                this.height = this.width = this.screenHeight;
            }
            this.r = 0.3 * this.width;
            this.length = this.list.length; // 数据的长度,到时候需要平分圆
            this.angle = 360 / this.length;
            // 设置圆心
            this.circleCenterPoint = {
                x: Math.round(this.width / 2),
                y: Math.round(this.height / 2)
            };
            // 初始化 list 列表
            this.initList();
            // 初始化核心图形
            this.initGraphic();
            // 虚线和顶点上的圆
            this.initDotLinRound();
            // 画文字
            this.initText();
            $('body').append(this.svg);
        }
    }, {
        key: 'initDotLinRound',
        value: function initDotLinRound() {
            var circleCenterPoint = this.circleCenterPoint;
            var html = "<g fill='none' stroke='#8dc0e3' stroke-width='1'>";
            this.list.map(function (item) {
                html += '<path stroke-dasharray="5,5" d="M' + item.vx + ',' + item.vy + ' ' + circleCenterPoint.x + ',' + circleCenterPoint.y + '"></path>';
                html += '<circle cx="' + item.x + '" cy="' + item.y + '" r="2" stroke="black" stroke-width="2" fill="#fff"></circle>';
            });
            html += '</g>';
            this.svg[0].innerHTML = this.svg[0].innerHTML + html;
        }

        /**
         * 计算响应式变量
         */

    }, {
        key: 'getResponseVar',
        value: function getResponseVar(val) {
            return Math.round(val * this.width / 500);
        }
    }, {
        key: 'initText',
        value: function initText() {
            var _this = this;

            var circleCenterPoint = this.circleCenterPoint;
            var html = "<g>";
            this.list.map(function (item) {
                var x = item.vx == circleCenterPoint.x ? item.vx : false;
                var y = item.vy == circleCenterPoint.y ? item.vy + 10 : false;
                if (!x) x = item.vx > circleCenterPoint.x ? item.vx + _this.getResponseVar(50) : item.vx - _this.getResponseVar(60);
                if (!y) y = item.vy > circleCenterPoint.y ? item.vy + _this.getResponseVar(60) : item.vy - _this.getResponseVar(30);
                html += '<text style="fill:black;"><tspan x="' + (x - _this.getResponseVar(20)) + '" y="' + (y - _this.getResponseVar(20)) + '" style="font-size:' + _this.getResponseVar(_this.titleSize) + 'px">' + item.title + '</tspan><tspan style="fill:#999;font-size:' + _this.getResponseVar(_this.contentSize) + 'px" x="' + (x - _this.getResponseVar(20)) + '" y="' + (y + _this.getResponseVar(5)) + '">' + item.content + '</tspan></text>';
            });
            html += '</g>';
            this.svg[0].innerHTML = this.svg[0].innerHTML + html;
        }

        /**
         * 初始化 list 数据
         */

    }, {
        key: 'initList',
        value: function initList() {
            var r = this.r;
            var angle = this.angle;
            var circleCenterPoint = this.circleCenterPoint;
            this.list = this.list.map(function (item, index) {
                var maxAngle = index * angle;
                // 真实的长度
                item.distance = item.distance * 1 * r;
                // 虚拟长度(distance=1)
                // virtualDistance = 1;
                // 第一个json是传进来的值,画真实的形状,第二个json是虚拟形状,当图形铺满是什么形状,能够对比
                var keyList = [{
                    key: 'distance',
                    x: 'x',
                    y: 'y',
                    distance: item.distance
                }, {
                    key: 'r',
                    x: 'vx',
                    y: 'vy',
                    distance: r
                }];
                // 这四个角度判断...我也在想办法..优化!!
                // 当张角小于90度
                if (maxAngle <= 90) {
                    maxAngle = maxAngle * Math.PI / 180;
                    keyList.map(function (listItem) {
                        item[listItem.x] = circleCenterPoint.x + Math.round(Math.sin(maxAngle) * listItem.distance);
                        item[listItem.y] = circleCenterPoint.y - Math.round(Math.cos(maxAngle) * listItem.distance);
                    });
                }
                // 当张角 大于 90度 小于 180度
                if (maxAngle > 90 && maxAngle <= 180) {
                    maxAngle = (maxAngle - 90) * Math.PI / 180;
                    keyList.map(function (listItem) {
                        item[listItem.x] = circleCenterPoint.x + Math.round(Math.cos(maxAngle) * listItem.distance);
                        item[listItem.y] = circleCenterPoint.y + Math.round(Math.sin(maxAngle) * listItem.distance);
                    });
                }
                // 当张角 大于 180 小于 270
                if (maxAngle > 180 && maxAngle <= 270) {
                    maxAngle = (maxAngle - 180) * Math.PI / 180;
                    keyList.map(function (listItem) {
                        item[listItem.x] = circleCenterPoint.x - Math.round(Math.sin(maxAngle) * listItem.distance);
                        item[listItem.y] = circleCenterPoint.y + Math.round(Math.cos(maxAngle) * listItem.distance);
                    });
                }
                // 当张角 大于 270 小于 360
                if (maxAngle > 270 && maxAngle <= 360) {
                    maxAngle = (maxAngle - 270) * Math.PI / 180;
                    keyList.map(function (listItem) {
                        item[listItem.x] = circleCenterPoint.x - Math.round(Math.cos(maxAngle) * listItem.distance);
                        item[listItem.y] = circleCenterPoint.y - Math.round(Math.sin(maxAngle) * listItem.distance);
                    });
                }
                return item;
            });
        }

        /**
         * 创建 svg, 画svg
         */

    }, {
        key: 'initGraphic',
        value: function initGraphic() {
            var positionStr = '';
            var vPositionStr = '';
            this.list.map(function (item) {
                positionStr += item.x + ',' + item.y + ' ';
                vPositionStr += item.vx + ',' + item.vy + ' ';
            });
            this.svg = $('<svg width="' + this.width + '" height="' + this.height + '"><polygon points="' + vPositionStr + '" style="fill:none; stroke:#e4e4e4; stroke-width:2"></polygon><polygon points="' + positionStr + '" style="fill:#A4DAFF; stroke:#73A7FE; stroke-width:2"></polygon></svg>');
        }
    }]);

    return DrawSvg;
}();
