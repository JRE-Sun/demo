$(document).ready(() => {
    var numBox = document.getElementById('num');

    /**
     * 数字滚动
     * @param {Object} num      开始值
     * @param {Object} maxNum   最大值,最终展示的值
     */
    function numRunFun(num, maxNum) {
        var numText = num;
        var golb; // 为了清除requestAnimationFrame
        function numSlideFun() {
            numText += 5; // 速度的计算可以为小数
            if (numText >= maxNum) {
                numText = maxNum;
                cancelAnimationFrame(golb);
            } else {
                golb = requestAnimationFrame(numSlideFun);
            }
            numBox.innerHTML = numText;
        }

        numSlideFun();
    }

    // 运行
    // numRunFun(0, 1100);


    $('.send').on('click', () => {
        new ScrollNumber($('input').val());
    });
    let a = 0;
    setInterval(() => {
        a = Math.ceil(a + Math.random() * 10 + 5);
        new ScrollNumber(a);
    }, 1000);

    class ScrollNumber {
        constructor(val) {
            if (val == '' || typeof val == 'undefined' || val == null) {
                return;
            }
            this.val = val + '';
            this.init();
        }

        init() {
            this.$scrollNumber = $('.scroll-number');
            this.runStatus     = 'empty';
            if (this.$scrollNumber.html() == '') {
                this.createDom();
            }
            // 当以有文字,并且变大
            if (this.$scrollNumber.find('span').length < this.val.length) {
                this.addDom();
                this.runStatus = 'add';
            }
            // 当以有文字,并且减小
            if (this.$scrollNumber.find('span').length > this.val.length) {
                this.reduceDom();
                this.runStatus = 'reduce';
            }
            this.$span     = this.$scrollNumber.find('span');
            let spanHeight = this.$span.css('font-size');
            this.$scrollNumber.css('max-height', `${spanHeight}`);
            this.spanHeight = spanHeight.replace(/px/ig, '');
            this.run();
        }

        /**
         * 当存在元素,并且数值在减小
         */
        reduceDom() {
            let currLength = this.val.length;
            let $span      = this.$scrollNumber.find('span');
            $span.forEach((item, index) => {
                if (index >= currLength) $(item).remove();
            });
            // this.$scrollNumber.html(html);
        }

        /**
         * 当存在元素,并且数值在增大
         */
        addDom() {
            let currLength = this.val.length;
            let html       = this.$scrollNumber.html();
            let $span      = this.$scrollNumber.find('span');
            for (let i = $span.length; i < currLength; i++) {
                html += '<span>0123456789<br>.</span>';
            }
            this.$scrollNumber.html(html);
        }


        /**
         * 滚动数字
         */
        run() {
            [...this.val].map((item, index) => {
                if (item == '.') item = 10;
                this.$span.eq(index).css({
                    'transform': `translateY(-${item * this.spanHeight}px)`,
                })
            });
        }

        /**
         * 初始化dom
         */
        createDom() {
            let html = '';
            [...this.val].map((item, index) => {
                html += '<span>0123456789<br>.</span>';
            });
            this.$scrollNumber.html(html);
        }
    }
});