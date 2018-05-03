// new Carousel({
//     parentClass: '.swiper0',
//     childClass : '.slide0',
//     seize      : 1,
//     loop       : true,
//     movePercent: 0.4,
//     init       : function (index) {
//         console.log(index);
//         console.log(`init时下标为${index}`);
//     },
// });
/**
 * 轮播
 */
class Carousel {
    /**
     *
     * @param parentClass 轮播父元素 (必填)
     * @param init        初始化结束后执行init事件
     * @param movePercent 移动多少百分比,自动滚到下个item
     * @param changed     每次轮播结束后执行changed事件
     * @param childClass  轮播的item (必填)
     * @param seize       每个item占用屏幕的多少,默认1
     * @param loop        首尾相连,默认false
     * @param autoPlay    自动播放时间,默认false
     */
    constructor({parentClass = null, init = null, movePercent = 0.2, changed = null, childClass = null, seize = 1, loop = false, autoPlay = false} = {}) {
        if (parentClass == null || childClass == null) {
            console.log('parentClass|childClass没有填写!');
            return;
        }
        this.autoPlay        = autoPlay;
        this.parentClass     = parentClass;
        this.movePercent     = movePercent;
        this.childClass      = childClass;
        this.loop            = loop;
        this.initCallBack    = init && typeof init == 'function' ? init : () => {
        };
        this.changedCallBack = changed && typeof changed == 'function' ? changed : () => {
        };
        this.seize           = seize > 1 ? 1 : seize;
        this.init();
    }

    /**
     * 返回字符串第n次出现cha的位置
     * @param str
     * @param cha
     * @param num
     * @returns {number}
     */
    find(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    }

    init() {
        this.parentEle      = $(this.parentClass); // 获取父元素
        this.childEles      = $(this.childClass);
        this.childLength    = this.childEles.length; // 子元素长度
        this.direction      = 'right'; // 默认移动方向
        this.startIndex     = 0; // 初始位置下标
        this.transitionTime = this.parentEle.css('transition');
        let strIndex        = this.find(this.transitionTime, 's', 0);
        // 如果没有设置默认缓冲时间,设置成0.4s
        if (this.transitionTime.substr(strIndex - 1, 1) <= 0) {
            this.transitionTime = '0.4s';
        }
        // 当loop为true
        if (this.loop) {
            this.parentEle.prepend(this.childEles.eq(this.childLength - 1).clone());
            this.parentEle.append(this.childEles.eq(0).clone());
            this.startIndex  = 1; // 初始位置下标
            this.childLength = this.childLength + 2; // 总长度+2
            this.childEles   = $(this.childClass); // 重新获取子元素
        }
        this.screenWidth   = $(window).width(); // 屏幕宽
        this.lineOfPoint   = Math.ceil(this.screenWidth * this.movePercent); // 子元素移动多长距离才能滚动到下一个
        this.childEleWidth = this.screenWidth * this.seize;

        this.currPosition = this.startIndex * this.childEleWidth * -1; // 初始位置
        this.timer        = null; // 自动轮播定时器
        // 获取子元素宽
        this.childEles.css({
            width: this.childEleWidth,
        });
        // 设置父元素宽
        this.parentEle.css({
            width  : this.childEleWidth * this.childLength,
            display: 'flex',
        });
        // 这里不能设置为0,否则不会触发回调
        this.setTransitionTime('0.000001s');
        // 瞬间移动
        this.move(this.currPosition, () => {
            this.initCallBack(this.startIndex);
            this.setTransitionTime(this.transitionTime);
        });
        // 开启自动轮播
        this.run();
        // 开启事件绑定
        this.bindEvent();
    }

    /**
     * 阻止默认事件
     * @param e
     */
    wheel(e) {
        e = e || window.event;
        // 判断默认行为是否可以被禁用
        if (event.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!event.defaultPrevented) {
                event.preventDefault();
            }
        }
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    /**
     * 禁止移动
     */
    disableTouchMove() {
        $(document).on('touchmove', this.wheel);
        $(window).on('touchmove', this.wheel);
    }

    /**
     * 恢复移动
     */
    enableTouchMove() {
        $(window).off('touchmove', this.wheel);
        $(document).off('touchmove', this.wheel);
    }

