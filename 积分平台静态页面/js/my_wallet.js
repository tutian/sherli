mui.init({
    gestureConfig: {
        tap: true, //默认为true
        doubletap: true, //默认为false
        longtap: true, //默认为false
        swipe: true, //默认为true
        drag: true, //默认为true
        hold: false, //默认为false，不监听
        release: false //默认为false，不监听
    }
});
$(function() {

    var _url = window.location.href,
        _mall_type = "",
        mall_type = 'oversea';
    // var refund_no = _url.match(/&refund_no=(\d+)/)[1];
    // var goods_id = _url.match(/&goods_id=(\d+)/)[1];
    // var type = _url.match(/&type=(\d)/)[1];

    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
        mall_type = 'china';
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
        mall_type = 'seasame';
    }
    //钱包
    $.ajax({
        type: "get",
        url: GET_ACCOUNT_INFO,
        data: {},
        cache: false,
        ifModified: true,
        dataType: "json",
        success: function(data) {
            console.log(data);
            walletCreateDom(data);
            shareCoinDrawCash(data);
            myWalletStyle();
            delNotVilidCoupon(data);
            $(".load-mask").hide();
        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    var couponTips = function() {
        mui.toast("长按可删除已失效的优惠券");
    };
    $(".wallet-nav-control").on("tap", function() {
        var index = $(this).index();
        var dataUrl = $(this).attr("data-url");
        $(this).addClass("active").siblings(".wallet-nav-control").removeClass("active");
        $(".wallet-list").eq(index).show().siblings(".wallet-list").hide();
        if (dataUrl.indexOf("my-wallet-gift") >= 0) {
            couponTips();
        }
        window.location.replace(dataUrl);
    });

    var myWalletStyle = function() {
        var hash = window.location.href.split("#"),
            _hash;
        if (hash === "") {
            _hash = "my-wallet-yue";
        } else if (hash.indexOf("&") > 0) {
            _hash = hash[1].split("&")[0];
        } else {

            _hash = hash[1];
        }
        $("." + _hash).addClass("active").siblings().removeClass("active");
        $("#" + _hash).show().siblings(".wallet-list").hide();
        if (hash.indexOf("my-wallet-gift") >= 0) {
            couponTips();
        }
    };
    var walletCreateDom = function(data) {
        var vouchertHtml = "",
            notVilidHtml = "",
            fullReduceVoucherHtml = "",
            notDoorsillVoucherHtml = "",
            getedVoucherHtml = "",
            useedVoucherHtml = "",
            money,
            i, item, mall_type, vilidArray = [],
            notVilidArray = [];
        
        $(".wallet-cash-num").text(data.balance);
        $(".number-zhimabi").text(data.sesame);
        $(".avilable-share-coin").text(data.use_coin);
        $(".no-account-num").text(data.not_coin);
        if (data && data.voucher.length !== 0) {
            $(".wallet-voucher-nohistory").hide();
            for (i = 0; i < data.voucher.length; i += 1) {
                item = data.voucher[i];
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
                var isBgcActive = "",
                    isBlcActive = "";
                if (item.is_valid == 0) {
                    isBgcActive = "bgcactive";
                    isBlcActive = "blcactive";
                }
                fullReduceVoucherHtml = '<li class="wallet-voucher-item" voucher-id="'+item.id+'"><div class="m-one ' + isBgcActive + '"><span>' + mall_type + '</span><div class="m-money"><span>¥' + parseInt(item.value) + '</span>.00</div><span>满减券</span></div><div class="m-two c-666 ' + isBlcActive + '"><div class="list1">限自有商城满' + item.money + '元可使用，不可与其他优惠劵同时使用。</div><div class="list2"><i class="c-999">使用时间:' + item.start_time + '  ~  ' + item.end_time + '</i></div>';
                notDoorsillVoucherHtml = '<li class="wallet-voucher-item" voucher-id="'+item.id+'"><div class="m-one ' + isBgcActive + '"><span>' + mall_type + '</span><div class="m-money"><span>¥' + parseInt(item.value) + '</span>.00</div><span>无门槛券</span></div><div class="m-two c-666 ' + isBlcActive + '"><div class="list1">限自有商城可使用，不可与其他优惠劵同时使用。</div><div class="list2"><i class="c-999">使用时间:' + item.start_time + '  ~  ' + item.end_time + '</i></div>';
                getedVoucherHtml = '<i class="icon-yilingqu yilingqu iconfont i-seal"></i></li>';
                useedVoucherHtml = '<i class="icon-yishiyong yishiyong iconfont i-seal"></i></li>';
                if (item.is_valid == 1) {
                    if (item.money != 0) {
                        vouchertHtml += fullReduceVoucherHtml;
                        vouchertHtml += getedVoucherHtml;
                    } else {
                        vouchertHtml += notDoorsillVoucherHtml;
                        vouchertHtml += getedVoucherHtml;
                    }
                } else {
                    if (item.money != 0) {
                        notVilidHtml += fullReduceVoucherHtml;
                    } else {
                        notVilidHtml += notDoorsillVoucherHtml;
                    }

                    if (item.status == 1) {
                        notVilidHtml += useedVoucherHtml;
                    } else {
                        notVilidHtml += getedVoucherHtml;
                    }

                }

            }
            $("#my-wallet-gift .wallet-voucher").html(vouchertHtml);
            if(notVilidHtml!==""){
                $("#my-wallet-gift .not-vilid").show();
                $("#my-wallet-gift .not-vilid-main").html(notVilidHtml);
            }else{
                $("#my-wallet-gift .not-vilid").hide();
            }
            
        } else {
            $(".wallet-voucher-nohistory").show();
        }
        $(".share-coin-btn").on("tap", function() {
            $(".share-coin-mask").show();
        });
        $(".mask-cancel-btn").on("tap", function() {
            $(".share-coin-mask").hide();
        });
    };
    var shareCoinDrawCash = function(data) {
        var maskSureHref = $(".mask-sure-btn").prop("href");
        $(".share-coin-text").on("input", function() {
            var shareCoin = parseInt($(".avilable-share-coin").text());
            var inputCoin = $(this).val();
            if (inputCoin > shareCoin || inputCoin < 100) {
                $(".mask-sure-btn").prop("href", maskSureHref);
            } else {
                $(".mask-sure-btn").prop("href", "#my-wallet-yue");
            }
        });
        $(".mask-sure-btn").on("tap", function() {
            var moneyNum = parseFloat(data.use_coin);
            var shareCoin = parseFloat($(".avilable-share-coin").text());
            var happy_money_alert= $(".share-coin-text").val();
            if (happy_money_alert <= shareCoin && happy_money_alert >= 100) {
                $.ajax({
                    type: "get",
                    url: ENJOY_COIN,
                    data: {
                        money: happy_money_alert
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.state == 'succeed') {
                            mui.alert("兑换成功",function(){
                                window.location.reload();
                            });
                            // window.location.href = MY_WALLET+_mall_type+'&mall_type='+mall_type+'#my-wallet-yue';
                        } else {
                            mui.alert("兑换失败",function(){
                                window.location.reload();
                            });
                            // window.location.href = MY_WALLET+_mall_type+'&mall_type='+mall_type+'#my-wallet-yue';
                        }
                    },
                    error: function() {
                        console.log("error");
                    }
                });
            } else {
                if(happy_money_alert==''){
                    $(this).prop("href", maskSureHref);
                    mui.toast("请输入乐享币数量");
                }else if (happy_money_alert > shareCoin) {
                    $(this).prop("href", maskSureHref);
                    mui.toast("可使用乐享币不足");
                    // return false;
                } else if(happy_money_alert < 100){
                    $(this).prop("href", maskSureHref);
                    mui.toast("满100才可以提现哦~");
                    return false;
                }
            }
        });
    };
    // 删除已失效的优惠券
    var delNotVilidCoupon = function(data) {
        $(".not-vilid").on("longtap", ".wallet-voucher-item", function() {
            var ele = $(this);
            var voucher_id = ele.attr("voucher-id");
            var notVilidMain = $(".not-vilid-main");
            var walletVoucherHtml = $(".wallet-voucher").html();
            mui.confirm("确定删除该优惠券？","提示",function(e){
                if(e.index==1){
                    $.ajax({
                        type: "post",
                        url: "/index.php?con=ajax&act=delete_voucher",
                        data: {
                            id:voucher_id
                        },
                        dataType: "json",
                        success: function(_data) {
                            if(_data.err==0){
                                var i,item=null,len=data.voucher.length;
                                for(i=0;i<len;i++){
                                    item = data.voucher[i];
                                    console.log(data.voucher[i]);
                                    if(item.id==voucher_id){
                                        data.voucher.splice(i,1);
                                        break;
                                    }
                                }
                                ele.remove();
                                var notVilidMainHtml = notVilidMain.html();
                                if(notVilidMainHtml==""){
                                    $(".not-vilid").hide();
                                }
                                if(walletVoucherHtml=="" && notVilidMainHtml==""){
                                    $(".wallet-voucher-nohistory").show();
                                }
                                console.log(data);
                            }else{
                                mui.toast(_data.err_info);
                            }
                        },
                        error: function(xhr, type) {
                            mui.alert("数据连接失败");
                        }
                    });
                }
            });
            
        });
    };
    $(".wallet-list").on("tap", "a", function() {
        var dataUrl = $(this).attr("data-url");
        window.location.href = dataUrl;
    });


});
