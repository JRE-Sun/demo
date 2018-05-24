class Event {
    constructor() {
        this.list = [];
    }

    /**
     * 增加事件监听
     */
    listen(key, fn) {
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
    run(key, data) {
        // 当key为空或对应数组为空
        if (!key || !this.list[key]) return;

        this.list[key].map(item => {
            item(data);
        });
    }

    /**
     * 删除事件
     * @param key
     * @param fn
     */
    remove(key, fn) {
        if (!key) return;
        // 当fn为空,删除key下所有回调
        if (!fn) {
            this.list[key] = [];
            return;
        }
        // 当fn为真
        this.list[key] = this.list[key].filter(item => {
            return item != fn;
        });
    }
}

let event = new Event();

let firstCallBack = (data) => {
    console.log(data);
};

event.listen('a', firstCallBack);

event.listen('a', (data) => {
    console.log('ccccc');
});

event.run('a', 'bbbb');

event.remove('a', firstCallBack);

event.run('a', '1111');