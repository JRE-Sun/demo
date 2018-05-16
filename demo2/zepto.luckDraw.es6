/**
 * 九宫格抽奖
 */
class LuckDraw {
    /**
     *
     * @param callback 停止后的毁掉
     * @param selector 选择器
     * @param speed    初始速度
     * @param minCircleNum 至少转几圈
     */
    constructor({callback = null, selector = null, speed = 300, minCircleNum = 4} = {}) {
        if (selector == null) return;
        this.$luckDraw    = $(selector);
        this.callback     = callback;
        this.speed        = speed; // 默认开始滚动速度
        this.minCircleNum = minCircleNum; // 最小的圈数
        this.init();
    }

    init() {
        this.prizeNum   = -1; // 获奖下标->后台传过来的值
        this.currIndex  = this.$luckDraw.find('li.active').index(); // 获取当前带有active->li的下标
        this.$li        = this.$luckDraw.find('li');
        this.length     = this.$li.length;
        this.lastNum    = 3; // 接受到后台数据,并且转了minCircleNum圈后,开始减速运动,并转动1圈
        this.adoptLiNum = 0; // 已经通过了多少li
        this.timer      = null;
        // 开始滚动
        this.run();
    }

    run() {
        // 开启定时器->说白了就是开始运动
        this.timer = setTimeout(() => {
            // 直接走向下一个
            this.currIndex++;
            // 判断界限
            if (this.currIndex >= this.length) {
                // 说明走了一圈了
                this.currIndex    = 0;
                // 圈数减一
                this.minCircleNum = this.minCircleNum - 1 <= 0 ? 0 : this.minCircleNum - 1;
            }
            this.adoptLiNum = this.adoptLiNum + 1;
            // 第一圈加速 // 前4个加速
            if (this.adoptLiNum < this.length) {
                this.speed -= Math.ceil(Math.random() * 40 + 10);
            }
            // 当获取到后台数据,并且 已经转完minCircleNum圈,开始减速
            if (this.prizeNum != -1 && this.minCircleNum == 0) {
                console.log(1);
                this.speed += Math.ceil(Math.random() * 60);
            }
            // 更改选中的li
            this.$li.removeClass('active').eq(this.currIndex).addClass('active');
            // 判断是否已经接受到后台传来的值 && 已经转完minCircleNum圈 && 当前li就是获奖li
            if (this.prizeNum != -1 && this.minCircleNum == 0 && this.prizeNum == this.currIndex) {
                // 满足条件后,继续减速转一圈
                this.lastNum = this.lastNum - 1;
                if (this.lastNum == 0) {
                    clearTimeout(this.timer);
                    this.callback && this.callback();
                }
            }
            // 继续开启run方法
            this.lastNum != 0 && this.run();
        }, this.speed);
    }

}