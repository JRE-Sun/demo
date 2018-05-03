/**
 * 轮播
 */
class Carousel {
    /**
     *
     * @param parentClass 轮播父元素
     * @param childClass 轮播的item
     * @param seize      每个item占用屏幕的多少,默认1
     * @param autoPlay   自动播放时间,默认false
     * @param loop       首尾相连,默认false
     */
    constructor({parentClass = null, init = null, childClass = null, seize = 1, loop = false, autoPlay = false} = {}) {
        if (parentClass == null || childClass == null) {
            console.log('parentClass|childClass没有填写!');
            return;
        }
        this.autoPlay     = autoPlay;
        this.parentClass  = parentClass;
        this.childClass   = childClass;
        this.loop         = loop;
        this.initCallBack = init && typeof init == 'function' ? init : () => {
        };
        this.seize        = seize > 1 ? 1 : seize;
        this.init();
    }

    init() {
        this.parentEle      = $(this.parentClass);
        this.childEles      = $(this.childClass);
        this.childLength    = this.childEles.length;
        this.direction      = 'right';
        this.startIndex     = 0; // 初始位置下标
        this.transitionTime = this.parentEle.css('transition');
        if (this.loop) {
            this.parentEle.prepend(this.childEles.eq(this.childLength - 1).clone());
            this.parentEle.append(this.childEles.eq(0).clone());
            this.startIndex  = 1; // 初始位置下标
            this.childLength = this.childLength + 2;
            this.childEles   = $(this.childClass);
        }
        this.screenWidth   = $(window).width();
        this.lineOfPoint   = Math.ceil(this.screenWidth / 5);
        this.childEleWidth = this.screenWidth * this.seize;

        this.currPosition = this.startIndex * this.childEleWidth * -1; // 初始位置
        this.timer        = null;
        this.childEles.css({
            width: this.childEleWidth,
        });
        this.parentEle.css({
            width: this.childEleWidth * this.childLength,
        });
        this.setTransitionTime('0s');
        this.move(this.currPosition, () => {
            this.setTransitionTime(this.transitionTime);
        });
        this.run();
        this.bindEvent();
    }

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

    disableTouchMove() {
        $(document).on('touchmove', this.wheel);
        $(window).on('touchmove', this.wheel);
    }

    enableTouchMove() {
        $(window).off('touchmove', this.wheel);
        $(document).off('touchmove', this.wheel);
    }

    move(index, callback = null) {
        this.parentEle.off('transitionend');
        this.parentEle.off('webkitTransitionEnd');
        this.parentEle.css({
            transform: `translateX(${index}px)`
        });
        if (callback == null) {
            return;
        }
        this.parentEle.on('transitionend', () => {
            callback();
        })
        this.parentEle.on('webkitTransitionEnd', () => {
            callback();
        })
    }

    setTransitionTime(time) {
        this.parentEle.css({
            'transition': `${time}`
        });
    }

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
            });
        }
    }

    bindEvent() {
        let startPosition   = {},
            endPosition     = {},
            childEleWidth   = this.childEleWidth,
            moveDistance    = 0,
            absMoveDistance = 0,
            direction       = 0,
            startIndex      = 0,
            transitionTime  = this.transitionTime;
        this.parentEle.on('touchstart', (e) => {
            this.disableTouchMove();
            this.setTransitionTime('0s');
            clearInterval(this.timer);
            this.timer = null;
            this.loopMove();
            startPosition.x = e.changedTouches[0].pageX;
        });
        this.parentEle.on('touchmove', (e) => {
            console.log(1);
            endPosition.x   = e.changedTouches[0].pageX;
            moveDistance    = Math.ceil(endPosition.x - startPosition.x);
            absMoveDistance = Math.abs(moveDistance);
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
            this.move(this.currPosition);
            this.run();
        });
    }

    getDirection(start, end) {
        return start.x - end.x > 0 ? 'right' : 'left';
    }

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
                if (this.startIndex == this.childLength - 2 && this.loop) {
                    this.direction == 'right';
                    this.setTransitionTime('0s');
                    this.loopMove();
                }
            });
        }, this.autoPlay);
    }
}