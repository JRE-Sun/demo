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
        this.seize           = seize > 1 || seize < 0 ? 1 : seize;
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
        this.parentEle = $(this.parentClass); // 获取父元素
        this.childEles = $(this.childClass);
        if (this.parentEle.length == 0 || this.childEles == 0) {
            console.log('没有查询到该元素!');
            return;
        }
        this.screenEleNums      = Math.ceil(1 / this.seize); // 一屏能够占据几个子元素
        this.aHref              = ''; // 存储a的href
        this.specialElePrevSucc = false;
        this.childLength        = this.childEles.length; // 子元素长度
        // 当子元素长度小于 首屏能够存放的
        if (this.childLength < this.screenEleNums) {
            this.seize         = 1;
            this.screenEleNums = 1;
        }
        this.direction      = 'right'; // 默认移动方向
        this.startIndex     = 0; // 初始位置下标
        this.transitionTime = this.parentEle.css('transition-duration');
        this.transitionTime = this.transitionTime.substr(0, this.transitionTime.length - 1);
        // 如果没有设置默认缓冲时间,设置成0.3s
        if (this.transitionTime <= 0) {
            this.transitionTime = '0.3';
            this.setTransitionTime(this.transitionTime);
        }
        // 当loop为true
        if (this.loop) {
            // 判断屏幕上存放元素
            for (let i = 0; i < this.screenEleNums; i++) {
                this.parentEle.prepend(this.childEles.eq(this.childLength - i - 1).clone());
                this.parentEle.append(this.childEles.eq(i).clone());
            }
            this.startIndex  = this.screenEleNums; // 初始位置下标
            this.childLength = this.childLength + (this.screenEleNums * 2); // 变更总长度
            this.childEles   = $(this.childClass); // 重新获取子元素
        }
        $('img').attr('draggable', 'false');
        $('a').attr('draggable', 'false');
        this.screenWidth   = $('body').width(); // 屏幕宽
        this.lineOfPoint   = Math.ceil(this.screenWidth * this.movePercent); // 子元素移动多长距离才能滚动到下一个
        this.childEleWidth = Math.ceil(this.screenWidth * this.seize);
        this.currPosition  = this.startIndex * this.childEleWidth * -1; // 初始位置
        this.timer         = null; // 自动轮播定时器
        // 获取子元素宽
        this.childEles.css({
            width: this.childEleWidth,
        });
        // 设置父元素宽
        this.parentEle.css({
            'visibility': 'hidden',
            width       : this.childEleWidth * this.childLength,
            display     : 'flex',
        });
        // 这里设置好子元素,父元素后->元素长度加上margin值的
        this.childEleWidth = this.childEleWidth * 1;
        // 这里不能设置为0,否则不会触发回调
        this.setTransitionTime('0');
        // 瞬间移动
        this.move({
            targetPosition: this.currPosition,
            callback      : () => {
                this.initCallBack(this.startIndex);
                this.setTransitionTime(this.transitionTime);
                this.parentEle.css({
                    'visibility': 'visible',
                });
            }
        });
        // 开启自动轮播
        this.run();
        // 开启事件绑定
        this.bindEvent();
    }

    getEveryMoveDistance() {
        return
    }

    removePx(val) {
        let length = val.length;
        return val.substr(0, length - 2);
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
     * 忽略某些元素默认事件
     */
    disableSpecialEle(ele) {
        if (this.specialElePrevSucc) {
            return;
        }
        ele = typeof ele.href == 'undefined' ? $(ele).parents('a')[0] : ele;
        // 当滚动item里面没有a
        if (typeof ele == 'undefined') return;
        this.aHref              = ele.href;
        ele.href                = 'javascript:;';
        this.specialElePrevSucc = true;
    }

    /**
     * 恢复某些元素默认事件
     */
    enableSpecialEle(ele) {
        if (!this.specialElePrevSucc) {
            return;
        }
        ele = typeof ele.href == 'undefined' ? $(ele).parents('a')[0] : ele;
        // 当滚动item里面没有a
        if (typeof ele == 'undefined') return;
        ele.href                = this.aHref;
        this.specialElePrevSucc = false;
    }

    preventDefault(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
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
    move({targetPosition, callback = null, time = this.transitionTime} = {}) {
        let parentEle = this.parentEle;
        if (callback != null) {
            setTimeout(() => {
                callback();
            }, time * 1000);
        }
        parentEle.css({
            transform: `translateX(${targetPosition}px)`
        });
    }


    setTransitionTime(time) {
        this.parentEle.css({
            'transition-duration': `${time}s`
        });
    }

    /**
     * 收尾相连移动
     */
    loopMove({direction = null, callback = null} = {}) {
        if (!this.loop) {
            return;
        }
        if (direction == null) {
            direction = this.direction;
        }
        this.setTransitionTime('0');
        let move = () => {
            let self          = this;
            self.currPosition = (self.childEleWidth * self.startIndex) * -1;
            // 瞬间移动
            self.move({
                targetPosition: this.currPosition,
                // time          : 0,
                callback      : function () {
                    self.setTransitionTime(self.transitionTime);
                    self.changedCallBack(self.startIndex);
                    callback && callback();
                }
            });
        }
        // 向右到达最后
        if (this.startIndex == this.childLength - (this.screenEleNums) && direction == 'right') {
            this.startIndex = this.screenEleNums;
            move();
            return;
        }
        // 向左到达最前
        if (this.startIndex == 0 && direction == 'left') {
            this.startIndex = this.childLength - (2 * this.screenEleNums);
            move();
            return;
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
        let eventStart      = (e) => {
            // 在左右移动的时候,禁止上下移动
            this.disableTouchMove();
            this.setTransitionTime('0');
            clearInterval(this.timer);
            this.timer = null;
            if (typeof e.changedTouches == 'undefined') {
                startPosition.x = e.clientX;
            } else {
                startPosition.x = e.changedTouches[0].pageX;
            }
        }

        let eventMove = (e) => {
            this.loopMove();
            if (typeof e.changedTouches == 'undefined') {
                endPosition.x = e.clientX;
            } else {
                endPosition.x = e.changedTouches[0].pageX;
            }
            moveDistance    = Math.ceil(endPosition.x - startPosition.x);
            absMoveDistance = Math.abs(moveDistance);
            if (absMoveDistance > 20) {
                this.disableSpecialEle(e.target);
            } else {
                this.enableSpecialEle(e.target);
            }
            // 可拖动的距离,默认是元素的宽
            if (absMoveDistance > childEleWidth) {
                moveDistance = moveDistance > 0 ? childEleWidth : (childEleWidth * -1);
            }
            this.move({targetPosition: this.currPosition * 1 + moveDistance * 1});
        }

        let eventEnd = (e) => {
            if (absMoveDistance < 20) {
                return;
            }
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
            let self          = this;
            self.move({
                targetPosition: this.currPosition,
                callback      : () => {
                    this.changedCallBack(this.startIndex);
                    this.enableSpecialEle(e.target);
                    absMoveDistance = 0;
                }
            });
            this.run();
        }
        // 是否是通过鼠标
        let isMouse  = false;
        this.parentEle.on('touchstart mousedown', (e) => {
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (e.buttons != 1) {
                    return
                }
            }
            eventStart(e);
        });
        this.parentEle.on('touchmove mousemove', (e) => {
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (e.buttons != 1) {
                    return
                }
                isMouse = true;
            }
            eventMove(e);
        });
        this.parentEle.on('touchend mouseup', (e) => {
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (!isMouse) {
                    return;
                }
                isMouse = false;
            }
            eventEnd(e);
        });

        this.parentEle.on('mouseleave', (e) => {
            eventEnd(e);
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
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            let startIndex = this.startIndex;
            startIndex++;
            // 是否为loop循环模式
            if (this.loop) {
                this.startIndex = (startIndex >= this.childLength) ? (this.childLength - 1) : startIndex;
                this.setTransitionTime(this.transitionTime);
                this.currPosition = (this.childEleWidth * this.startIndex) * -1;
                // 移动到新的位置
                this.move({
                    targetPosition: this.currPosition,
                    callback      : () => {
                        this.loopMove({
                            direction: (this.direction == 'left' && this.startIndex == (this.childLength - 1)) ? 'right' : this.direction,
                        });
                        this.direction = 'right';
                    }
                });
                return;
            }
            // 一般模式
            this.startIndex   = (startIndex >= this.childLength) ? 0 : startIndex;
            this.currPosition = (this.childEleWidth * this.startIndex) * -1;
            this.move({
                targetPosition: this.currPosition,
            });
        }, this.autoPlay);
    }
}