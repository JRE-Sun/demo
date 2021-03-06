'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 画svg
 */
var SvgRadar = function () {
    /**
     *
     * @param width   svg 宽
     * @param height  svg高
     * @param r       图形半径
     * @param list    传进来的顶点列表
     * @param titleSize  title文字字号
     * @param contentSize  content文字字号
     */
    function SvgRadar() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$vertex = _ref.vertex,
            vertex = _ref$vertex === undefined ? true : _ref$vertex,
            _ref$width = _ref.width,
            width = _ref$width === undefined ? 500 : _ref$width,
            _ref$targetG = _ref.targetG,
            targetG = _ref$targetG === undefined ? null : _ref$targetG,
            _ref$height = _ref.height,
            height = _ref$height === undefined ? 500 : _ref$height,
            _ref$dottedLine = _ref.dottedLine,
            dottedLine = _ref$dottedLine === undefined ? '#8dc0e3' : _ref$dottedLine,
            _ref$r = _ref.r,
            r = _ref$r === undefined ? 175 : _ref$r,
            _ref$titleColor = _ref.titleColor,
            titleColor = _ref$titleColor === undefined ? '#000' : _ref$titleColor,
            _ref$contentColor = _ref.contentColor,
            contentColor = _ref$contentColor === undefined ? '#999' : _ref$contentColor,
            _ref$selector = _ref.selector,
            selector = _ref$selector === undefined ? 'body' : _ref$selector,
            _ref$virtual = _ref.virtual,
            virtual = _ref$virtual === undefined ? true : _ref$virtual,
            _ref$list = _ref.list,
            list = _ref$list === undefined ? null : _ref$list,
            _ref$titleSize = _ref.titleSize,
            titleSize = _ref$titleSize === undefined ? 20 : _ref$titleSize,
            _ref$contentSize = _ref.contentSize,
            contentSize = _ref$contentSize === undefined ? 16 : _ref$contentSize;

        _classCallCheck(this, SvgRadar);

        if (list == null) return;
        this.list = list; // 存储的是坐标数据
        this.width = width; // svg的宽
        this.height = height; // svg的高
        this.r = r; // 圆的半径
        this.titleSize = titleSize;
        this.selector = selector; // 默认插入到body上
        this.contentSize = contentSize;
        this.contentColor = contentColor;
        this.titleColor = titleColor;
        this.dottedLine = dottedLine; // 虚线颜色,当为false,不显示

        // 虚拟边框的样式,以后可能扩展
        var defaultVirtual = {
            borderColor: '#F4F4F4',
            width: 2,
            fill: 'none'
        };

        if (virtual == true) virtual = defaultVirtual;
        if ((typeof virtual === 'undefined' ? 'undefined' : _typeof(virtual)) == 'object') {
            virtual = Object.assign(defaultVirtual, virtual);
        }

        console.log(virtual);

        this.virtual = virtual; // 是否显示虚拟的 对比边框
        this.targetG = targetG == null ? function () {
            return {
                fillColor: '#A4DAFF',
                borderColor: '#73A7FE'
            };
        }() : targetG;
        this.vertex = vertex == null ? function () {
            return {
                width: 2,
                color: '#333',
                r: 2
            };
        }() : vertex;
        this.init();
    }

    _createClass(SvgRadar, [{
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
            $(this.selector).append(this.svg);
        }
    }, {
        key: 'initDotLinRound',
        value: function initDotLinRound() {
            var circleCenterPoint = this.circleCenterPoint;
            var dottedLine = this.dottedLine;
            var vertex = this.vertex;
            var html = '<g fill=\'none\' stroke=\'' + dottedLine + '\' stroke-width=\'1\'>';
            this.list.map(function (item) {
                if (dottedLine) html += '<path stroke-dasharray="5,5" d="M' + item.vx + ',' + item.vy + ' ' + circleCenterPoint.x + ',' + circleCenterPoint.y + '"></path>';
                if (vertex) html += '<circle cx="' + item.x + '" cy="' + item.y + '" r="' + vertex.r + '" stroke="' + vertex.color + '" stroke-width="' + vertex.width + '" fill="#fff"></circle>';
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
                var contentTextStatus = !(typeof item.content == 'undefined' || item.content == '');
                var position = [];
                if (contentTextStatus) {
                    position[0] = 50;
                    position[1] = 60;
                    position[2] = 60;
                    position[3] = 30;
                } else {
                    position[0] = 30;
                    position[1] = 40;
                    position[2] = 60;
                    position[3] = 10;
                }
                var x = item.vx == circleCenterPoint.x ? item.vx : false;
                var y = item.vy == circleCenterPoint.y ? item.vy + 10 : false;
                if (!x) x = item.vx > circleCenterPoint.x ? item.vx + _this.getResponseVar(position[0]) : item.vx - _this.getResponseVar(position[1]);
                if (!y) y = item.vy > circleCenterPoint.y ? item.vy + _this.getResponseVar(position[2]) : item.vy - _this.getResponseVar(position[3]);
                html += '<text style="fill:' + _this.titleColor + ';"><tspan color="transparent" x="' + (x - _this.getResponseVar(_this.titleSize)) + '" y="' + (y - _this.getResponseVar(_this.titleSize / 2)) + '" style="font-size:' + _this.getResponseVar(_this.titleSize) + 'px">' + item.title + '</tspan>';
                if (contentTextStatus) {
                    html += '<tspan style="fill:' + _this.contentColor + ';font-size:' + _this.getResponseVar(_this.contentSize) + 'px" x="' + (x - _this.getResponseVar(20)) + '" y="' + (y + _this.getResponseVar(5)) + '">' + item.content + '</tspan>';
                }
                html += '</text>';
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
            var _this2 = this;

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
                    distance: _this2.virtual ? r : item.distance
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
            var html = '<polygon points="' + positionStr + '" style="fill:' + this.targetG.fillColor + '; stroke:' + this.targetG.borderColor + '; stroke-width:2"></polygon>';
            if (this.virtual) {
                html += '<polygon points="' + vPositionStr + '" style="fill:' + this.virtual.fill + '; stroke:' + this.virtual.borderColor + '; stroke-width:' + this.virtual.width + '"></polygon>';
            }
            this.svg = $('<svg width="' + this.width + '" height="' + this.height + '">' + html + '</svg>');
        }
    }]);

    return SvgRadar;
}();
