$(function() {
    var _mall_type = "",
        _url = window.location.href;
    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
    //点击我的订单与我的余额链接，跳转到相对应的页面
    $(".order-all-control").on("tap", function() {
        var index = $(this).index();
        var dataUrl = $(this).attr("data-url");
        $(this).addClass("active").siblings(".order-all-control").removeClass("active");
        $(".order-all-list").eq(index).show().siblings(".order-all-list").hide();
        window.location.replace(dataUrl);
    });
    // 取消订单
    var cancelOrder = function() {
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
                            if (data.err == 0) {
                                window.location.reload();
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
    var delOrder = function(orderArr) {

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
                                self.parents(".m-list").remove();
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
    // 确认收货
    var confirmGoods = function() {
        //确认收货
        $(".confirm-goods-btn").on("click", function() {
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
                    window.location.href = CONFIRM_GOODS + _mall_type + '&order_id=' + order_id;
                },
                error: function() {
                    console.log("error");
                }
            });
        });

    };
    var myOrderStyle = function() {
        var hash = window.location.href.split("#"),
            _hash;
        if (hash === "") {
            _hash = "my-order-all";
        } else if (hash.indexOf("&") > 0) {
            _hash = hash[1].split("&")[0];
        } else {
            _hash = hash[1];
        }
        $("." + _hash).addClass("active").siblings(".order-all-control").removeClass("active");
        $("#" + _hash).show().siblings(".order-all-list").hide();
    };
    // 催单
    $(".urge-order").on("click",function(){
        mui.toast("您的催单信息已发送成功");
    });
    confirmGoods();
    myOrderStyle();
    cancelOrder();
    delOrder();
});
