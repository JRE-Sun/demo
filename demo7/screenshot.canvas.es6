/**
 * canvas截屏
 */
class ScreenShot {
    constructor({canvas = null, list = null, init = null, complete = null} = {}) {
        this.initCallback = init;
        this.canvas       = canvas;
        this.list         = list;
        this.complete     = complete;
        this.init();
    }

    init() {
        this.initCallback && this.initCallback();
        this.initCanvas();
    }

    /**
     * 初始化canvas
     */
    initCanvas() {
        let canvas = document.createElement('canvas');
        // 这里设置成2倍,为了能够显示更清楚
        // $(canvas).css({
        //     width : this.canvas.style.width,
        //     height: this.canvas.style.height
        // });
        canvas.width  = this.canvas.width;
        canvas.height = this.canvas.height;

        let ctx = canvas.getContext('2d');

        let currLoadIndex = 0;
        let imgLength     = 0;
        let timer         = null;
        this.list.map((item) => {
            let style = item.style;
            if (item.type != 'img') {
                ctx.textBaseline = "top";
                ctx.font         = `${style.font.size} ${style.font.family}`;
                ctx.fillText(item.text, style.left, style.top);
                return;
            }
            imgLength++;
            // 是图片类型就加载图片
            this.loadImg(item.src, (img) => {
                currLoadIndex++;
                ctx.drawImage(img, style.left, style.top, style.width, style.height);
            });
            timer = setTimeout(() => {
                if (imgLength != currLoadIndex) return;
                clearInterval(timer);
                this.complete && this.complete();
                this.loadImg(canvas.toDataURL("image/png"), (img) => {
                    $('body').append(img);
                });
            }, 20);
        });
    }

    /**
     * 预加载图片
     */
    loadImg(url, callback) {
        let img    = document.createElement('img');
        img.onload = () => {
            callback(img);
        }
        img.src    = url;
    }
}