class PageGallery {
    constructor({selector = null, index = 0} = {}) {
        if (selector == null) return;
        this.$img  = $(selector);
        this.index = index; // 当前打开的图片下标
        this.init();
    }

    creatDom() {
        let html = '';
        // 获取所有选择的img,生成新dom
        [...this.$img].forEach((item) => {
            html += `<div class="img-content"><img src="${$(item).attr('src')}" ></div>`;
        });
        html = '<div class="page-gallery" style="position:fixed;background:rgba(0, 0, 0, .5);top:0;left:0;right:0;bottom:0;z-index:99999;display:none;"><div class="img-wrap">' + html + '<div></div>';
        return html;
    }

    init() {
        this.html           = this.creatDom();
        this.screenWidth    = $(window).width();
        this.screenHeight   = $(window).height();
        this.transitionTime = '.3'; // 设置移动动画时间为0.3s
        this.lineOfPoint    = Math.ceil(this.screenWidth * 0.25); // 子元素移动多长距离才能滚动到下一个
        $('body').append(this.html);
        this.$pageGallery = $('.page-gallery'); // 这个是最外面div,fixed全屏的
        this.$imgContent  = this.$pageGallery.find('.img-content'); // 每个图片的包裹元素
        this.$imgWrap     = this.$pageGallery.find('.img-wrap'); // 包裹着所有.img-content的元素,就是来移动这个形成滚动
        this.$galleryImg  = this.$imgWrap.find('img'); // 画廊的所有img
        this.childLength  = this.$imgContent.length; // 所有img元素的个数
        this.currPosition = this.index * this.childLength * -1; // 初始位置
        // 设置每个包裹img的div样式
        this.$imgContent.css({
            'flex'           : '1',
            'align-items'    : 'center',
            'display'        : 'flex',
            'justify-content': 'center',
        });
        // 设置img样式
        this.setGalleryImgStyle();
        // 设置包裹.img-content的div,.img-wrap样式
        this.$imgWrap.css({
            'display'  : 'flex',
            'height'   : '100%',
            'width'    : this.childLength * this.screenWidth,
            'transform': `translateX(0)`,
        });
        // 初始化电脑端箭头
        this.initBtn();
        // 开启事件绑定
        this.bindEvent();
    }

    initBtn() {
        // 当 当前设备小于平板分辨率
        if (this.screenWidth < 768) {
            return;
        }
        let self = this;
        // 认为是大屏幕,出现按钮
        self.$pageGallery.append('<i class="next-btn"></i><i class="pre-btn"></i>');
        self.$nextBtn = self.$pageGallery.find('.next-btn');
        self.$preBtn  = self.$pageGallery.find('.pre-btn');
        let $btn      = self.$pageGallery.find('i');
        $btn.data('action', 'next');
        $btn.css({
            'position'          : 'absolute',
            'border'            : '34px solid transparent',
            'top'               : '50%',
            'border-right-color': '#fff',
            'cursor'            : 'pointer',
            'transform'         : 'translateY(-50%)',
        });
        self.$preBtn.css({
            'right'             : '0',
            'border-right-color': 'transparent',
            'border-left-color' : '#fff',
        });
        self.$preBtn.data('action', 'pre');
        $btn.on('click', function () {
            let index       = self.index;
            let childLength = self.childLength;

            // 上一个
            if ($(this).data('action') == 'next') {
                index--;
                self.index = (index < 0) ? 0 : index;
            } else {
                index++;
                self.index = (index >= childLength) ? (childLength - 1) : index;
            }
            self.currPosition = (self.screenWidth * self.index) * -1;
            self.move({
                targetPosition: self.currPosition,
            });
        });
    }

    setGalleryImgStyle() {
        let $galleryImg = this.$galleryImg;
        $galleryImg.css({
            'height'   : 'auto',
            'width'    : 'auto',
            'max-width': '100%',
        });
        // 禁止拖拽img
        $galleryImg.attr('draggable', 'false');
        [...$galleryImg].forEach((img) => {
            img.onerror = () => {
                console.log(`${img}加载失败`);
                return;
            }
            img.onload  = () => {
                let currWidth  = img.width;
                let currHeight = img.height;
                let $img       = $(img);
                // 图片高超出
                if (currHeight > this.screenHeight && this.screenHeight > 768) {
                    $img.css({
                        'max-height': this.screenHeight + 'px',
                        'width'     : Math.ceil(currWidth * this.screenHeight / currHeight) + 'px',
                    });
                }
            }
        });
    }

