/**
 * 更多搜索
 * ele：监听的input
 * change：input值变化回调
 * appendEle：更多数据插入到该元素
 * clickList：点击数据列表上面的数据->回调
 */
class MoreSearch {
    constructor({ele = null, change = null, attribute = 'more-search', init = null, appendEle = null, clickList = null} = {}) {
        if (ele == null) return;
        // 要考虑到一个页面能够绑定多个的情况
        // 实例化两次，两次不同的ele就完了
        this.ele                   = $(ele); // 监听的input元素
        this.appendEle             = appendEle == null ? $('<div class="more-search"></div>').appendTo(this.ele.parent()) : $(appendEle); // 插入到哪个元素下,没传进来，默认插到body下
        this.changeCallBack        = change;
        this.clickDataListCallBack = clickList;
        this.initCallBack          = init;
        this.attribute             = attribute;
        this.init();
    }

    init() {
        this.initCallBack && this.initCallBack();
        this.dataList = []; // 可点击 列表数据
        this.bindDataList();
        this.bindEvent();
    }

    bindDataList() {
        let self              = this;
        let isTouchMove       = false;
        let isClickMoreSearch = false;
        let eventName         = navigator.appVersion.search(/(android|ipad|iphone)/ig) > -1 ? 'touchend' : 'click'
        // 监听创建的数据列表 

        $(document).on(eventName, `*[data-${self.attribute}]`, function (e) {
            if (isTouchMove) {
                isTouchMove = false;
                return;
            }
            isClickMoreSearch = true;
            let index         = $(e.target).data(self.attribute);
            if (typeof index != 'undefined') {
                self.clickDataListCallBack && self.clickDataListCallBack(self.dataList[index]);
            }
            self.appendEle.hide();
            e.stopPropagation();
        });

        $(document).on('touchmove', `*[data-${self.attribute}]`, function (e) {
            isTouchMove       = true;
            isClickMoreSearch = true;
            e.stopPropagation();
        });
        $(document).on('touchend', function (e) {
            if (isClickMoreSearch) {
                isClickMoreSearch = false;
                return;
            }
            self.appendEle.hide();
        });
    }

    eventFunction(e) {
        // 绑定好事件，事件需要把值穿回去，具体逻辑在外部整
        // 外面做好，逻辑后把结果传进来，里面再插到appendEle下面
        this.changeCallBack && this.changeCallBack(e.target.value);
    }

    removeEvent() {
        this.ele.off('input propertypechange', this.eventFunction.bind(this));
    }

    bindEvent() {
        this.ele.on('input propertypechange', this.eventFunction.bind(this));
    }

    appendToEle(data) {
        this.dataList = data;
        let html      = '';
        // 这里传进来的是个数组json
        data.forEach((item, index) => {
            let str = '';
            str     = `<p class="search-msg" data-${this.attribute}="${index}"><span data-${this.attribute}="${index}">${item}</span>`;
            if (index < 2 && false) {
                str = `${str}<i class="search-hot">热</i>`;
            }
            str  = `${str}</p>`;
            html = html + str;
        });
        this.appendEle.html(html).show();
    }
}