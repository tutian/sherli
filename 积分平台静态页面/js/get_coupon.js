$(function() {
    $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=get_available_voucher",
        data: {},
        dataType: "json",
        success: function(data) {
            getCouponCreateDom(data);
            getCouponEvent();
        },
        error: function() {
            console.log("数据连接错误");
        }
    });
    var getCouponEvent = function(){
        $(".get-coupon-main").on("tap",".get-coupon-item",function(){
            var getedCoupon = $(this).find(".icon-yilingqu");
            var coupon_id = $(this).attr("coupon-id");
            if(getedCoupon.hasClass("mui-hidden")){
                $.ajax({
                    type: "post",
                    url: "/index.php?con=ajax&act=receive_voucher",
                    data: {
                        id:coupon_id
                    },
                    dataType: "json",
                    success: function(data) {
                        if(data.err=="0"){
                            mui.alert("优惠券领取成功",function(){
                                getedCoupon.removeClass("mui-hidden");
                            });
                        }else if(data.err=="-1"){
                            mui.alert(data.err_info);
                        }else if(data.err=="-2"){
                            mui.alert(data.err_info);
                        }
                    },
                    error: function() {
                        mui.alert("数据连接错误");
                    }
                });
            }

        });
    };
    var getCouponCreateDom = function(data) {
        if (data.length !== 0) {
            $(".wallet-voucher-nohistory").hide();
            var getCouponHtml = "",
                i, item = null,
                len = data.length,mall_type;
            for (i = 0; i < len; i += 1) {
                item = data[i];
                switch (item.mall_type) {
                    case "china":
                        mall_type = "中国馆";
                        break;
                    case "oversea":
                        mall_type = "海外馆";
                        break;
                    case "seasame":
                        mall_type = "芝麻集";
                        break;
                }
                var isShow = "";
                if(item.received == 0){
                    isShow = "mui-hidden";
                }
                var fullReduceVoucherHtml = '<li class="get-coupon-item" coupon-id = "'+item.id+'"><div class="m-one"><span>' + mall_type + '</span><div class="m-money"><span>¥' + parseInt(item.value) + '</span>.00</div><span>满减券</span></div><div class="m-two c-666"><div class="list1">限自有商城满' + item.money + '元可使用，不可与其他优惠劵同时使用。</div><div class="list2"><i class="c-999">使用时间:' + item.start_time + '  ~  ' + item.end_time + '</i></div><i class="icon-yilingqu yilingqu iconfont i-seal '+isShow+'"></i></li>',
                    notDoorsillVoucherHtml = '<li class="get-coupon-item" coupon-id = "'+item.id+'"><div class="m-one"><span>' + mall_type + '</span><div class="m-money"><span>¥' + parseInt(item.value) + '</span>.00</div><span>无门槛券</span></div><div class="m-two c-666"><div class="list1">限自有商城可使用，不可与其他优惠劵同时使用。</div><div class="list2"><i class="c-999">使用时间:' + item.start_time + '  ~  ' + item.end_time + '</i></div><i class="icon-yilingqu yilingqu iconfont i-seal '+isShow+'"></i></li>';
                if (item.money != 0) {
                    getCouponHtml += fullReduceVoucherHtml;
                } else {
                    getCouponHtml += notDoorsillVoucherHtml;
                }
            }
            $(".get-coupon-main").html(getCouponHtml);
        }else{
            $(".wallet-voucher-nohistory").show();
        }
    };
});
