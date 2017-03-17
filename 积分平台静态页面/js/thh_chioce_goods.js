$(function() {

    
    $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=get_enable_refund",
        data: {},
        dataType: "json",
        success: function(data) {
            ThhChoiceGoodsCreateDom(data);
            orderthhGoods();
            bindCheckboxEvent();
            mui(".chioce-goods-wrapper").scroll(mui.scrollOption);

        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    // 选择退换货商品
    var bindCheckboxEvent = function(){
        $(".shop-lib-checkbox").on("tap",function(){
            $(".shop-lib-checkbox").not($(this)).prop("checked", false);

        });
    };
    var ThhChoiceGoodsCreateDom = function(goods) {
        clearInterval(timer);
        var timer;
        var _d, _h, _m, _s;
        var format = function(num) {
            return num < 10 ? "0" + num : num;
        };
       
        if (goods && goods.length !== 0) {
            var ThhChoiceGoodsHtml = "",
                i, item = null;
            $(".thh-chioce-nohistory").hide();
            $(".order-thh-footer").show();
            for (i = 0; i < goods.length; i += 1) {
                item = goods[i];
                ThhChoiceGoodsHtml += '<div class="shop-lib-item"><div class="mui-checkbox shop-lib-item-left fl shop-cart-checkbox"><input name="checkbox"type="checkbox" class="shop-lib-checkbox shop-lib-item-checkbox" order-id="' + item.order_id + '" order-no="' + item.order_no + '" goods-id="' + item.goods_id + '" goods-img="' + item.img + '" goods-price="' + item.sell_price + '" mall-type="'+item.mall_type+'" sesame="'+item.sesame+'"></div><div class="shop-lib-item-center fl"><div class="lib-item-center-top"><span class="lib-item-img-box"><img src="' + item.img + '"></span></div><div class="lib-item-center-bottom"><a class="shop-lib-reduce-num shop-lib-num">-</a><a></a><a class="shop-lib-add-num shop-lib-num">+</a><span class="lib-item-goods-num mui-disabled">' + item.num + '</span></div></div><div class="shop-lib-item-right"><p class="shop-lib-goods-name">' + item.name + '</p><p class="chioce-goods-price">价格：<span class="shop-lib-goods-price">¥' + item.sell_price + '</span></p><span class="remian-time">剩余退换时间:';

                ThhChoiceGoodsHtml += '<span class="thh-date">' + _d + '</span>天<span class="thh-hour">' + _h + '</span>:<span class="thh-minute">' + _m + '</span>:<span class="thh-second">' + _s + '</span></span>';
                ThhChoiceGoodsHtml += '</div></div>';
                $(".thh-chioce-main").html(ThhChoiceGoodsHtml);
                $.fn.countTime(item,"thh-hour","thh-minute","thh-second","thh-date");
            }

        } else {
            $(".thh-chioce-nohistory").show();
            $(".thh-chioce-scroll").hide();
            $(".order-thh-footer").hide();
        }
    };
    var orderthhGoods = function() {
        var thhGoodsId, thhOrderId, thhOrderNo, thhGoodsNum, thhSellPrice, thhGoodsImg, thhGoodsStr = [];
        $(".order-thh-apply").on("tap", function() {
            thhGoodsStr = [];
            var checkedBox = $(".shop-lib-item-checkbox:checked"),
                i, len = checkedBox.length,
                goodsItem = null;
            checkedBox.each(function(n) {
                goodsItem = $(this);
                thhGoodsId = goodsItem.attr("goods-id");
                thhOrderId = goodsItem.attr("order-id");
                thhOrderNo = goodsItem.attr("order-no");
                thhSellPrice = goodsItem.attr("goods-price");
                thhGoodsImg = goodsItem.attr("goods-img");
                thhMallType = goodsItem.attr("mall-type");
                thhSesame = goodsItem.attr("sesame");
                thhGoodsNum = goodsItem.parents(".shop-lib-item-left").siblings(".shop-lib-item-center ").find(".lib-item-goods-num").text();
                thhGoodsStr.push({
                    "goods_id": thhGoodsId, //商品id
                    "order_id": thhOrderId, //订单id
                    "order_no": thhOrderNo, //订单号
                    "goods_num": thhGoodsNum, //退换货数量
                    "sell_price": thhSellPrice, //商品售价
                    "goos_img": thhGoodsImg,
                    "mall_type": thhMallType,
                    "sesame" : thhSesame

                });
            });
            var str = JSON.stringify(thhGoodsStr);
            console.log(str);
            sessionStorage.setItem("thhGoods", str);
        });
    };
});
