$(function() {
    var order_id = window.location.href.match(/&order_id=(\d+)/)[1];
    $.ajax({
        type: "get",
        url: GET_ORDER_DETAIL,
        cache:false, 
        ifModified :true ,
        data: {
            order_id: order_id
        },
        dataType: "json",
        success: function(data) {
            orderAllInfoCreateDom(data);
            cancelOrderInfo(data);
            delOrderInfo(data);
            confirmGoods();
            mui(".order-pay-wrapper").scroll(mui.scrollOption);
           $.fn.countTime(data, "order-info-hour", "order-info-min", "order-info-sec");
        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    var _url = window.location.href,
        _mall_type = "";

    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
    // 取消订单
    var cancelOrderInfo = function(orderArr) {
        $(".cancel-order-btn").on("tap", function() {
            var ele = $(this);
            mui.confirm("确定要取消订单吗？", function(e) {
                if (e.index == 1) {
                    var ordertitle = ele.parents(".order-con-item-bottom").siblings(".m-title ").find(".order-all-type");
                    var orderDelBtn = ele.siblings(".del-order");
                    var orderBtn = ele.siblings(".my-order-all-pay");
                    orderNum = ele.attr("order-id");
                    $.ajax({
                        type: "get",
                        url: CANCEL_ORDER,
                        data: {
                            order_no: orderNum //订单号
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.err === 0) {
                                window.history.go(-1);
                            } else {
                                mui.alert(data.err_info);
                            }
                        },
                        error: function() {
                            console.log("error");
                        }
                    });
                }
            });

        });
    };
    // 删除订单
    var delOrderInfo = function(orderArr) {
        $(".del-order").on("tap", function() {
            var self = $(this);
            mui.confirm("确定要删除订单吗？", function(e) {
                if (e.index === 1) {
                    var orderId = self.attr("order-id");
                    var orderControl = $(".order-all-control .mui-active");
                    var muiControlContent = self.parents(".mui-control-content");
                    $.ajax({
                        type: "get",
                        url: DELETE_ORDER,
                        data: {
                            order_no: orderId
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.err === 0) {
                                window.history.go(-1);
                            } else {
                                mui.toast(data.err_info);
                            }

                        },
                        error: function() {
                            console.log("error");
                        }
                    });
                }
            });

        });
    };
    var orderAllInfoCreateDom = function(data) {
        var i, goodsHtml = "",
            orderAllInfoHtml = "",
            sesameSum = 0,
            status = "",
            orderDiscHtml = "",
            footerHtml = "",
            orderAddressHtml = "",
            voucher_value,
            j, k, orderAllInfoIcon = "¥";
        if (data.mall_type === "seasame") {
            orderAllInfoIcon = '<i class="iconfont icon-zmb01"></i>';
        }
        // 待付款
        if (data.status === "0" && data.pay_status === "0" && data.delivery_status === "0") {
            $(".order-count-time").show();
            status = "待付款";
            footerHtml += '<li class="wait-pay-bottom"><a data-url="/index.php?con=index&act=order_pay'+_mall_type+'&order_no=' + data.order_no + '" class="z-focus b-delete btn my-order-all-pay">去付款</a></li><li class="m-btn b-check "><span order-id="' + data.order_no + '" class="b-check btn cancel-order-btn">取消订单</span></li>';
        }
        // 待确认
        if (data.status === "0" && data.pay_status === "1" && data.delivery_status === "0") {
            status = "待确认";
            footerHtml += '<li><a order-id="' + data.order_no + '" class="btn cancel-order-btn ">取消订单</a><a order-id="' + data.order_no + '" class="del-order btn">删除订单</a></li>';
        }
        // 代发货
        if (data.status === "1" && data.pay_status === "1" && data.delivery_status === "0") {
            status = "待发货";
            footerHtml += '<li><a order-id="' + data.order_no + '" class="btn urge-order">我要催单</a></li>';
        }
        // 待收货
        if (data.status === "1" && data.pay_status === "1" && data.delivery_status === "1") {
            status = "待收货";
            footerHtml += '<li><a order-no="'+data.order_no+'" order-id="'+data.id+'"  class="confirm-goods-btn z-focus  btn">确认收货</a></li>';
        }
        // 待评价
        if (data.status === "4") {
            status = "待评价";
            footerHtml += '<li><a class="btn z-hide">售后服务</a></li><li><a href="'+MY_PINGJIA+'&order_id='+data.id+'" class="order-pj z-focus  btn">去评价</a></li>';
        }
        // 已取消
        if (data.status === "3") {
            status = "已取消";
            footerHtml += '<li><a order-id="' + data.order_no + '" class="del-order btn">删除订单</a></li>';
        }
        // 交易成功 
        if (data.status === "2") {
            status = "交易成功";
            footerHtml += '<li><a order-id="' + data.order_no + '" class="del-order btn">删除订单</a></li><li><a class="order-pj z-focus  btn">售后服务</a></li>';
        }
        // 头部
        orderDiscHtml = '<li><div class="m-one">订单编号：' + data.order_no + '</div><div class="m-two">下单时间：' + data.create_time + '</div><div class="m-three c-purple order-status">' + status + '</div></li>';
        // 地址
        orderAddressHtml = '<div class="m-msg"><span class="iconfont icon-yonghu-copy weibiaoti101 "></span><i class="name">' + data.accept_name + '</i><i class="p-num f-fr order-info-phone">' + data.mobile + '</i><span class="iconfont icon-shouji f-fr shouji" style="position: static;"></span></div><div class="m-address"><i class="iconfont icon-dizhi"></i><span class="order-info-address-disc">' + data.whole_address + '</span></div>';


        $(".order-disc").html(orderDiscHtml);
        $(".order-info-address").html(orderAddressHtml);
        $(".order-all-footer").html(footerHtml);



        if (data.is_invoice !== "0") {
            $(".order-info-tax").text(data.invoice_title);
        }
        if (data.goods && data.goods.length !== 0) {
            $(".goods-num").text(data.goods.length);
        }

        // 发票
        if (data && data.is_invoice == "1") {
            if(data.invoice_title.indexOf(":")>=0){
                 $(".invoice-title").text(data.invoice_title.split(":")[1]);
             }else{
                 $(".invoice-title").text(data.invoice_title);
             }
           
        }else{
            $(".invoice-title").text("不需要");
        }
        //优惠券
        if (data && data.voucher_id !== "0") {
            voucher_value = data.voucher_value;
        }else {
            voucher_value = "0.00";
        }
        // 商品信息
        if (data.status === "1" && data.pay_status === "1" && data.delivery_status === "1") {
            for (var m in data.goods) {
                var itemDsh = data.goods[m].goods_list;
                orderAllInfoHtml = orderAllInfoHtml + '<div class="m-mod m-mod6 "><div class="title ovf-h ui-border-b"><i class="mui-icon iconfont icon-huoche huoche"></i><span>包裹' + m + '</span><span>共<i class="c-purple">' + itemDsh.length + '</i>件商品</span><a class="z-focus btn b-middle f-fr look-logistics" href="/index.php?con=index&act=wuliu_details'+_mall_type+'&express_company='+data.goods[m].express_company+'&express_no='+data.goods[m].express_no+'" >查看物流</a></div><ul class="m-goods-details">';
                for (i = 0; i < itemDsh.length; i += 1) {
                    var itemD = itemDsh[i];
                    orderAllInfoHtml += '<li class="ui-border-b"><a data-url="/index.php?con=index&act=goods_detail'+_mall_type+'&goods_id='+itemD.goods_id+'"><div class="m-img"><img class="mui-media-object mui-pull-left" src="' + itemD.img + '"></div><div class="m-details"><div class="list list1 ovf-h"><div class="f-fl goods-name-details">' + itemD.name + '</div><div class="f-fr"><div class="goods-price-num">' + orderAllInfoIcon + itemD.sell_price + '</div>';
                    if (data.mall_type !== "seasame") {
                        orderAllInfoHtml += '<span class="guess-git">送' + itemD.sesame + '芝麻币</span>';
                    }
                    orderAllInfoHtml += '</div></div><p>';
                    if (itemD.alltags && itemD.alltags.length !== 0) {
                        for (j = 0; j < itemD.alltags.length; j += 1) {
                            orderAllInfoHtml += '<span class="guess-post">' + itemD.alltags[i] + '</span>';
                        }
                    }
                    orderAllInfoHtml += '</p><div class="list list3 ovf-h"><i class="f-fl goods-spec-size">';
                    if (itemD.specs && itemD.specs.length !== 0) {
                        for (k = 0; k < itemD.specs.length; k += 1) {
                            var specItemD = itemD.specs[k];
                            orderAllInfoHtml += '<span>' + specItemD.name + ':' + specItemD.value + '</span>';
                        }
                    }
                    orderAllInfoHtml += '</i><span class="f-fr c-666">X<span class="y-buy-goods-num">' + itemD.num + '</span></span></div></div></a></li>';
                    sesameSum += parseInt(itemD.sesame);
                }
                // }
                orderAllInfoHtml = orderAllInfoHtml + '</ul></div></div>';
            }
            $(".goods-disc-item").html(orderAllInfoHtml);

        } else {
            if (data.goods && data.goods.length !== 0) {
                $(".package-num").text(data.goods_num);
                for (i = 0; i < data.goods.length; i += 1) {
                    var item = data.goods[i];
                    orderAllInfoHtml += '<li class="ui-border-b"><a data-url="/index.php?con=index&act=goods_detail'+_mall_type+'&goods_id='+data.goods[0].goods_id+'"><div class="m-img"><img class="mui-media-object mui-pull-left" src="' + item.img + '"></div><div class="m-details"><div class="list list1 ovf-h"><div class="f-fl goods-name-details">' + item.name + '</div><div class="f-fr"><div class="goods-price-num">' + orderAllInfoIcon + item.sell_price + '</div>';
                    if (data.mall_type !== "seasame") {
                        orderAllInfoHtml += '<span class="guess-git">送' + item.sesame + '芝麻币</span>';
                    }
                    orderAllInfoHtml += '</div></div><p>';
                    if (item.alltags && item.alltags.length !== 0) {
                        for (j = 0; j < item.alltags.length; j += 1) {
                            orderAllInfoHtml += '<span class="guess-post">' + item.alltags[j] + '</span>';
                        }
                    }
                    orderAllInfoHtml += '</p><div class="list list3 ovf-h"><i class="f-fl goods-spec-size">';
                    if (item.specs && item.specs.length !== 0) {
                        for (k = 0; k < item.specs.length; k += 1) {
                            var specItem = item.specs[k];
                            orderAllInfoHtml += '<span>' + specItem.name + ':' + specItem.value + '</span>';
                        }
                    }
                    orderAllInfoHtml += '</i><span class="f-fr c-666">X<span class="y-buy-goods-num">' + item.num + '</span></span></div></div></a></li>';
                    sesameSum += parseInt(item.sesame);
                }
                $(".m-goods-details").html(orderAllInfoHtml);
            }
        }
        $(".order-sure-sesame").text(data.sesame + "芝麻币");
        // 商品金额
        var orderInfoCashHtml = "";
        if (data.mall_type !== "seasame") {
            orderInfoCashHtml = '<li>商品总金额<span class="order-info-total-num ">' + orderAllInfoIcon + data.goods_price + '</span></li><li>税金<span class="order-info-tax-num ">+¥' + data.taxes + '</span></li><li>运费<span class="order-info-tans-num ">+¥' + data.real_freight + '</span></li><li>优惠<span class="order-info-fav-num ">-¥' +voucher_value + '</span></li>';
        } else {
            $(".order-info-cash").remove();
            $(".order-ticket").remove();
            $(".ta-c").remove();
        }
        $(".order-info-cash").html(orderInfoCashHtml);
        $(".order-info-cash-num").html(orderAllInfoIcon + data.total_amount);
        
        //催单按钮
        $(".urge-order").on("tap", function() {
            mui.toast("您的催单信息已发送成功");
        });

    };
    var confirmGoods = function() {
        //确认收货
        $(".confirm-goods-btn").on("tap", function() {
            var orderNo = $(this).attr("order-no");
            var order_id = $(this).attr("order-id");
            $.ajax({
                type: "get",
                url: CONFIRM_RECEIPT,
                data: {
                    order_no: orderNo
                },
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    if(data.err==0){
                         window.location.href = CONFIRM_GOODS + _mall_type + '&order_id=' + order_id;
                     }else{
                        mui.alert(data.err_info);
                     }
                   
                },
                error: function() {
                    console.log("error");
                }
            });
        });

    };
    $("body").on("tap","a",function(){
        var dataUrl = $(this).data("url");
        window.location.href = dataUrl;
    });
});
