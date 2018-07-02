/**
 * 基于zepto的移动端下拉刷新
 */
class PullToRefresh {
    constructor({pullStartDom = '', pullDownMaxDis = false, removeMouseEvent = true, pullEndDom = '', mainDom = null, pullCallBack = null} = {}) {
        if (mainDom == null) {
            console.log('mainDom为必填');
            return;
        }
        this.pullCallBack     = pullCallBack;
        this.mainDom          = mainDom && $(mainDom);
        this.pullEndDom       = pullEndDom;
        this.pullStartDom     = pullStartDom;
        // 下拉的最大距离
        this.pullDownMaxDis   = pullDownMaxDis;
        this.removeMouseEvent = removeMouseEvent;
        this.init();
    }

    init() {
        this.screenHeight = $(window).height();
        this.maxMoveDis   = !this.pullDownMaxDis ? Math.ceil(this.screenHeight / 4) : this.pullDownMaxDis;
        this.pullDom      = $('<div class="pull-down"></div>');
        this.pullDom.css({
            position    : 'absolute',
            top         : 0,
            overflow    : 'hidden',
            width       : '100%',
            'box-sizing': 'border-box',
            height      : `${this.maxMoveDis}px`,
            transform   : 'translateY(-100%)',
        });
        this.pullStartDom = `<div class="pull-start">${this.pullStartDom}</div>`;
        this.pullEndDom   = `<div class="pull-end">${this.pullEndDom}</div>`;
        this.pullDom.html(this.pullStartDom);
        this.transitonTime = 0.2; // 默认transtion
        this.direction     = ''; // 两个值up,down,
        this.startPosition = {};
        this.endPositon    = {};
        this.removeEvent();
        this.bindEvent();
    }

    /**
     * 默认移除鼠标滚轮事件
     */
    removeEvent() {
        if (!this.removeMouseEvent) return;
        $(document).on('mousewheel', function (e) {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
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
            console.log(11);
            this.pullDom.html(this.pullStartDom);
            mainDom.css({
                'transform' : 'none',
                'transition': '0s',
            });
        });
    }

    bindEvent() {
        let isTouchStart  = false;
        let mainDom       = this.mainDom;
        let maxMoveDis    = this.maxMoveDis;
        let direction     = '';
        let moveDistance  = 0;
        let translateYPX  = 0;
        let isAlreadyPull = false; // 是否已经执行过下拉
        $(document).on('touchstart', (e) => {
            if ($(window).scrollTop() == 0) {
                e.preventDefault();
                e.stopPropagation();
                translateYPX         = mainDom.css('transform');
                translateYPX         = translateYPX.replace(/[a-zA-Z\(\)]/ig, '') * 1;
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
            moveDistance      = this.endPositon.y - this.startPosition.y;
            direction         = moveDistance < 0 ? 'up' : 'down';
            moveDistance      = Math.ceil(moveDistance);
            moveDistance += translateYPX;
            if (this.direction == 'down' && direction == 'down' && moveDistance >= maxMoveDis) return;
            if (moveDistance > 0) {
                !isAlreadyPull && mainDom.prepend(this.pullDom);
                isAlreadyPull = true;
                if (moveDistance >= maxMoveDis) {
                    this.direction = 'down';
                    moveDistance   = maxMoveDis;
                    $('.pull-down .pull-end').length > 0 && this.pullEndDom && this.pullDom.html(this.pullEndDom);
                }
                mainDom.css({
                    'transform': `translateY(${moveDistance}px)`,
                });
            }
        });
        $(document).on('touchend', () => {
            if (!isTouchStart) return;
            // 当全部拉出才执行 回调
            if (this.direction == 'down' && moveDistance >= maxMoveDis && this.pullCallBack) {
                this.pullCallBack(this);
            } else {
                this.pullHide();
            }
            // 清空状态
            this.direction == '';
            direction == '';
            moveDistance = 0;
            isTouchStart = false;
        });
    }
}