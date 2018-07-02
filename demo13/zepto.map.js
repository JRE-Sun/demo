'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZeptoMap = function () {
    function ZeptoMap() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$openCallBack = _ref.openCallBack,
            openCallBack = _ref$openCallBack === undefined ? null : _ref$openCallBack,
            _ref$shutCallBack = _ref.shutCallBack,
            shutCallBack = _ref$shutCallBack === undefined ? null : _ref$shutCallBack;

        _classCallCheck(this, ZeptoMap);

        this.openCallBack = openCallBack;
        this.shutCallBack = shutCallBack;
        this.init();
    }

    _createClass(ZeptoMap, [{
        key: 'init',
        value: function init() {
            window.initMap(this.run);
        }
    }, {
        key: 'run',
        value: function run() {
            var appendMap = '<style>.address-result{overflow:hidden}.address-result li{padding: 10px 10px;font-size: 14px;margin: 0;list-style: none;background: #F9F9F9;border-bottom: 1px solid #EEE;box-sizing: border-box;}#map-sheet .weui-actionsheet__cell{padding:1em 0;}.address-tmp{width: 100%;box-sizing: border-box;padding: 5px 10px;height: 35px;line-height: 35px;border: 1px solid #EEE;border-right: 0;border-left: 0;}</style><div id="map-wrap" class="slide-menu" style="display: none"><header class="header on"><section class="wrap"><section class="sec-ico go-back">返回</section><h2>选择地址</h2><section class="wx-menu"><button class="f18" id="confirm-btn">确认</button></section></section></header><div class="slide-scroller"><div style="background:#E0E0E0;text-align: center;font-size:0.78rem;height:2%;padding:1em;color:#999">点击地图让红色的点定位在您想要的地址上即可</div><div id="map" style="width:100%;height:50%;"></div><input type="text" class="address-tmp" placeholder="可在此输入地址进行搜索" /> <ul id="address-result" class="address-result"></ul></div>';
            var appendMenu = '<div class="weui-actionsheet" id="map-sheet"><header class="header on in2"><section class="wrap"><h2>请选择位置</h2></section></header><div class="weui-actionsheet__menu"><a class="weui-actionsheet__cell" data-maplocation>当前位置</a> <a class="weui-actionsheet__cell" data-mapselector>在地图上选位置</a></div><div class="clear"></div><div class="weui-actionsheet__action"><div class="weui-actionsheet__cell" id="cat-sheet-cancel">取消</div></div></div>';
            this.mapMenu = $(appendMenu);
            $(document.body).append(appendMap).append(this.mapMenu);
            var mapMenu = this.mapMenu;
            $('*[data-mapselector]').addClass('slide-btn').attr('data-target', 'map-wrap');
            this.map = new BMap.Map("map");
            this.lastPoint = null;
            var geo = new BMap.Geocoder();
            var geoLocation = new BMap.Geolocation();

            function hideActionSheet() {
                if (mapMenu.hasClass('weui-actionsheet_toggle')) {
                    mapMenu.removeClass('weui-actionsheet_toggle');
                    hideMask().hide();
                }
                return false;
            }

            /**
             * 在打开地图后 点击 确认
             */
            $(document).on('click', '#confirm-btn', function () {
                $('#map-wrap').slideClose();
                this.openCallBack && this.openCallBack(lastPoint);
                // saveMapPoint(lastPoint);
            });
            // 打开地图
            $(document).on('click', '*[data-mapselector]', this.mapSelector);

            $(document).on('click', '*[data-map-city]', function () {
                mapMenu.addClass('weui-actionsheet_toggle');
                showMask().one('click', hideActionSheet);
            });
            // 点开 action 获取当前位置
            $(document).on('click', '*[data-maplocation]', function () {
                geoLocation.getCurrentPosition(function (position) {
                    // saveMapPoint(position.point);
                    this.openCallBack && this.openCallBack(position.point);
                    hideActionSheet();
                });
            });

            $(document).on('click', '#cat-sheet-cancel', function () {
                hideActionSheet();
            });
            this.shutGetAddress();
        }

        /**
         * 在地图外部获取相关
         */

    }, {
        key: 'shutGetAddress',
        value: function shutGetAddress() {
            var $addressSelector = '';
            var inputControl = $('#address').parents('.input-control');
            inputControl.append('<ul class="address-selector"></ul>');
            $addressSelector = $('.address-selector');
            var map = new BMap.Map("map");
            var options = {
                onSearchComplete: function onSearchComplete(results) {
                    // 判断状态是否正确
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        var s = [];
                        $addressSelector.html('<li style="background: #EEE">点击以下地址可快速定位：</li>');
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            var poi = results.getPoi(i);
                            $addressSelector.append('<li data-point="' + poi.point.lng + ',' + poi.point.lat + '" data-address="' + poi.address + '">' + poi.title + "," + poi.address + '</li>');
                        }
                    }
                }
            };
            var local = new BMap.LocalSearch(map, options);
        }
    }, {
        key: 'mapSelector',
        value: function mapSelector() {
            var map = new BMap.Map("map");
            // 创建地址解析器实例
            var initPoint = new BMap.Point(116.331398, 39.897445);
            map.centerAndZoom(initPoint, 18);
            var marker = new BMap.Marker(initPoint);
            map.addOverlay(marker);
            map.enableScrollWheelZoom();
            map.enableKeyboard();

            function setMapPoint(point) {
                map.setCenter(point);
                marker.setPosition(point);
                this.lastPoint = point;
            }

            $('#map-wrap').show();

            if ($("#lat").val() && parseFloat($("#lat").val()) * 1 != 0) {
                setMapPoint(new BMap.Point(parseFloat($('#lng').val()), parseFloat($('#lat').val())));
            } else {
                /*
                function getLocalCity(result) {
                var cityName = result.name;
                map.setCenter(cityName);
                console.log(cityName);
                }
                var myCity = new BMap.LocalCity();
                myCity.get(getLocalCity);*/
                geoLocation.getCurrentPosition(function (position) {
                    setMapPoint(position.point);
                });
            }
            var topRightNav = new BMap.NavigationControl({
                anchor: BMAP_ANCHOR_TOP_LEFT,
                type: BMAP_NAVIGATION_CONTROL_SMALL
            });
            map.addControl(topRightNav);
            // set location btn
            var geolocationControl = new BMap.GeolocationControl({
                anchor: BMAP_ANCHOR_TOP_RIGHT,
                enableAutoLocation: true,
                showAddressBar: true
            });
            geolocationControl.addEventListener("locationSuccess", function (e) {});
            map.addControl(geolocationControl);

            function touchMap(e) {
                map.removeOverlay(marker);
                marker = new BMap.Marker(e.point);
                map.addOverlay(marker);
                this.lastPoint = e.point;
            }

            if ("ontouchend" in document) {
                map.addEventListener("touchend", touchMap);
            } else {
                map.addEventListener("click", touchMap);
            }

            map.addEventListener('moving', function () {
                var point = map.getCenter();
                touchMap({ point: point });
            });

            var options = {
                onSearchComplete: function onSearchComplete(results) {
                    // 判断状态是否正确
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        var s = [];
                        $("#address-result").html('<li style="background: #EEE">点击以下地址可快速定位：</li>');
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            var poi = results.getPoi(i);
                            $("#address-result").append('<li data-point="' + poi.point.lng + ',' + poi.point.lat + '" data-address="' + poi.address + '">' + poi.title + "," + poi.address + '</li>');
                        }
                    }
                }
            };
            var local = new BMap.LocalSearch(map, options);
            $(document).on('input' in document ? 'input' : 'keyup', '.address-tmp', function () {
                local.search($(this).val());
            });
            $(document).on('focus', '.address-tmp', function () {
                if (!$(this).val()) {
                    $(this).val($('.icon-map').data('map'));
                }
            });

            $(document).on('input' in document ? 'input' : 'keyup', '.address-tmp', function () {
                local.search($(this).val());
            });

            $(document).on('click', '.address-result li[data-point]', function () {
                var arr = $(this).data('point').split(/,/);
                saveMapPoint({ lat: arr[1], lng: arr[0] }, $(this).data('address'));
                $('#map-wrap').slideClose();
                $addressSelector.hide();
            });
            hideActionSheet();
        }
    }]);

    return ZeptoMap;
}();
