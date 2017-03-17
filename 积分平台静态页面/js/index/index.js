mui.init();

mui.ready(function() {
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
     });
});
mui('.mui-scroll-wrapper').scroll({
    scrollY: false,
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    deceleration: 0.0001, //阻尼系数,系数越小滑动越灵敏
    bounce: false //是否启用回弹
});