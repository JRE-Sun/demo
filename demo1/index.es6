/**
 * 封装一个页面加载类
 */
class Progress {
    /**
     *
     * @param ele 元素id
     * @param speed 增长速度范围
     * @param endPosition 最终停在那个位置
     */
    constructor(eleId = null, speedArray = [1, 3], endPositionArray = [80, 90]) {
        if (eleId == null) {
            console.log('eleId为必填参数');
            return;
        }
        this.ele         = document.querySelector(`#${eleId}`);
        this.speedArray  = speedArray;
        this.endPosition = this.getRandomNumBy(endPositionArray[0], endPositionArray[1]);
        this.init();
    }

    init() {
        this.imgArray      = document.querySelectorAll('img');
        this.index         = 0; // 默认加载从0开始
        this.currIndex     = 0; // 已经加载了多少默认 0
        this.timer         = null;
        this.ele.innerHTML = this.index;
        this.isLoadInit    = false; // 是否执行过到达100函数->loadFnished
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
                this.currIndex = this.currIndex + Math.ceil((imgLoadIndex / imgLength) * this.endPosition);
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
        }, 8000 - (currTime - loadStartTime));
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
                return;
            }
            this.upPart(tempTime, endPosition);
        }, time);
    }

    /**
     * 在onload后真实的部分
     */
    downPart(endPosition) {
        this.index             = endPosition;
        this.ele.style.cssText = "width:" + this.index + "%";
        clearTimeout(this.timer);
        if (this.isLoadInit) {
            setTimeout(() => {
                this.ele.classList.add("progress-hide");
            }, 500)
        }
    }


    /**
     * 前面模拟部分
     */
    upPart(tempTime, endPosition) {
        this.currIndex         = this.index * 1 + this.getRandomNumBy(this.speedArray[0], this.speedArray[1]) * 1;
        this.ele.style.cssText = "width:" + this.currIndex + '%';
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
        return Math.ceil(Math.random() * (end - start) + start);
    }

}

new Progress('progress', [1, 5], [75, 95]);

