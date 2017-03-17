$(function(){
	 // 验证手机号码

     $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=get_mobile",
        data: {},
        dataType: "json",
        success: function(data) {
        	$(".default-phone").text(data.mobile);
           changePhoe();

        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    // 手机
    var changePhoe = function() {
        // 验证手机号码
        var phoneNum;
        $(".account-next-btn").on("tap", function() {
            var smsCode = $(".account-code").val(),
                _sms_id = $(".account-get-code").attr("data-id");
            // phoneNum = $(".default-phone").text();
            console.log(smsCode);
            $.ajax({
                type: "get",
                url: mui.apiUrl + "index.php?con=ajax&act=check_mobile",
                data: {
                    sms_id: _sms_id, //短信ID
                    sms_code: smsCode //验证码
                },
                dataType: "json",
                success: function(data) {
                    if (data.state === "error") {
                        mui.toast("验证码输入有误！");
                    } else {
                        mui.hashChangeEvent("change-phone", mui.changePhoneRouter);
                    }
                },
                error: function() {
                    console.log("error");
                }
            });


        });

        // // 获取验证码
        $(".account-get-code").on("tap", function() {
            phoneNum = $(".default-phone").text();
            if (phoneNum !== "") {
                $.ajax({
                    type: "get",
                    url: mui.apiUrl + "index.php?con=ajax&act=get_sms",
                    data: {
                        phone: phoneNum
                    },
                    dataType: "json",
                    success: function(data) {

                        $(".account-get-code").attr("data-id", data.id);
                    },
                    error: function() {
                        $(".text-get-code").html("发送失败，请再试一次");
                    }
                });
            }
        });
    };
});