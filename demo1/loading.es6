/**
 * 封装一个页面加载类
 */
class Progress {

    /**
     * @param init 初始化时候的会掉
     * @param maxLoadingTime 最大等待loading时间
     * @param loading 在加载过程中触发
     * @param speedArray 增长速度范围
     * @param onLoad 当加载完成触发onLoad
     * @param endPositionArray 最终停在位置范围
     */
    constructor({loading = null, init = null, maxLoadingTime = 8, speedArray = [1, 3], onLoad = null, endPositionArray = [80, 90]} = {}) {
        this.onLoadCallBack  = this.isFunction(onLoad);
        this.loadingCallBack = this.isFunction(loading);
        this.initCallBack    = this.isFunction(init);
        this.speedArray      = speedArray;
        this.maxLoadingTime  = maxLoadingTime * 1000;
        this.endPosition     = this.getRandomNumBy(endPositionArray[0], endPositionArray[1]);
        this.init();
    }

    /**
     *
     * @param val
     * @returns {*}
     */
    isFunction(val) {
        return val && val != null && typeof val == 'function' ? val : false;
    }

    init() {
        this.loadStartTime = new Date().getTime(); // 开始进入到页面的时间
        this.imgArray      = document.querySelectorAll('img');
        this.index         = 0; // 默认加载从0开始
        this.currIndex     = 0; // 已经加载了多少默认 0
        this.timer         = null;
        this.isLoadInit    = false; // 是否执行过到达100函数->loadFnished
        this.initCallBack && this.initCallBack(0);
        this.setProgress(this.endPosition);
        this.loadImg();
        this.onLoad();
    }

    /**
     * 加载图片
     */
    loadImg() {
        if (this.imgArray.length == 0) {
            return;
        }
        let imgLength    = this.imgArray.length,
            imgLoadIndex = 0; // 图片已经加载了多少张
        this.imgArray.forEach(item => {
            item.onload = () => {
                imgLoadIndex++;
                if (imgLoadIndex > imgLoadIndex) {
                    return;
                }
                this.currIndex = this.currIndex * 1 + Math.ceil((imgLoadIndex / imgLength) * this.endPosition) * 1;
            }
        })
    }

    onLoad() {
        window.onload = () => {
            !this.isLoadInit && this.loadFinished();
        }
        let currTime  = new Date().getTime();
        setTimeout(() => {
            !this.isLoadInit && this.loadFinished();
        }, this.maxLoadingTime - (currTime - this.loadStartTime));
    }

    loadFinished() {
        this.isLoadInit = true;
        // 当window.onload后,速度提升为2倍
        this.speedArray = this.speedArray.map(item => {
            return item * 2;
        });
        clearInterval(this.timer);
        this.setProgress(100, 10);
    }

    /**
     * 设置进度
     * @param endPosition 终点值
     * @param time  时间定时ms
     */
    setProgress(endPosition, time = 0) {
        var tempTime = time;
        if (tempTime == 0) {
            time = this.getRandomNumBy(500, 800);
        }
        this.timer = setTimeout(() => {
            this.index = this.currIndex;
            if (endPosition <= this.index) {
                this.downPart(endPosition);
            } else {
                this.upPart(tempTime, endPosition);
            }
            this.loadingCallBack && this.loadingCallBack(this.index);
        }, time);
    }

    /**
     * 在onload后真实的部分
     */
    downPart(endPosition) {
        this.index = endPosition;
        clearTimeout(this.timer);
        if (this.isLoadInit) {
            this.onLoadCallBack && this.onLoadCallBack();
        }
    }

    /**
     * 前面模拟部分
     */
    upPart(tempTime, endPosition) {
        this.currIndex = this.index * 1 + this.getRandomNumBy(this.speedArray[0], this.speedArray[1]) * 1;
        if (tempTime == 0) {
            this.setProgress(endPosition);
            return;
        }
        this.setProgress(endPosition, tempTime);
    }

    /**
     * 获取start-end内的随机数字
     * @param start
     * @param end
     * @returns {number}
     */
    getRandomNumBy(start, end) {
        // 注意向上取整
        return Math.ceil(Math.random() * (end - start) * 1 + start * 1);
    }
}