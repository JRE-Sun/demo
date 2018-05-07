/**
 * 基于zepto的移动端下拉刷新
 */
class PullToRefresh {
    constructor({pullStartDom = null, pullEndDom = null, mainDom = null, pullCallBack = null} = {}) {
        if (mainDom == null) {
            console.log('mainDom为必填');
            return;
        }
        this.pullCallBack = pullCallBack;
        this.mainDom      = mainDom && $(mainDom);
        this.pullEndDom   = pullEndDom;
        this.pullStartDom = pullStartDom;
        this.init();
    }

    init() {
        this.screenHeight = $(window).height();
        this.maxMoveDis   = Math.ceil(this.screenHeight / 4);
        this.pullDom      = $('<div class="pull-start"></div>');
        this.pullDom.css({
            position    : 'absolute',
            top         : 0,
            overflow    : 'hidden',
            width       : '100%',
            'box-sizing': 'border-box',
            height      : `${this.maxMoveDis}px`,
            transform   : 'translateY(-100%)',
        });
        this.pullDom.html(this.pullStartDom);
        this.transitonTime = 0.2; // 默认transtion
        this.direction     = ''; // 两个值up,down,
        this.startPosition = {};
        this.endPositon    = {};
        this.bindEvent();
    }

    /**
     * 设置transition后的回调
     */
    transitionCallBack(callback) {
        setTimeout(() => {
            callback && callback();
        }, this.transitonTime * 1000);
    }

    /**
     * 隐藏顶部dom
     */
    pullHide() {
        let mainDom = this.mainDom;
        mainDom.css({
            'transition': `${this.transitonTime}s`,
            'transform' : `translateY(0px)`,
        });
        this.transitionCallBack(() => {
            // $(this.pullDom).remove();
            this.pullDom.html(this.pullStartDom);
            mainDom.css({
                'transition': '0s',
            });
        });
    }

    bindEvent() {
        let isTouchStart  = false;
        let mainDom       = this.mainDom;
        let maxMoveDis    = this.maxMoveDis;
        let moveDistance  = 0;
        let isAlreadyPull = false; // 是否已经执行过下拉
        $(document).on('touchstart', (e) => {
            if ($(window).scrollTop() == 0) {
                e.preventDefault();
                e.stopPropagation();
                this.direction       = 'up';
                var touch            = e.touches[0];
                this.startPosition.x = touch.pageX;
                this.startPosition.y = touch.pageY;
                isTouchStart         = true;
            }
        });
        $(document).on('touchmove', (e) => {
            if (!isTouchStart) return;
            var touch         = e.touches[0];
            this.endPositon.x = touch.pageX;
            this.endPositon.y = touch.pageY;
            moveDistance      = Math.ceil(this.endPositon.y - this.startPosition.y);
            if (moveDistance > 0) {
                !isAlreadyPull && mainDom.prepend(this.pullDom);
                isAlreadyPull = true;
                if (moveDistance >= maxMoveDis) {
                    moveDistance = maxMoveDis;
                    this.pullEndDom && this.pullDom.html(this.pullEndDom);
                }
                mainDom.css({
                    'transform': `translateY(${moveDistance}px)`,
                });
            }
        });
        $(document).on('touchend', () => {
            if (!isTouchStart) return;
            // 当全部拉出才执行 回调
            if (moveDistance == maxMoveDis && this.pullCallBack) {
                this.pullCallBack(this);
            } else {
                this.pullHide();
            }
            isTouchStart = false;
        });
    }
}