(function($) {
    mui.init();
    mui.citydata = function() {
        mui.ready(function() {
            mui.get("/themes/mobile/localdatas/city.data.json", function(data) {

                var cityPicker = new $.PopPicker({
                    layer: 3
                });
                cityPicker.setData(data);
                var showCityPickerButton = document.querySelector('#showCityPicker');
                var addAddressSel = document.querySelector(".add-address-sel");
                showCityPickerButton.addEventListener('tap', function(event) {
                    cityPicker.show(function(items) {
                        addAddressSel.innerText = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                        addAddressSel.setAttribute("province-id", (items[0] || {}).value);
                        addAddressSel.setAttribute("city-id", (items[1] || {}).value);
                        addAddressSel.setAttribute("county-id", (items[2] || {}).value);
                    });
                }, false);
            });
        });

    };
})(mui);
$(function() {
    // 滚动条初始化
    mui(".order-pay-wrapper").scroll(mui.scrollOption);
    // 获取mall_type
    var _url = window.location.href,
        _mall_type = "";
    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
    //新增收货地址按钮；
    var addAddressSwitch = function() {
        // 打开新增收货地址
        $(".add-address").each(function() {
            $(this).on("tap", function() {
                $(".add-address-mask").show();
            });
        });
        // 关闭新增收货地址
        $(".add-address-close").on("tap", function() {
            $(".add-address-mask").hide();
        });

        mui('.mui-input-row input').input();
        $(".iden-code-btn").on("tap", function() {
            var arrow = $(this).find(".mui-icon");
            $(this).find(".mui-icon").toggleClass("mui-icon-arrowdown");
            $(".iden-code-disc").toggle();
        });
        $(".add-address-switch .mui-switch").on("tap", function() {
            $(this).toggleClass("mui-active");
        });

    };
    addAddressSwitch();
    // 保存收货地址
    var confirmAddress = function() {
        var idenfyReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        var phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var _c, _i, _p, _a, _t;
      
        $(".confirm-address").on("tap", function() {

            var addArea = $(".add-address-sel").text().split(" "),
                accept_name = $(".add-address-consignee").val(),
                mobile = $(".add-address-phone").val(),
                zip = $(".add-address-code").val(),
                addr = $(".add-address-textarea").val(),
                province = $(".add-address-sel").attr("province-id"),
                city = $(".add-address-sel").attr("city-id"),
                county = $(".add-address-sel").attr("county-id"),
                is_default = $(".mui-switch").hasClass("mui-active") ? 1 : 0,
                id_no = $(".add-address-identify").val(),
                sfzzm = $(".sfzzm").val(),
                sfzfm = $(".sfzfm").val();
            if (accept_name === "") {
                mui.toast("请输入收货人姓名！");
                return false;
            } else {
                _c = true;
            }

            if (phoneReg.test(mobile) === false) {
                mui.toast('请输入有效的手机号码！');
                return false;
            } else {
                _p = true;
            }
            if (province == '' || city == '' || county == '') {
                mui.toast('请选择地址!');
                return false;
            } else {
                _a = true;
            }
            if (addr == '') {
                mui.toast('请输入详细地址!');
                return false;
            } else {
                _t = true;
            }
            if (mall_type == 'oversea') {
                if (idenfyReg.test(id_no) === false) {
                    mui.toast("身份证输入不合法！");
                } else {
                    _i = true;
                }
                if (!_c || !_i || !_p || !_a || !_t || accept_name == '' || mobile == '' || addr == '' || province == '' || city == '' || county == '' || id_no == "") {
                    // mui.alert("请填写完整信息!");
                    return false;
                }
            } else {
                if (!_c  || !_p || !_a || !_t || accept_name == '' || mobile == '' || addr == '' || province == '' || city == '' || county == '') {
                    // mui.alert("请填写完整信息!");
                    return false;
                }
            }
            $(".confirm-address").off("tap");
            $.ajax({
                type: "post",
                url: ADD_NEW_ADDRESS,
                data: {
                    accept_name: accept_name, //联系人
                    mobile: mobile, //联系方式(手机)
                    province: province, //省份
                    city: city, //市级
                    county: county, //区/县
                    zip: zip, //邮编
                    addr: addr, //详细地址
                    is_default: is_default, //是否默认(0.否 1.是),
                    id_no: id_no,
                    sfzzm: sfzzm,
                    sfzfm: sfzfm
                },
                dataType: "json",
                success: function(data) {
                    if (data.state == 'success') {
                        window.history.back();
                        $(".confirm-address").off("tap");
                    } else {
                        mui.alert(data.msg);
                    }
                },
                error: function(xhr, type) {
                    mui.alert("请求失败，请稍后再试！");
                }
            });

        });
    };
    $(".camera-area").fileUpload({
        "url": UPLOAD_IMAGE,
        "file": "file"
    });
    $(".details").on("tap", function() {
        var arrow = $(this).find(".i-arrow");
        $(".iden-code-disc").toggle();
        console.log(arrow);
        if (arrow.hasClass("mui-icon-arrowdown")) {
            arrow.removeClass("mui-icon-arrowdown").addClass("mui-icon-arrowup");
        } else {
            arrow.removeClass("mui-icon-arrowup").addClass("mui-icon-arrowdown");
        }

    });

    addAddressSwitch();
    confirmAddress();
    mui.citydata();
});
