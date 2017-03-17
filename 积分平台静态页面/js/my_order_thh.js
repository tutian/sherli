$(function() {

    //退换货
     var _url = window.location.href,
        _mall_type = "";
    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
    $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=get_refund_list",
        data: {},
        dataType: "json",
        success: function(data) {
            mui(".order-pay-wrapper").scroll(mui.scrollOption);
            orderThhCreateDom(data);
            getThhGoods(data);
        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });

    var orderThhCreateDom = function(data) {
        if (data && data.length !== 0) {
            var orderThhHtml = "",
                i, len = data.length,
                item = null,
                _status;
            $(".order-thh-nohistory").hide();
            for (i = 0; i < len; i += 1) {
                item = data[i];
                if(item.type==1){
                    if(item.status==0&&item.logistics_status==0){
                        _status = '待处理';
                    }else if(item.status==4){
                         _status = '已取消';
                    }else if(item.status==3&&item.logistics_status==0){
                         _status = '拒绝申请';
                    }else if(item.status==1&&item.logistics_status==0){
                        _status = '待邮寄货品';
                    }else if(item.status==1&&item.logistics_status==1){
                         _status = '货品邮寄中';
                    }
                    else if(item.status==2&&item.logistics_status==2){
                         _status = '退货完成';
                    }else if(item.status==3&&item.logistics_status==2){
                         _status = '原货打回';
                    }
                }else{
                  if(item.status==0&&item.logistics_status==0){
                        _status = '待处理';
                    }else if(item.status==4){
                         _status = '已取消';
                    }else if(item.status==3&&item.logistics_status==0){
                         _status = '拒绝申请';
                    }else if(item.status==1&&item.logistics_status==0){
                        _status = '待邮寄货品';
                    }else if(item.status==1&&item.logistics_status==1){
                         _status = '货品邮寄中';
                    }
                    else if(item.status==1&&item.logistics_status==2){
                         _status = '已重新发货';
                    }else if(item.status==3&&item.logistics_status==2){
                         _status = '原货打回';
                    }else if(item.status==2&&item.logistics_status==2){
                         _status = '退货完成';
                    }
                }
            
                orderThhHtml += '<li class="ui-border-b"><a href="/index.php?con=index&act=thh_details'+_mall_type+'&goods_id=' + item.goods_info[0].goods_id + '&refund_no=' + item.refund_no + '&type=' + item.type + '"><class="m-data"><div class="m-img"><img class="mui-media-object mui-pull-left" src="' + item.goods_info[0].img + '"></div><div class="m-details"><div class="list list1 ovf-h"><i class="f-fl">退换货单号：</i><span class="f-fl">' + item.refund_no + '</span></div><div class="list list2 ovf-h"><i>状态：</i><i>' + _status + '</i></div><div class="list list3 c-999"><i>申请时间：</i><i>' + item.create_time + '</i></div></div><i class="mui-icon-arrowright mui-icon"></i></a></li>';
            }

            $(".m-goods-details").html(orderThhHtml);
        } else {
            $(".order-thh-nohistory").show();
            $(".order-thh-scroll").hide();
        }
    };

    // 获取退换货商品
    var getThhGoods = function() {
        if (window.sessionStorage) {
            var thhGoods = JSON.parse(sessionStorage.getItem("thhGoods"));
            if (thhGoods) {
                $(".thh-goods-main").show();
                var i, len = thhGoods.length,
                    thhItem = null,
                    thhGoodsHtml = "";
                for (i = 0; i < len; i += 1) {
                    thhItem = thhGoods[i];
                    thhGoodsHtml += '<span class="thh-goods-item"><i class="evel-drop-pic"><img src="' + thhItem.goos_img + '"></i><span class="iconfont icon-x1 thh-apply-x close-thh-apply"></span></span>';
                }
                $(".thh-goods-scroll").html(thhGoodsHtml);
                $(".close-thh-apply").on("tap", function() {
                    var thhSrc = $(this).siblings(".evel-drop-pic").find("img").attr("src"),
                        i, len = thhGoods.length,
                        item = null;
                    $(this).parent(".thh-goods-item").remove();
                    if ($(".thh-goods-scroll").html() === "") {
                        $(".thh-goods-main").hide();
                    }
                    for (i = len; i--;) {
                        item = thhGoods[i];
                        if (item.goos_img === thhSrc) {
                            thhGoods.splice(i, 1);
                        }
                    }
                });
                thhSendGoods(thhGoods);
                sessionStorage.removeItem("thhGoods");
            } else {
                $(".thh-goods-main").hide();
            }

        }
    };
    //提交退换货
    $(".order-apply-btn").on("tap", function() {
         
        $(this).addClass("z-focus").siblings().removeClass("z-focus");
    });
    var thhSendGoods = function(thhGoods) {
        var _type, _comment, goodsArr = [];
        var _url = window.location.href,
            _mall_type = "";
        if (_url.indexOf("china") >= 0) {
            _mall_type = "_china";
        } else if (_url.indexOf("seasame") >= 0) {
            _mall_type = "_seasame";
        }

        $(".thh-send-goods").on("tap", function() {
            $(this).off("tap");
            var goods_id, goods_num, mall_type, order_id, sell_price,sesame, order_no, img, i,
                goodsItem = null;
            _type = $(".apply-btn-box .z-focus").attr("data-type");
            _comment = $(".order-apply-textarea").val();

            for (i = 0; i < thhGoods.length; i += 1) {
                goodsItem = thhGoods[i];
                img = goodsItem.goos_img;
                mall_type = goodsItem.mall_type;
                goods_id = goodsItem.goods_id;
                order_id = goodsItem.order_id;
                order_no = goodsItem.order_no;
                goods_num = goodsItem.goods_num;
                sell_price = goodsItem.sell_price;
                sesame = goodsItem.sesame;
                goodsArr.push({
                    goods_id: goods_id,
                    mall_type: mall_type, //馆类型(china:中国馆 oversea:海外馆 seasame:芝麻集)
                    order_id: order_id, //订单id
                    order_no: order_no, //订单号
                    goods_num: goods_num, //退换货数量
                    sell_price: sell_price, //商品售价
                    sesame:sesame,
                    img: img
                });
            }
            if (_comment === "") {
                mui.toast("请输入问题描述!");
                return false;
            }

            $.ajax({
                type: "post",
                url: "/index.php?con=ajax&act=submit_refund",
                data: {
                    type: _type, //退换货类型(1.退货 2.换货)
                    comment: _comment, //问题描述
                    goods: goodsArr,
                    imgs: []
                },
                dataType: "json",
                success: function(data) {
                    if(data['err']==0){
                        window.location.href = "/index.php?con=index&act=my_order_thh"+_mall_type;
                        mui.toast("提交成功");
                    }else{
                        $(this).on('tap');
                        mui.alert(data['err_info']);
                    }
                },
                error: function() {
                    $(this).on('tap');
                    console.log("thh-apply-error");
                }
            });
        });
    };
});