    /**
     * 移动
     * @param index
     * @param callback
     */
    move(index, callback = null) {
        let parentEle = this.parentEle;
        parentEle.css({
            transform: `translateX(${index}px)`
        });

        if (callback == null) {
            return;
        }
        parentEle.on('transitionend webkitTransitionEnd', () => {
            callback();
            parentEle.off('transitionend webkitTransitionEnd');
        })
    }

    setTransitionTime(time) {
        this.parentEle.css({
            'transition': `${time}`
        });
    }

    /**
     * 收尾相连移动
     */
    loopMove() {
        if (this.loop) {
            // 向右到达最后
            if (this.startIndex == this.childLength - 2 && this.direction == 'right') {
                this.startIndex = 0;
            }
            // 向左到达最前
            if (this.startIndex == 0 && this.direction == 'left') {
                this.startIndex = this.childLength - 2;
            }
            this.currPosition = (this.childEleWidth * this.startIndex) * -1;
            // 瞬间移动
            this.move(this.currPosition, () => {
                this.setTransitionTime(this.transitionTime);
                this.changedCallBack(this.startIndex);
            });
        }
    }

    /**
     * 增加触摸事件
     */
    bindEvent() {
        let startPosition   = {}, // 触摸开始位置
            endPosition     = {}, // 触摸结束位置
            childEleWidth   = this.childEleWidth,
            moveDistance    = 0, // 移动距离
            absMoveDistance = 0, // 移动距离的绝对值
            direction       = 0, // 移动方向
            startIndex      = 0, // 默认index,不等于this.startIndex哦,这里只是缓存
            transitionTime  = this.transitionTime;
        this.parentEle.on('touchstart', (e) => {
            // 在左右移动的时候,禁止上下移动
            this.disableTouchMove();
            this.setTransitionTime('0s');
            clearInterval(this.timer);
            this.timer = null;
            this.loopMove();
            startPosition.x = e.changedTouches[0].pageX;
        });
        this.parentEle.on('touchmove', (e) => {
            endPosition.x   = e.changedTouches[0].pageX;
            moveDistance    = Math.ceil(endPosition.x - startPosition.x);
            absMoveDistance = Math.abs(moveDistance);
            // 可拖动的距离,默认是元素的宽
            if (absMoveDistance > childEleWidth) {
                moveDistance = moveDistance > 0 ? childEleWidth : (childEleWidth * -1);
            }
            this.move(this.currPosition * 1 + moveDistance * 1);
        });
        this.parentEle.on('touchend', () => {
            this.enableTouchMove();
            this.setTransitionTime(transitionTime);
            this.direction = direction = this.getDirection(startPosition, endPosition);
            startIndex = this.startIndex;
            if (absMoveDistance > this.lineOfPoint) {
                if (direction == 'left') {
                    startIndex--;
                    this.startIndex = (startIndex < 0) ? 0 : startIndex;
                }

                if (direction == 'right') {
                    startIndex++;
                    this.startIndex = (startIndex >= this.childLength) ? (this.childLength - 1) : startIndex;
                }
            }
            this.currPosition = (childEleWidth * this.startIndex) * -1;
            this.move(this.currPosition, () => {
                this.changedCallBack(this.startIndex);
            });
            this.run();
        });
    }

    /**
     * 获取移动方向
     * @param start
     * @param end
     * @returns {string}
     */
    getDirection(start, end) {
        return start.x - end.x > 0 ? 'right' : 'left';
    }

    /**
     * 自动轮播
     */
    run() {
        if (!this.autoPlay) {
            return;
        }
        this.timer = setInterval(() => {
            this.setTransitionTime(this.transitionTime);
            this.startIndex++;
            if (this.startIndex >= this.childLength) {
                this.startIndex = 0;
            }
            this.currPosition = (this.childEleWidth * this.startIndex) * -1;
            this.move(this.currPosition, () => {
                // 当自动轮播到最后克隆的位置
                if (this.startIndex == this.childLength - 2 && this.loop) {
                    this.direction == 'right';
                    this.setTransitionTime('0.000001s');
                    this.loopMove();
                    return;
                }
                this.changedCallBack(this.startIndex);
            });
        }, this.autoPlay);
    }
}