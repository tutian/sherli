
$(function() {
    var accound_id = GetQueryString('id') || null;

    mui.addAccountType();
    $.ajax({
        type: "get",
        url: GET_USER_INFO,
        data: {},
        dataType: "json",
        success: function(data) {
            $(".add-bank-phone").val(data.mobile);
        },
        error: function() {
            console.log("error");
        }
    });

    //如果存在ID则为取账户详细
    if(accound_id){
        $.ajax({
            type: "get",
            url: '/index.php?con=ajax&act=get_bank_account_info',
            data: {id:accound_id},
            dataType: "json",
            success: function(data) {
                $('.add-bank-people').val(data.user_name);
                $('#showAccountResult').attr("account-type",data.account_type);
                var dd=$(".mui-pciker-list li").eq(data.account_type-1).text();
                $('#showAccountResult').text(dd);
                $('.add-bank-account').val(data.account);
                var account_id_input = $('<input type="hidden" name="id" class="account_id" value="'+data.id+'" />');
                $('.account_form').append(account_id_input);
                $(".title_change").text("编辑用户");
                $(".footer_btn_change").text("保存");
            },
            error: function() {
                mui.alert(data.msg);
            }
        });
    }


    // 获取验证码
    var addBankGetCode = function() {
        $(".add-bank-code").on("tap", function() {
            var getCodePhone = $(".add-bank-phone").val();
            confirmMoble();
        });
    };
    //popMask();
    addBankGetCode();
    var addBankAccount = function(data) {
        $(".add-bank-btn").on("tap", function() {
            var accountName = $(".add-bank-people").val(),
                accountNum = $(".add-bank-account").val(),
                accoutType = $("#showAccountResult").attr("account-type"),
                accountPhone = $(".add-bank-phone").val(),
                accountCode = $(".add-bank-code-num").val();
             if(accountName==""){
                mui.toast("请输入开户人");
                return false;
             }else if(accoutType==""||typeof(accoutType)=="undefined"){
                mui.toast("请选择账号类型");
                return false;
             }else if(accountNum==""){
                mui.toast("请输入账号");
                return false;
             }else if(accountCode==""){
                mui.toast("请输入验证码");
                return false;
             }
            if (accountName !== "" && accountNum !== "") {
                $.ajax({
                    type: "post",
                    url: WITHDRAWALS,
                    data: {
                        id:$('.account_id').val(),
                        user_name: accountName, //开户人
                        account_type: accoutType, //账户类型(1-支付宝,2-微信,3-银行卡)
                        account: accountNum, //账户
                        sms_code: accountCode //短信效验
                    },
                    dataType: "json",
                    success: function(data) {
                        if(data.state == 'success'){
                            mui.alert(data.msg,function(){
                                window.location.href = WALLET_TIXIAN;
                            });

                            return false;
                        }else{
                            mui.alert(data.msg);
                            return false;
                        }
                    },
                    error: function() {
                        mui.alert("添加失败,请稍后再试！");
                    }
                });
            }

        });

    };
    addBankAccount();

    var removeFocus = function(){
        $('.add-bank-type').bind('tap',function(e){
            var isFocus1 = $(".add-bank-people").is(":focus");
            if(true==isFocus1){ 
                $('.add-bank-people').trigger('blur');
                e.stopPropagation();
                e.preventDefault();
            }

            var isFocus2 = $(".add-bank-account").is(':focus');
            if(true==isFocus2){ 
                $('.add-bank-account').trigger('blur');
                e.stopPropagation();
                e.preventDefault();
            }
            
        });  
    }

    removeFocus();

});