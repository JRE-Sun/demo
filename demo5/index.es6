$(document).ready(() => {
    // // 纯dom彩蛋!
    // new PullToRefresh({
    //     mainDom     : 'body',
    //     pullStartDom: `<div class="vertical-center"><img src="https://c1.zcimg.com/static/index/img/g.png"
    // alt=""><p>由掌圈提供技术支持</p></div>`,
    // });

    // 执行下拉刷新
    new PullToRefresh({
        mainDom     : 'body',

        pullStartDom: `<span>下拉加载</span>`,
        pullEndDom  : `<span>加载中...</span>`,
        pullCallBack: (pull) => {
            // 外界手动关闭pull,再执行外部刷新逻辑的时候,dom是不隐藏的,需要ajax后自己手动隐藏
            // pull.pullHide();
            console.log('pullCallBack,执行刷新;逻辑!');
        }
    });
});