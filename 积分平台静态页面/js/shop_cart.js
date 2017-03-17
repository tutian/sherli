$(function() {
 mui.shopcaryNohistoryHtml = '<div class="no-history-main shopcart-nohistory-main"><div class="no-history-box"><span class="iconfont icon-gouwuche-copy no-history-icon"></span></div><p class="no-history-disc">亲，您的购物车还是空的哟~</p><a class="shop-cart-gohome">去商城逛逛</a></div>';
    var mallType, _url = window.location.href;
    if (_url.indexOf("&mall_type=") >= 0) {
        mallType = _url.match(/&mall_type=(\w+)/)[1];
    }



    mui(".china-scroll-wrapper").scroll(mui.scrollOption);
    mui(".oversea-scroll-wrapper").scroll(mui.scrollOption);
    mui(".jinxiu-scroll-wrapper").scroll(mui.scrollOption);
    mui(".seasame-scroll-wrapper").scroll(mui.scrollOption);

    // 购物车导航
    var shopcartNavBindEvent = function(goods) {
        $(".shop-control-item").each(function(n) {
            $(this).on("tap", function() {
                $(".shop-lib").eq(n).html("");
                $(this).addClass("active").siblings().removeClass("active");
                $(".shop-control-content").eq(n).addClass("mui-active").siblings(".shop-control-content").removeClass("mui-active");

                mallType = $(this).attr("data-id");
                shopcartCreateDom(goods, mallType);

            });
        });
    };
    // 去商城逛逛
    var goToHome = function() {
        $(".go-to-china").on("tap", function() {
            console.log("ok");
            mui.openWindow({
                url: INDEX_CHINA,
                waiting: {
                    autoShow: true, //自动显示等待框，默认为true
                    title: '正在加载...' //等待对话框上显示的提示内容
                }
            });
        });

        $(".go-to-seasame").on("tap", function() {
            mui.openWindow({
                url: INDEX_SEASAME,
                waiting: {
                    autoShow: true, //自动显示等待框，默认为true
                    title: '正在加载...' //等待对话框上显示的提示内容
                }
            });
        });
        $(".go-to-oversea").on("tap", function() {
            mui.openWindow({
                url: INDEX_URL,
                waiting: {
                    autoShow: true, //自动显示等待框，默认为true
                    title: '正在加载...' //等待对话框上显示的提示内容
                }
            });
        });
    };

    //删除
    var delDom = function() {
        var delServerData = function(product_id) {

            $.ajax({
                type: "get",
                url: REMOVE_CART,
                data: {
                    product_id: product_id
                },
                dataType: "json",
                success: function(data) {
                    if(data.err==0){
                        mui.toast("删除成功");
                    }else{
                        mui.toast("删除失败");
                    }
                    
                },
                error: function() {
                    console.log("error");
                }
            });
        };

        $(".shop-lib .icon-shanchu").on("tap", function() {
            var ele = $(this);
            mui.confirm("要删除所选择的商品？", function(e) {
                if (e.index === 1) {
                    var shopItem = ele.parents(".shop-lib-item");
                    var shopLib = shopItem.parent(".shop-lib");
                    var shopMain = shopLib.parent();
                    var selectAll = shopLib.parents(".shop-cart-scroll-wrapper").siblings(".shop-cart-select-all");
                    var shopScroll = shopItem.parents(".mui-scroll"),
                        i;
                    var product_id = ele.attr("product-id");
                    var checkbox = ele.closest(".shop-lib-item").find(".shop-lib-checkbox");
                    var numbox = ele.closest(".shop-lib-item").find(".lib-item-goods-num");
                    if (checkbox.is(":checked")) {
                        var total_price = parseFloat($(".select-all-price").text());
                        var total_num = parseInt($(".select-all-num").text());
                        var single_price = parseFloat(checkbox.attr("data-sell-price"));
                        var single_num = parseInt(numbox.text());
                        var _total_price = parseFloat(total_price - single_price * single_num);
                        var _total_num = total_num - single_num;

                        $(".select-all-price").text(_total_price.toFixed(2));
                        $(".select-all-num").text(_total_num);
                    }
                    shopItem.remove();
                    setTimeout(function() {
                        $(".myshow-del-mask").hide();
                    }, 1000);
                    var _childLen = $(".shop-lib").children().length;
                    if (_childLen === 0) {
                        selectAll.hide();
                        $(".no-history-main").show();
                        shopScroll.html(mui.shopcaryNohistoryHtml);
                        $(".shop-lib").remove();
                        $(".shop-cart-select-all").hide();
                    }

                    delServerData(product_id);
                }
            });

        });


    };
    var goodsNumChange = function(id, type) {
        $.ajax({
            type: "get",
            url: CART_CNT,
            data: {
                product_id: id,
                cnt_type: type
            },
            dataType: "json",
            success: function(data) {

            },
            error: function() {
                console.log("error");
            }
        });
    };
    var accountShopCart = function() {
        $(".account-btn").on("tap", function() {
            var checkBox = $(this).parents(".shop-cart-select-all").siblings(".mui-scroll-wrapper").find("input:checked"),
                productIdArr = [],
                product_id;
            var orderType = 1,
                num = "";
            checkBox.each(function() {
                productIdArr.push($(this).attr("product-id"));
            });
            if (productIdArr.length !== 0) {
                product_id = productIdArr.join(",");
                window.location.href = CONFIRM_ORDER + "&product_id=" + product_id + "&order_type=" + 1;
            } else {
                mui.toast("请选择商品");
            }
        });
    };
    accountShopCart();
    //全选
    var selectedDom = function(mallType) {
        var sumTotalNum = 0,
            sumTotalPrice = 0,
            goodsnum = 0,
            goodsPrice = 0,
            default_total_num = 0,
            default_total_price = 0;
        selectTotalNum = $("#shop-lib-" + mallType + " .select-all-num"),
            selectTotalPrice = $("#shop-lib-" + mallType + " .select-all-price"),
            checkallTotal = $("#shop-lib-" + mallType + " .checkall-total"),
            checkItem = $("#shop-lib-" + mallType + " .shop-lib-checkbox");

        if (checkallTotal.prop("checked")) {
            checkItem.prop("checked", true);
        }


        if ($(".shop-lib-item-checkbox").prop("checked")) {
            var chked_box = $(".shop-lib-item-checkbox:checked"),
                item = null,
                i, len = chked_box.length;
            for (i = 0; i < len; i += 1) {
                item = chked_box[i];
                var sellPrice = item.getAttribute("data-sell-price"),
                    sellNum = item.parentNode.nextElementSibling.lastElementChild.lastElementChild.innerText;
                default_total_num = default_total_num + parseInt(sellNum);
                default_total_price = default_total_price + sellPrice * sellNum;
            }
            $(".select-all-num").text(default_total_num);
            $(".select-all-price").text(default_total_price);
        }
        // 全选按钮点击事件
        $(".shop-cart-select-all").on('change', '.checkall-total', function() {
            var flag = false;
            if ($(this).is(':checked')) flag = true;
            $(".shop-lib-item").find("input").prop("checked", flag);

            if (flag) { //选择所有
                var num = 0;
                var total_price = 0.00;
                var goods_price = 0.00;
                $(".shop-lib-item input").each(function() {
                    var goods_num = $(this).parent().next().find('.lib-item-goods-num').text();
                    var _price = $(this).parent().siblings('.shop-lib-item-right').find('.goods-price-num').text();
                    if(mallType=='seasame')
                        goods_price = _price.substring(0, _price.length);
                    else
                        goods_price = _price.substring(1, _price.length);
                    total_price += goods_num * goods_price;
                    num += parseInt(goods_num);
                });
                selectTotalPrice.text(total_price.toFixed(2));
                $('.select-all-num').text(num);
            } else {
                $('.select-all-num').text(0);
                selectTotalPrice.text('0.00');
            }

        });

        //单选点击事件
        $('.shop-lib-item-left').on('change', 'input', function() {
            var flag = false; //默认选中
            var self = $(this);
            if (self.is(':checked')) flag = true;

            var num = parseInt($('.select-all-num').text());
            var total_price = parseFloat(selectTotalPrice.text());
            var goods_price = 0.00;

            var goods_num = self.parent().next().find('.lib-item-goods-num').text();
            var _price = self.parent().siblings('.shop-lib-item-right').find('.goods-price-num').text();
            if(mallType=='seasame')
                goods_price = _price.substring(0, _price.length);
            else
                goods_price = _price.substring(1, _price.length);


            if (flag) { //选中该按钮
                total_price += parseInt(goods_num) * parseFloat(goods_price);
                num += parseInt(goods_num);

            } else { //取消选中
                $(".shop-cart-select-all").find('.checkall-total').prop('checked', false);
                total_price -= parseInt(goods_num) * parseFloat(goods_price);
                num -= parseInt(goods_num);
            }

            selectTotalPrice.text(total_price.toFixed(2));
            $('.select-all-num').text(num);

        });


        //加号点击事件
        $('.shop-lib-item').on('tap', '.shop-lib-add-num', function() {
            var _select = $(this).closest('.shop-lib-item').find('input');
            var _goods_num = $(this).closest('.shop-lib-item').find('.lib-item-goods-num').text();
            var _price = $(this).closest('.shop-lib-item').find('.goods-price-num').text();
            var goods_price = _price.substring(1, _price.length);

            goods_num = parseInt(_goods_num) + 1;

            var num = parseInt($('.select-all-num').text());
            var total_price = parseFloat(selectTotalPrice.text());

            if (!_select.is(':checked')) { //非选中则添加所有数量与金额
                // _select.prop('checked',true);
                // total_price += parseInt(goods_num)*parseFloat(goods_price);
                // num += parseInt(goods_num);
            } else { //若处于选中状态则只添加1个数量和一个价格到总数量
                total_price += parseFloat(goods_price);
                num += 1;
                selectTotalPrice.text(total_price.toFixed(2));
                $('.select-all-num').text(num);
            }



            $(this).closest('.shop-lib-item').find('.lib-item-goods-num').text(goods_num);

            var product_id = parseInt(_select.attr('product-id'));

            goodsNumChange(product_id, 1);

        });


        //减号点击事件
        $('.shop-lib-item').on('tap', '.shop-lib-reduce-num', function() {
            var _select = $(this).closest('.shop-lib-item').find('input');
            var _goods_num = $(this).closest('.shop-lib-item').find('.lib-item-goods-num').text();
            var _price = $(this).closest('.shop-lib-item').find('.goods-price-num').text();
            var goods_price = _price.substring(1, _price.length);

            if (parseInt(_goods_num) == 1) return false;

            goods_num = parseInt(_goods_num) - 1;

            var num = parseInt($('.select-all-num').text());
            var total_price = parseFloat(selectTotalPrice.text());

            if (!_select.is(':checked')) { //非选中则添加所有数量与金额
                // _select.prop('checked',false);
                // total_price -= parseInt(goods_num)*parseFloat(goods_price);
                // num -= parseInt(goods_num);
            } else { //若处于选中状态则只减少1个数量和一个价格到总数量
                total_price -= parseFloat(goods_price);
                num -= 1;
                selectTotalPrice.text(total_price.toFixed(2));
                $('.select-all-num').text(num);
            }

            $(this).closest('.shop-lib-item').find('.lib-item-goods-num').text(goods_num);

            var product_id = parseInt(_select.attr('product-id'));

            goodsNumChange(product_id, 2);

        });
    };
    var shop_cart_back = function() {
        $(".shop-lib-oversea").on("tap", function() {
            location.replace("/index.php?con=index&act=shop_cart&mall_type=oversea");
        });
        $(".shop-lib-china").on("tap", function() {
            location.replace("/index.php?con=index&act=shop_cart_china&mall_type=china");
        });
        $(".shop-lib-jinxiu").on("tap", function() {
            location.replace("/index.php?con=index&act=shop_cart&mall_type=jinxiu");
        });
        $(".shop-lib-seasame").on("tap", function() {
            location.replace("/index.php?con=index&act=shop_cart_seasame&mall_type=seasame");
        });
    };
    shop_cart_back();
    selectedDom(mallType);
    delDom();

});
