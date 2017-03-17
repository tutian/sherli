$(function(){
	$("body").on("tap","a",function(){
		var dataUrl = $(this).attr("data-url");
		window.location.href = dataUrl;
	});
	var _url = window.location.href;
	var total_price = _url.match(/&total_price=(\d+\.?\d{0,})/)[1];
	var mall_type = _url.match(/&mall_type=(\w+)/)[1];
	 $.ajax({
        type: "post",
        url: "/index.php?con=ajax&act=get_goods_voucher",
        data: {
        	total_price:total_price,
        	mall_type:mall_type
        },
        dataType: "json",
        success: function(data) {
 			orderCouponCreateDom(data);
 			selectCoupon(data);
        },
        error: function(xhr, type) {
            console.log("数据连接错误");
        }
    });
	var selectCoupon = function(data){
		console.log(data);
		$(".get-coupon-main").on("tap",".get-coupon-item",function(){
			if(window.sessionStorage){
				var coupon_id = $(this).attr("coupon-id");
				var coupon_value = $(this).attr("coupon-value");
				var coupin_name = $(this).attr("coupon-name");
				var confirm_order = window.sessionStorage.getItem("confirm_order");
				var coupon_obj = {
					coupon_id:coupon_id,
					coupon_value:coupon_value,
					coupin_name:coupin_name
				};
				var str = JSON.stringify(coupon_obj);
				sessionStorage.setItem("coupon_obj",str);
				window.history.go(-1);
			}
		});
	};
	var orderCouponCreateDom = function(data){
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
                var fullReduceVoucherHtml = '<li class="get-coupon-item" coupon-id = "'+item.id+'" coupon-value="'+item.value+'" coupon-name="'+item.name+'"><div class="m-one"><span>' + mall_type + '</span><div class="m-money"><span>¥' + parseInt(item.value) + '</span>.00</div><span>满减券</span></div><div class="m-two c-666"><div class="list1">限自有商城满' + item.money + '元可使用，不可与其他优惠劵同时使用。</div><div class="list2"><i class="c-999">使用时间:' + item.start_time + '  ~  ' + item.end_time + '</i></div><i class="icon-yilingqu yilingqu iconfont i-seal '+isShow+'"></i></li>',
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