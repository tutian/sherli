$(function() {
    // 获取数据
    $.ajax({
        type: "get",
        url: GET_SHIPPING_ADDRESS,
        data: {},
        cache: false,
        ifModified: true,
        dataType: "json",
        success: function(data) {
            $(".load-mask").hide();
            myAddressCreateDom(data);
            myAddressOption(data);
            mui(".address-wrapper-scroll").scroll(mui.scrollOption);

        },
        error: function(xhr, type) {
            console.log("error!");
        }
    });

    //设置默认地址
    var setDefaultAddress = function(addressId,ele) {
        $.ajax({
            type: "post",
            url: SET_DEFAULT_ADDRESS,
            data: {
                addr_id: addressId,
            },
            dataType: "json",
            success: function(data) {
                if (data.state != 'success') {
                    mui.alert(data.msg);
                }else{
                    mui.alert('设置成功','提示',function(){
                        setAddressFirst(ele);
                    });

                }

            },
            error: function(xhr, type) {
                mui.alert('设置失败，请稍后再试！');
            }
        });

    };

    // 收货地址设置默认
    var myAddressSetDefault = function(_data) {
        $(".my-address-content").on("tap",".set-default-address", function() {
            var ele =$(this);
            var thisIconfont = $(this).find(".iconfont");
            var sibIconfont = $(this).parents(".my-address-item").siblings(".my-address-item").find(".set-default-address").find(".iconfont");
            var addressId = $(this).attr("data-id");
            thisIconfont.toggleClass("icon-kongxinyuan").toggleClass("icon-queren dui");
            sibIconfont.addClass("icon-kongxinyuan").removeClass("icon-queren dui");
            setDefaultAddress(addressId,ele);

        });
    };

    var setAddressFirst = function(ele){
        var item = ele.closest('.my-address-item');
        var new_item = item.clone(true);
        item.remove();
        $('.address-nohistory-main').after(new_item);
    };
    //我的地址
    var myAddressOption = function(_data) {
        var delAddress = function(ele, _data) {
            $(".mask-sure-btn").on("tap", function() {
                var myAddressItem = ele.parents(".my-address-item"),
                    addressId = ele.attr("data-id"),
                    i;
                if (_data) {
                    $.ajax({
                        type: "get",
                        url: DEL_ADDRESS,
                        data: {
                            addr_id: addressId,
                        },
                        dataType: "json",
                        success: function(data) {
                            clearTimeout(timer);
                            //移除删除的栏目并从_data中删除
                           
                            for (i = 0; i < _data.length; i += 1) {
                                var item = _data[i];
                                if (item.id == addressId) {
                                    _data.splice(i, 1);
                                }
                            }
                            var timer = setTimeout(function() {
                                 myAddressItem.remove();
                                $(".my-address-del-mask").hide();
                            }, 300);
                            if (_data.length === 0) {
                                $(".address-nohistory-main").show();
                                $(".m-foote-add-address .add-address").hide();
                            }
                        },
                        error: function(xhr, type) {
                            console.log("error!");
                        }
                    });
                }


            });
            $(".mask-cancel-btn").on("tap", function() {
                setTimeout(function(){
                    $(".my-address-del-mask").hide();
                },300);
            });
        };
        // 删除地址
        $(".my-address-item .del-my-address").on("tap", function() {

            var ele = $(this);
            $(".my-address-del-mask").show();
            delAddress(ele, _data);
        });

    };
    //收货地址加载
    var myAddressCreateDom = function(_data) {
        // $(".my-address-content").html("");
        if (_data && _data.length !== 0) {
            var myAddressHtml = "",
                _mall_type = "",
                _url = window.location.href,
                i;
            if(_url.indexOf("china")>=0){
                _mall_type = "_china";
            }else if(_url.indexOf("seasame")>=0){
                _mall_type = "_seasame";
            }
            for (i = 0; i < _data.length; i += 1) {
                var item = _data[i];
                myAddressHtml += "<li class='my-address-item'><a class='m-one ps-r my-address-default edit-address' data-id='" + item.id + "'><div class='m-msg list'><span class='iconfont icon-yonghu-copy'></span><i class='name'>" + item.accept_name + "</i><i class='p-num f-fr'>" + item.mobile + "</i><span class='iconfont icon-shouji shouji f-fr'></span></div><div class='m-address list'><i class='iconfont'>&#xe65e;</i><span>" + item.province + item.city + item.county + item.addr + "</span></div><i class='mui-icon mui-icon-arrowright'></i></a><div class='m-set-address list ovf-h z-focus'>";
                if (item.is_default === "1") {
                    myAddressHtml += "<div class='m-one ovf-h f-fl set-default-address' data-id='" + item.id + "'><span class='iconfont mui-pull-left icon-queren dui'></span><span class='f-fl'>设为默认地址</span></div>";
                } else {
                    myAddressHtml += "<div class='m-one ovf-h f-fl set-default-address' data-id='" + item.id + "'><span class='iconfont mui-pull-left icon-kongxinyuan'></span><span class='f-fl'>设为默认地址</span></div>";
                }
                myAddressHtml += "<div class='m-two ovf-h f-fr del-my-address' data-id='" + item.id + "'><span class='f-fr'>删除</span><i class='iconfont icon-shanchu shanchu f-fr'></i></div></div></li>";
            }
            $(".m-foote-add-address").show();
            $(".address-nohistory-main").hide();
            $(".my-address-content").append(myAddressHtml);
            $(".edit-address ").on("tap", function() {
                var addr_id = $(this).attr("data-id");
                window.location.href = "/index.php?con=index&act=edit_address" + _mall_type + "&confirm_address&addr_id=" + addr_id;
            });
            $(".add-address").on("tap", function() {
                window.location.href = "/index.php?con=index&act=add_address" + _mall_type + "&confirm_address";
            });
            myAddressSetDefault();
        } else {
            $(".address-nohistory-main").show();
        }

    };
});
