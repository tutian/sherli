$(function(){

    $(".home-bar").on("tap","a",function(){
        window.location.href = $(this).prop("href");

    });
    mui('.my-show-scroll-wrapper').scroll(mui.scrollOption);
	 //我的秀创建元素
    var myshowCreateDom = function(goods) {
        $(".wechat-head .my-pic").css({
            "background-image": "url(" + goods.head_pic + ")"
        });
        $(".wechat-head .ta-c").text(goods.user_name);
        // 待收货数
        if(goods.delivery_num===0){
            $(".my-order-dsh .mui-badge").hide();
        }else{
            $(".my-order-dsh .mui-badge").show().text(goods.delivery_num);
        }
        // 待评价数
        if(goods.review_num===0){
            $(".my-order-dpj .mui-badge").hide();
        }else{
            $(".my-order-dpj .mui-badge").show().text(goods.review_num);
        }
        // 待支付数
        if(goods.un_pay===0){
            $(".my-order-dfk .mui-badge").hide();
        }else{
            $(".my-order-dfk .mui-badge").show().text(goods.un_pay);
        }
        $(".my-wallet-yue .my-wallet-num").text(goods.balance);
        $(".my-seama-coin .my-wallet-num").text(goods.sesame);
        $(".my-share-coin .my-wallet-num").text(goods.enjoy_coin);
        $(".my-wallet-voucher .my-wallet-num").text(0);
    };
    // 判断是否绑定手机号码
    if(is_mobile==0){
        popMask();
    }
});
 mui('body').on('tap','a',function(){
    window.location.href = this.getAttribute('data-url');
});