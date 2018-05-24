'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = function () {
    function Event() {
        _classCallCheck(this, Event);

        this.list = [];
    }

    /**
     * 增加事件监听
     */


    _createClass(Event, [{
        key: 'listen',
        value: function listen(key, fn) {
            // 当不存在监听运行的fn,直接return
            if (!fn) return;
            // list还不存在key
            if (!this.list[key]) {
                this.list[key] = [];
            }
            this.list[key].push(fn);
        }

        /**
         * 执行事件
         */

    }, {
        key: 'run',
        value: function run(key, data) {
            // 当key为空或对应数组为空
            if (!key || !this.list[key]) return;

            this.list[key].map(function (item) {
                item(data);
            });
        }

        /**
         * 删除事件
         * @param key
         * @param fn
         */

    }, {
        key: 'remove',
        value: function remove(key, fn) {
            if (!key) return;
            // 当fn为空,删除key下所有回调
            if (!fn) {
                this.list[key] = [];
                return;
            }
            // 当fn为真
            this.list[key] = this.list[key].filter(function (item) {
                return item != fn;
            });
        }
    }]);

    return Event;
}();

var event = new Event();

var firstCallBack = function firstCallBack(data) {
    console.log(data);
};

event.listen('a', firstCallBack);

event.listen('a', function (data) {
    console.log('ccccc');
});

event.run('a', 'bbbb');

event.remove('a', firstCallBack);

event.run('a', '1111');
