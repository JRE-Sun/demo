/**
 * 画svg
 * 图形和文字空白比例 3.5:1.5
 */
class DrawSvg {
    constructor({width = 500, height = 500, r = 175, list = null, titleSize = 20, contentSize = 16} = {}) {
        if (list == null) return;
        this.list        = list; // 存储的是坐标数据
        this.width       = width; // svg的宽
        this.height      = height; // svg的高
        this.r           = r; // 圆的半径
        this.titleSize   = titleSize;
        this.contentSize = contentSize;
        this.init();
        console.log(this);
    }

    init() {
        this.screenWidth  = $(window).width();
        this.screenHeight = $(window).height();
        // 屏幕状态,true横屏,false竖屏
        let screenStatus  = this.screenWidth > this.screenHeight ? true : false;
        // 当竖屏 svg的宽超过屏幕宽
        if (!screenStatus && this.screenWidth < this.width) {
            this.height = this.width = this.screenWidth;
        }
        // 当横屏 svg的高超过屏幕高
        if (screenStatus && this.screenHeight < this.height) {
            this.height = this.width = this.screenHeight;
        }
        this.r                 = 0.3 * this.width;
        this.length            = this.list.length; // 数据的长度,到时候需要平分圆
        this.angle             = 360 / this.length;
        // 设置圆心
        this.circleCenterPoint = {
            x: Math.round(this.width / 2),
            y: Math.round(this.height / 2),
        };
        // 初始化 list 列表
        this.initList();
        // 初始化核心图形
        this.initGraphic();
        // 虚线和顶点上的圆
        this.initDotLinRound();
        // 画文字
        this.initText();
        $('body').append(this.svg);
    }

    initDotLinRound() {
        let circleCenterPoint = this.circleCenterPoint;
        let html              = "<g fill='none' stroke='#8dc0e3' stroke-width='1'>";
        this.list.map(item => {
            html += `<path stroke-dasharray="5,5" d="M${item.x},${item.y} ${circleCenterPoint.x},${circleCenterPoint.y}"></path>`;
            html += `<circle cx="${item.x}" cy="${item.y}" r="2" stroke="black" stroke-width="2" fill="#fff"></circle>`;
        });
        html += '</g>';
        this.svg[0].innerHTML = this.svg[0].innerHTML + html;
    }

    /**
     * 计算响应式变量
     */
    getResponseVar(val) {
        return Math.round(val * this.width / 500);
    }

    initText() {
        let circleCenterPoint = this.circleCenterPoint;
        let html              = "<g>";
        this.list.map(item => {
            let x = item.x == circleCenterPoint.x ? item.x : false;
            let y = item.y == circleCenterPoint.y ? item.y + 10 : false;
            if (!x) x = item.x > circleCenterPoint.x ? (item.x + this.getResponseVar(50)) : (item.x - this.getResponseVar(60));
            if (!y) y = item.y > circleCenterPoint.y ? (item.y + this.getResponseVar(60)) : (item.y - this.getResponseVar(30));
            html += `<text style="fill:black;"><tspan x="${x - this.getResponseVar(20)}" y="${y - this.getResponseVar(20)}" style="font-size:${this.getResponseVar(this.titleSize)}px">${item.title}</tspan><tspan style="fill:#999;font-size:${this.getResponseVar(this.contentSize)}px" x="${x - this.getResponseVar(20)}" y="${y + this.getResponseVar(5)}">${item.content}</tspan></text>`;
        });
        html += '</g>';
        this.svg[0].innerHTML = this.svg[0].innerHTML + html;
    }

    /**
     * 初始化 list 数据
     */
    initList() {
        let r                 = this.r;
        let angle             = this.angle;
        let circleCenterPoint = this.circleCenterPoint;
        this.list             = this.list.map((item, index) => {
            let maxAngle  = index * angle;
            // 真实的长度
            item.distance = item.distance * 1 * r;
            // 这四个角度判断...我也在想办法..优化!!
            // 当张角小于90度
            if (maxAngle <= 90) {
                maxAngle = maxAngle * Math.PI / 180;
                item.x   = circleCenterPoint.x + Math.round(Math.sin(maxAngle) * item.distance);
                item.y   = circleCenterPoint.y - Math.round(Math.cos(maxAngle) * item.distance);
            }
            // 当张角 大于 90度 小于 180度
            if (maxAngle > 90 && maxAngle <= 180) {
                maxAngle = (maxAngle - 90) * Math.PI / 180;
                item.y   = circleCenterPoint.y + Math.round(Math.sin(maxAngle) * item.distance);
                item.x   = circleCenterPoint.x + Math.round(Math.cos(maxAngle) * item.distance);
            }
            // 当张角 大于 180 小于 270
            if (maxAngle > 180 && maxAngle <= 270) {
                maxAngle = (maxAngle - 180) * Math.PI / 180;
                item.y   = circleCenterPoint.y + Math.round(Math.cos(maxAngle) * item.distance);
                item.x   = circleCenterPoint.x - Math.round(Math.sin(maxAngle) * item.distance);
            }
            // 当张角 大于 270 小于 360
            if (maxAngle > 270 && maxAngle <= 360) {
                maxAngle = (maxAngle - 270) * Math.PI / 180;
                item.y   = circleCenterPoint.y - Math.round(Math.sin(maxAngle) * item.distance);
                item.x   = circleCenterPoint.x - Math.round(Math.cos(maxAngle) * item.distance);
            }
            return item;
        })
    }

    /**
     * 创建 svg, 画svg
     */
    initGraphic() {
        let positionStr = '';
        this.list.map(item => {
            positionStr += `${item.x},${item.y} `;
        });
        this.svg = $(`<svg width="${this.width}" height="${this.height}"><polygon points="${positionStr}" style="fill:#A4DAFF; stroke:#73A7FE; stroke-width:2"></polygon></svg>`);
    }
}