    /**
     * 移动
     * @param index
     * @param callback
     */
    move({targetPosition, callback = null, time = this.transitionTime} = {}) {
        let $imgWrap = this.$imgWrap;
        if (callback != null) {
            setTimeout(() => {
                callback();
            }, time * 1000);
        }
        $imgWrap.css({
            transform: `translateX(${targetPosition}px)`
        });
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


    setTransitionTime(time) {
        this.$imgWrap.css({
            'transition-duration': `${time}s`
        });
    }

    /**
     * 获取移动方向
     * @param start
     * @param end
     * @returns {string}
     */
    getDirection(start, end) {
        return start - end > 0 ? 'right' : 'left';
    }

    /**
     * 增加触摸事件
     */
    bindEvent() {
        let startPosition   = {}, // 触摸开始位置
            endPosition     = {}, // 触摸结束位置
            screenWidth     = this.screenWidth,
            moveDistance    = 0, // 移动距离
            absMoveDistance = 0, // 移动距离的绝对值
            direction       = 0, // 移动方向
            self            = this,
            index           = 0, // 默认index,不等于this.index哦,这里只是缓存
            transitionTime  = this.transitionTime,
            $pageGallery    = this.$pageGallery;

        [...this.$img].forEach(function (item, index) {
            $(item).on('click', function () {
                self.index = index;
                $pageGallery.show();
                self.currPosition = -index * 1 * screenWidth;
                self.$imgWrap.css({
                    'transition': '0',
                    'transform' : `translateX(${self.currPosition}px)`,
                })
            })
        });

        let startTime  = '';
        let endTime    = ''
        let eventStart = (e) => {
            startTime = new Date().getTime();
            // 在左右移动的时候,禁止上下移动
            this.disableTouchMove();
            this.setTransitionTime('0');
            if (typeof e.changedTouches == 'undefined') {
                startPosition = e.clientX;
            } else {
                startPosition = e.changedTouches[0].pageX;
            }
        }

        let eventMove = (e) => {
            if (typeof e.changedTouches == 'undefined') {
                endPosition = e.clientX;
            } else {
                endPosition = e.changedTouches[0].pageX;
            }
            moveDistance    = Math.ceil(endPosition - startPosition);
            absMoveDistance = Math.abs(moveDistance);
            // 可拖动的距离,默认是元素的宽
            if (absMoveDistance > screenWidth) {
                moveDistance = moveDistance > 0 ? screenWidth : (screenWidth * -1);
            }
            this.move({targetPosition: this.currPosition * 1 + moveDistance * 1});
        }

        let eventEnd = (e) => {
            this.enableTouchMove();
            this.setTransitionTime(transitionTime);
            direction = this.getDirection(startPosition, endPosition);
            index     = this.index;
            if (absMoveDistance > this.lineOfPoint) {
                if (direction == 'left') {
                    index--;
                    this.index = (index < 0) ? 0 : index;
                }
                if (direction == 'right') {
                    index++;
                    this.index = (index >= this.childLength) ? (this.childLength - 1) : index;
                }
            }
            this.currPosition = (screenWidth * this.index) * -1;
            let self          = this;
            self.move({
                targetPosition: this.currPosition,
                callback      : () => {
                    absMoveDistance = 0;
                }
            });
        }
        // 是否是通过鼠标
        let isMouse  = false;
        this.$imgWrap.on('touchstart mousedown', (e) => {
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (e.buttons != 1) {
                    return
                }
            }
            eventStart(e);
        });
        this.$imgWrap.on('touchmove mousemove', (e) => {
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (e.buttons != 1) {
                    return
                }
                isMouse = true;
            }
            eventMove(e);
        });
        this.$imgWrap.on('touchend mouseup', (e) => {
            endTime = new Date().getTime();
            if (endTime - startTime < 200 && absMoveDistance < 20) {
                $pageGallery.hide();
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
            // 是通过鼠标
            if (typeof e.changedTouches == 'undefined') {
                if (!isMouse) {
                    return;
                }
                isMouse = false;
            }
            eventEnd(e);
        });
        // 当鼠标移出元素
        this.$imgWrap.on('mouseleave', (e) => {
            eventEnd(e);
        })
    }
}