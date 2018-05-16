$('.btn').on('click', function () {
    var $this = $(this);
    // 禁用
    $this.attr('disabled', 'disabled');
    let luckDraw = new LuckDraw({
        selector: '.luck-draw',
        callback: () => {
            $this.removeAttr('disabled');
        }
    });
    // 这个setTimeout是假设的请求
    setTimeout(function () {
        luckDraw.prizeNum = Math.floor(Math.random() * 8);
        console.log(luckDraw.prizeNum);
    }, 3000);
});