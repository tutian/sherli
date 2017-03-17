$(function() {
    var _url = window.location.href;
    $.ajax({
        type: "get",
        url: GET_ATTENTION,
        data: {},
        dataType: "json",
        success: function(data) {
            collectNav(data);


            mui(".collet-china-lib-wrapper").scroll({
                bounce: false,
                indicators: false, // 是否显示滚动条
                deceleration: mui.deceleration
            });
            mui(".collet-aboard-lib-wrapper").scroll({
                bounce: false,
                indicators: false, // 是否显示滚动条
                deceleration: mui.deceleration
            });
            mui(".collet-jingxiu-lib-wrapper").scroll({
                bounce: false,
                indicators: false, // 是否显示滚动条
                deceleration: mui.deceleration
            });
            mui(".collet-sema-lib-wrapper").scroll({
                bounce: false,
                indicators: false, // 是否显示滚动条
                deceleration: mui.deceleration
            });

        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    var collectNavCreateDom = function(data, type) {
        var collectHtml = "",
            i, _mall_type = "";
        if (data.length !== 0) {
            $("." + type + "-collect-nohistory").hide();
            for (i = 0; i < data.length; i += 1) {
                var item = data[i];
                if (item.mall_type === "china") {
                    _mall_type = '_china';
                } else if (item.mall_type === "seasame") {
                    _mall_type = '_seasame';
                }
                collectHtml += '<li class="mui-table-view-cell"><div class="m-img"><a href="/index.php?con=index&act=goods_detail' + _mall_type + '&goods_id=' + item.goods_id + '" class="my-collect-item"><img src="' + item.img + '"></a></div><div class="m-details"><div class="m-goods">' + item.name + '</div><div class="m-s-btn">';
                for (var j = 0, len = item.tags.length; j < len; j += 1) {
                    var itemTags = item.tags[j];
                    collectHtml += '<span class="b-s btn">' + itemTags + '</span>';
                }
                if (item.mall_type === 'seasame') {
                    collectHtml += '</div><div class="m-price ovf-h"><span class="c-purple f-fl"><i class="iconfont icon-zmb01"></i>' + item.sell_price + '</span></div></div><span class="iconfont icon-shanchu shanchu collect-del-btn" goods-id = "' + item.goods_id + '"></span></li>';
                } else {
                    collectHtml += '</div><div class="m-price ovf-h"><span class="c-purple f-fl">¥' + item.sell_price + '</span><i class="f-fl coin-deliver">送' + item.sesame + '芝麻币</i></div></div><span class="iconfont icon-shanchu shanchu collect-del-btn" goods-id = "' + item.goods_id + '"></span></li>';
                }

            }
            $("#collet-" + type).find(".mui-table-view").html(collectHtml);

        } else {
            $("." + type + "-collect-nohistory").show();
        }
        $("#collet-" + type).find(".my-collect-item").on("tap", function() {
            sessionStorage.setItem("myCollectType", type);
        });
    };
    var selectGlobal = function(data) {
        if (data && data.length !== 0) {
            var tempArr = [],
                chinaTempArr = [],
                overseaTempArr = [],
                seasameTempArr = [],
                i;
            for (i = 0; i < data.length; i += 1) {
                var item = data[i];
                switch (item.mall_type) {
                    case "china":
                        chinaTempArr.push(item);
                        break;
                    case "oversea":
                        overseaTempArr.push(item);
                        break;
                    case "seasame":
                        seasameTempArr.push(item);
                        break;
                }
            }
            collectNavCreateDom(chinaTempArr, "china");
            collectNavCreateDom(overseaTempArr, "oversea");
            collectNavCreateDom(seasameTempArr, "seasame");
        }
    };

    var collectNav = function(data) {

        var type = "oversea",
            flag = 0,
            collectMallType,
            _url = window.location.href;
        if (_url.indexOf("china") >= 0) {
            type = "china";
        } else if (_url.indexOf("seasame") >= 0) {
            type = "seasame";
        }
        $(".collet-" + type).addClass("mui-active").siblings().removeClass("mui-active");
        $("#collet-" + type).addClass("mui-active").siblings(".mui-control-content").removeClass("mui-active");
        selectGlobal(data);
        delCollectItem(data);

    };
    // 删除收藏
    var delCollectItem = function(data, type) {

        var ele;
        $(".collect-del-btn").on("tap", function() {
            console.log("ok");
            ele = $(this);
            $(".myshow-del-mask").show();
        });
        $(".del-sure-btn").on("tap", function() {
            var goods_id = ele.attr("goods-id");
            $.ajax({
                type: "get",
                url: "index.php?con=ajax&act=op_attention",
                data: {
                    goods_id: goods_id
                },
                dataType: "json",
                success: function(data) {
                    if (data.err == 0) {
                        var goodName = ele.parent(".mui-table-view-cell").find(".m-goods").text();
                        var muiTab = ele.closest(".mui-table-view");
                        var nohistory = ele.closest(".mui-scroll").siblings(".no-history-main");
                        var len = muiTab.children().length;
                        mui.alert("取消收藏成功");
                        $(".myshow-del-mask").hide();

                        for (var i = 0; i < data.length; i += 1) {
                            if (goodName === data[i].name) {
                                data.splice(i, 1);
                            }
                        }
                        ele.parent(".mui-table-view-cell").remove();
                        if (len === 1) {
                            muiTab.remove();
                            nohistory.show();
                        }
                    }
                },
                error: function() {
                    console.log("error");
                }
            });


        });
        $(".mask-cancel-btn").on("tap", function() {
            $(".myshow-del-mask").hide();
        });


    };
});
