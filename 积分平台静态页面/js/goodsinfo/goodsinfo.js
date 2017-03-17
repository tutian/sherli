(function($) {
    var deceleration = mui.os.ios ? 0.001 : 0.0005;
    mui('.goodsinfo-scroll-wrapper').scroll({
        bounce: true,
        indicators: false, //是否显示滚动条
        deceleration: deceleration
    });
})(mui);

$(function() {

    var _url = window.location.href;

    $(".mui-control-item").on("tap", function() {
        $(this).find("span").addClass("active").parent().siblings(".mui-control-item").find("span").removeClass("active");
    });


    //收藏
    var goodsCollect = function() {
        $(".goodinfo-shoucan").on("tap", function() {
            var goods_id = $(this).find(".goodsinfo-collect-icon").attr('goods_id');
            $(this).find(".goodsinfo-collect-icon").toggleClass("icon-shoucang").toggleClass("icon-icon47");
            if ($(this).find(".goodsinfo-collect-icon").hasClass("icon-shoucang")) {
                $(this).find(".goodsinfo-collect-icon").siblings(".goodsinfo-collect-disc").text("收藏").addClass('f-666').removeClass('f-basecolor');
            } else {
                $(this).find(".goodsinfo-collect-icon").siblings(".goodsinfo-collect-disc").text("已收藏").addClass('f-basecolor').removeClass('f-666');
            }

            $.ajax({
                type: "get",
                url: OP_ATTENTION,
                data: {
                    goods_id: goods_id
                },
                dataType: "json",
                success: function(data) {

                },
                error: function(xhr, type) {

                }
            });
        });
    };
    goodsCollect();

    var data = JSON.parse(_data);
    if(data.store_nums==0){
        $(".goodsinfo-add-cart").addClass("active");
        $(".goodsinfo-current-buy").addClass("active");
    }
    //选择商品
    var goodsSelect = function(data) {
        var skumapArr = [],
            selectInfoArr = [],
            _size = $(".goods-size-disc").size(),
            i;
        $(".goodsinfo-select").on("tap", function() {
            $(".goodsinfo-cart-mask").show();
        });
        // 默认显示第一个规格
        $(".goods-size-item").eq(0).show().siblings(".goods-size-item").hide();
        $(".goods-size-disc").each(function(n) {
            $(this).find(".goods-size-list").on("tap", function() {
                // selectInfoArr = [];
                var skid = $(this).attr("skid");
                var val = $(this).text();
                var i;
                var len = selectInfoArr.length;
                var item = null;
                var _text = "";
                var _size = $(".goods-size-disc").size();
                var sizeArr = [];
                var store_nums;
                var skuId;

                // 改变样式
                $(this).addClass("size-active").siblings().removeClass("size-active");
                // 点击选中之后，如果后第二个规格，则显示
                if ($(".goods-size-item").eq(1)) {
                    $(".goods-size-item").eq(1).show();
                }
                if (selectInfoArr.length !== 0) {
                    for (i = 0; i < len; i += 1) {
                        if (selectInfoArr[i].skid && selectInfoArr[i].skid.split(":")[0] === skid.split(":")[0]) {
                            selectInfoArr[i] = { skid: skid, val: val };
                        } else {
                            selectInfoArr[n] = { skid: skid, val: val };
                        }
                    }
                } else {
                    selectInfoArr[n] = { skid: skid, val: val };
                }
                var selectInfoArrLen = selectInfoArr.length;
                if (selectInfoArrLen > 1 && selectInfoArrLen === _size && selectInfoArr[0].val && selectInfoArr[1].val) {
                    skuId01 = ";" + selectInfoArr[0].skid.split(":")[0] + ":" + selectInfoArr[1].skid.split(":")[1] + ";" + selectInfoArr[1].skid.split(":")[0] + ":" + selectInfoArr[0].skid.split(":")[1] + ";";
                     skuId02 = ";" + selectInfoArr[1].skid + ";" + selectInfoArr[0].skid + ";";
                     skuId03 = ";" + selectInfoArr[0].skid + ";" + selectInfoArr[1].skid + ";";
                    if (data.skumap[skuId01]) {
                        store_nums = data.skumap[skuId01].store_nums;
                        $(".goodsinfo-select-cont").html("已选择:" + selectInfoArr[0].val + " " + selectInfoArr[1].val).css({ "color": "#8f8f94" });
                        if (store_nums > 0) {
                            $(".goods-lib").text("即时库存：" + store_nums).css({
                                "color": "#8f8f94"
                            });
                            $(".goods-price").text(data.skumap[skuId01].sell_price);
                            $(".goodsinfo-current-buy").removeClass("active");
                            $(".goodsinfo-add-cart").removeClass("active");
                        } else {
                            $(".goodsinfo-current-buy").addClass("active");
                            $(".goodsinfo-add-cart").addClass("active");
                            $(".goods-lib").text("库存不足,请选购其他商品").css({
                                "color": "red"
                            });
                        }
                    } else if(data.skumap[skuId02]){
                       
                        store_nums = data.skumap[skuId02].store_nums;
                        $(".goodsinfo-select-cont").html("已选择:" + selectInfoArr[0].val + " " + selectInfoArr[1].val).css({ "color": "#8f8f94" });
                        if (store_nums > 0) {
                            $(".goods-lib").text("即时库存：" + store_nums).css({
                                "color": "#8f8f94"
                            });
                            $(".goods-price").text(data.skumap[skuId02].sell_price);
                            $(".goodsinfo-current-buy").removeClass("active");
                            $(".goodsinfo-add-cart").removeClass("active");
                        } else {
                            $(".goodsinfo-current-buy").addClass("active");
                            $(".goodsinfo-add-cart").addClass("active");
                            $(".goods-lib").text("库存不足,请选购其他商品").css({
                                "color": "red"
                            });
                        }
                    }else {
                         store_nums = data.skumap[skuId03].store_nums;
                        $(".goodsinfo-select-cont").html("已选择:" + selectInfoArr[0].val + " " + selectInfoArr[1].val).css({ "color": "#8f8f94" });
                        if (store_nums > 0) {
                            $(".goods-lib").text("即时库存：" + store_nums).css({
                                "color": "#8f8f94"
                            });
                            $(".goods-price").text(data.skumap[skuId03].sell_price);
                            $(".goodsinfo-current-buy").removeClass("active");
                            $(".goodsinfo-add-cart").removeClass("active");
                        } else {
                            $(".goodsinfo-current-buy").addClass("active");
                            $(".goodsinfo-add-cart").addClass("active");
                            $(".goods-lib").text("库存不足,请选购其他商品").css({
                                "color": "red"
                            });
                        }
                    }

                } else {
                    skuId = ";" + selectInfoArr[0].skid + ";";
                    if (data.skumap[skuId]) {
                        store_nums = data.skumap[skuId].store_nums;
                        $(".goodsinfo-select-cont").html("已选择:" + selectInfoArr[0].val).css({ "color": "#8f8f94" });
                        if (store_nums > 0) {
                            $(".goods-lib").text("即时库存：" + store_nums).css({
                                "color": "#8f8f94"
                            });
                            $(".goods-price").text(data.skumap[skuId].sell_price);
                            $(".goodsinfo-current-buy").removeClass("active");
                            $(".goodsinfo-add-cart").removeClass("active");
                        } else {
                            $(".goodsinfo-current-buy").addClass("active");
                            $(".goodsinfo-add-cart").addClass("active");
                            $(".goods-lib").text("库存不足,请选购其他商品").css({
                                "color": "red"
                            });
                        }
                    }

                }
            });
        });

    };
    goodsSelect(data);
    var addShopCart = function(id, num) {
        var goodsShopCartNum = $(".goodsinfo-shopcart .mui-badge").html();
        $.ajax({
            type: "get",
            url: "/index.php?con=ajax&act=add_cart",
            data: {
                product_id: id,
                num: num
            },
            dataType: "json",
            success: function(data) {
                mui.toast("添加购物车成功！");               
              $("#goodsinfo").hide().removeClass('mui-active');
              $(".mui-backdrop").remove();
            },
            error: function(xhr, type) {
                mui.toast("添加购物车失败！");
            }
        });
        $(".goodsinfo-shopcart .mui-badge").html(parseInt(goodsShopCartNum) + parseInt(num));

    };
    var norAddCartNorSkuMap = function(goods, shopCartNum) {
        var goodsFlagArr = [],
            skuStr = "",
            goodsFlag = false;
        $(".goods-size-disc").each(function() {
            var goodsSizeList = $(this).find(".goods-size-list");
            if (goodsSizeList.hasClass("size-active")) {
                goodsFlagArr.push("true");
            }
        });
        if (goodsFlagArr.length === $(".goods-size-disc").size()) {
            goodsFlag = true;
        }

        if (goodsFlag) {
            var skuArr = [],
                _skuStr = "",
                _skuStr01 = ";",
                _skuStr02 = "",
                _skuStr03 = "";

            $(".goods-size-disc").each(function() {
                dataSize = $(this).find(".size-active").attr("skid");
                skuArr.push(dataSize);
                _skuStr01 += dataSize + ';';
            });
            if ($(".goods-size-disc").size() > 1) {
                _skuStr02 = ";" + skuArr[0].split(":")[0] + ":" + skuArr[1].split(":")[1] + ";" + skuArr[1].split(":")[0] + ":" + skuArr[0].split(":")[1] + ";";
                _skuStr03 = ";" + skuArr[1] + ";" + skuArr[0] + ";";
            }
            if (goods.skumap[_skuStr01]) {
                _skuStr = _skuStr01;
            } else if (goods.skumap[_skuStr02]) {
                _skuStr = _skuStr02;
            } else if (goods.skumap[_skuStr03]) {
                _skuStr = _skuStr03;
            }


            // if (goods.skumap[skuStr]) {
            //     _skuStr = skuStr;
            // } else if ($(".goods-size-disc").size() === 2) {
            //     _skuStr = ";" + skuArr[0].split(":")[0] + ":" + skuArr[1].split(":")[1] + ";" + skuArr[1].split(":")[0] + ":" + skuArr[0].split(":")[1] + ";";
            // }
            addShopCart(goods.skumap[_skuStr].id, shopCartNum);
            setTimeout(function() {
                $(".goodsinfo-cart-mask").hide();
               
            }, 1500);
        } else {
            mui.toast("请选择商品属性");
            return false;
        }
    };

    //购买
    var goodsinfoBuy = function(goods) {

        //立即购买
        var _mall_type = '';
        var shopCartNum;
        $(".order-sure-original").on("tap", function() {
            if ($(this).hasClass("active")) {
                return false;
            } else {
                var goodsFlag = false,
                    goodsFlagArr = [],
                    skuStr = ";",
                    productId, orderType = 2,
                    dataSize, goodsSizeList, activeId, _type,
                    dataSizeArr = [],
                    skumapFlag = 0;
                shopCartNum = $("#goodsinfoInputNumbox").val();
                if (goods.specs.length !== 0) {
                    skumapFlag = 1;
                } else {
                    if (_url.indexOf("china") > 0) {
                        _mall_type = '_china';
                    } else if (_url.indexOf("seasame") > 0) {
                        _mall_type = '_seasame';
                    }

                    window.location.href = "/index.php?con=index&act=confirm_order" + _mall_type + "&product_id=" + goods.skumap[""].id + "&order_type=" + orderType + "&num=" + shopCartNum;
                }
                if (skumapFlag === 1) {
                    $(".goods-size-disc").each(function() {
                        goodsSizeList = $(this).find(".goods-size-list");
                        if (goodsSizeList.hasClass("size-active")) {
                            goodsFlagArr.push("true");
                        }
                    });

                    if (goodsFlagArr.length === $(".goods-size-disc").size()) {
                        goodsFlag = true;
                    }

                    shopCartNum = parseInt($("#goodsinfoInputNumbox").val());

                    if (goodsFlag) {
                        var skuArr = [],
                            _skuStr = "",
                            _skuStr01 = ";",
                            _skuStr02 = "",
                            _skuStr03 = "";

                        $(".goods-size-disc").each(function() {
                            dataSize = $(this).find(".size-active").attr("skid");
                            skuArr.push(dataSize);
                            _skuStr01 += dataSize + ';';
                        });
                        if ($(".goods-size-disc").size() > 1) {
                            _skuStr02 = ";" + skuArr[0].split(":")[0] + ":" + skuArr[1].split(":")[1] + ";" + skuArr[1].split(":")[0] + ":" + skuArr[0].split(":")[1] + ";";
                            _skuStr03 = ";" + skuArr[1] + ";" + skuArr[0] + ";";
                        }
                        if (goods.skumap[_skuStr01]) {
                            _skuStr = _skuStr01;
                        } else if (goods.skumap[_skuStr02]) {
                            _skuStr = _skuStr02;
                        } else if (goods.skumap[_skuStr03]) {
                            _skuStr = _skuStr03;
                        }
                        productId = goods.skumap[_skuStr].id;



                        if (productId !== undefined) {
                            if (goods.flash_id) {
                                activeId = goods.flash_id;
                                _type = "flashbuy";
                                $(this).attr("href", "/index.php?con=index&act=confirm_order?id=" + activeId + "&pid=" + productId + "&num=" + shopCartNum + "&type=" + _type);
                            } else {
                                orderType = 2;
                                if (_url.indexOf("china") > 0) {
                                    _mall_type = '_china';
                                } else if (_url.indexOf("seasame") > 0) {
                                    _mall_type = '_seasame';
                                }
                                window.location.href = "/index.php?con=index&act=confirm_order" + _mall_type + "&product_id=" + productId + "&order_type=" + orderType + "&num=" + shopCartNum;
                            }
                        }
                        setTimeout(function() {
                            $("#goodsinfoshopcart").removeClass("mui-active");
                            $(".mui-backdrop-action").removeClass("mui-active").remove();
                        }, 10);
                    } else {
                        mui.toast("请选择商品属性");
                        flag = true;
                        return false;
                    }
                }
              
            }

        });
        //加入购物车
        $(".goodsinfo-add-cart").on("tap", function() {
        
            if ($(this).hasClass("active")) {
                return false;
            } else {
                var goodsFlag = false,
                    goodsFlagArr = [],
                    skuStr = "",
                    dataSizeArr = [],
                    flagSku = 0,
                    orderType = 2;
                shopCartNum = $("#goodsinfoInputNumbox").val();

                if (goods.specs.length !== 0) {
                    norAddCartNorSkuMap(goods, shopCartNum);
                } else {
                    addShopCart(goods.skumap[""].id, shopCartNum);

                }

            }
            
        // $(this).parents("#goodsinfo").hide();
        // $(".goodsinfo-cart-mask").hide();
        });
        // 遮罩
        $(".goodsinfo-cart-mask").on("tap", function() {
            $(this).hide();
        
        });
        // 加入购物车
        $(".goodsinfo-add-shopcart").on("tap", function() {
            $(".goodsinfo-cart-footer").show();
            $(".y-btn-buygoods").hide();
            $(".goodsinfo-cart-mask").show();
          
            $(".goodsinfo-shopcart .mui-badge").show();
        });
        // 立即购买
        $(".goodsinfo-rush-buy").on("tap", function() {
            $(".goodsinfo-cart-footer").hide();
            $(".y-btn-buygoods").show();
            $(".goodsinfo-cart-mask").show();
         
        });

        // 关闭购物车
        $(".goods-right").on("tap", function() {
            $(".goodsinfo-cart-mask").hide();
          
        });
    };
    // addShopCart();
    //评价
    var goodsinfoEvel = function(goods) {
        var i;
        var star = ["<a class='mui-icon iconfont icon-star1 appraise-star-icon'></a>", "<a class='mui-icon iconfont icon-star1 appraise-star-icon'></a>", "<a class='mui-icon iconfont icon-star1 appraise-star-icon'></a>", "<a class='mui-icon iconfont icon-star1 appraise-star-icon'></a>", "<a class='mui-icon iconfont icon-star1 appraise-star-icon'></a>"];
        if (goods.comments.length === 0) {
            $(".not-pingjia").show();
        } else {
            $(".goodsinfo-evel").on("tap", function() {
                var evelHtml = "";
                for (i = 0; i < goods.comments.length; i += 1) {
                    $("#goodsinfoEvel .mui-table-view").html("");
                    var item = goods.comments[i];
                    evelHtml += "<li class='mui-table-view-cell goodsinfo-appraise-item'><div class='appraise-header'><i class='appraise-tx fl'><img src='" + item.user_pic + "'></i><span class='appraise-nc'>" + item.user_name + "</span><span class='appraise-icon fr'>";
                    for (var j = 0; j < parseInt(item.star); j += 1) {
                        evelHtml += star[j];
                    }
                    evelHtml += "</span></div><div class='appraise-main'><p>" + item.info + "</p></div><div class='appraise-footer'><time datetime='" + item.buy_time + "' class='appraise-footer-item'>" + item.buy_time + "</time>";
                    for (var k = 0; k < item.spec; k += 1) {
                        evelHtml += "<span class='appraise-size appraise-footer-item'>" + item.spec.name + ":<i class='appraise-size-disc'>" + item.spec.value + "</i></span>";
                    }
                    evelHtml += "</div><div class='appraise-reply'><span class='appraise-arrow'></span><p class='appraise-reply-disc'>回复:<span>谢谢亲对我们的肯定和鼓励,我们定以优质的服务,高质量的商品回馈亲们的信任,欢迎再次光临小店,第二次购物送100积分,还有八折优惠哦!</span></p></div>";
                }
                $("#goodsinfoEvel .mui-table-view").html(evelHtml);

            });

        }

    };

    //回到顶部
    var goToTop = function() {
        //详情导航栏
        $(".goodsinfo-tab .goodsinfo-control-item").each(function(n) {
            $(this).on("tap", function() {
                var span = $(this).children("span");
                span.addClass("active").parent().siblings().find("span").removeClass("active");
                $(".goodsinfo-control-item").eq(n).addClass("mui-active").siblings(".goodsinfo-control-item").removeClass("mui-active");
            });

        });
        $(".mui-scroll-wrapper").on("scroll", function() {
            var st = $(".mui-scroll").attr("style");
            var num = Math.abs(st.match(/\-\d+/));
            if (num > 100) {
                $(".scroll-top").show();
            } else {
                //              $(".scroll-top").hide();
            }
        });
    };

    goodsinfoBuy(data);
    goToTop();
});
