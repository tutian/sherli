   (function($) {
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

    
       // 选择提现账户
       mui.selectAccount = function() {
           mui.ready(function() {
               mui.get(WITHDRAWALS_APPLY, {},
                   function(data) {

                       var selectAccountPicker = new $.PopPicker(),
                           i, setDataArr = [];
                       for (i = 0; i < data.length; i += 1) {
                           var item = data[i];
                           setDataArr.push({ value: item.id, text: item.user_name });
                       }
                       selectAccountPicker.setData(setDataArr);
                       var showSelectAccountPickerButton = document.getElementById('showAccountPicker');
                       showSelectAccountPickerButton.addEventListener('tap', function(event) {
                           if (data.length === 0) {
                               mui.alert("暂无可选账户，请先新建账户");
                           } else {
                               selectAccountPicker.show(function(items) {
                                   var _text = (items[0] || {}).text;
                                   if (_text !== undefined) {
                                       showSelectAccountPickerButton.innerText = (items[0] || {}).text;
                                       showSelectAccountPickerButton.setAttribute("account-id", (items[0] || {}).value);
                                   }

                               });
                           }

                       }, false);
                   }, 'json');
           });

       };

       mui.addAccountType = function() {
           mui.ready(function() {

               var selectAccountPicker = new $.PopPicker(),
                   i, setDataArr = [];

               selectAccountPicker.setData([{
                   "value": '1',
                   "text": '支付宝'
               }, {
                   "value": '2',
                   "text": '微信'
               }, {
                   "value": '3',
                   "text": '银行卡'
               }]);
               var showAccountTypePickerButton = document.getElementById('showAccountType');
               var showAccountResult = document.getElementById('showAccountResult');
               showAccountTypePickerButton.addEventListener('tap', function(event) {
                   selectAccountPicker.show(function(items) {
                       showAccountResult.innerText = (items[0] || {}).text;
                       showAccountResult.setAttribute("account-type", (items[0] || {}).value);
                   });
               }, false);

           });
       };
   })(mui);



   $(function() {
       $.ajax({
           type: "get",
           url: GET_USER_MONEY,
           data: {},
           dataType: "json",
           success: function(data) {
               mui.selectAccount();
               tixianCode(data);
               tixianNotes(data);
               tixianManage(data);
               tixianConfirm(data);
               mui(".tixian-scroll-wrapper").scroll(mui.scrollOption);
               mui(".jilu-scroll-wrapper").scroll(mui.scrollOption);
               mui(".zhgl-scroll-wrapper").scroll(mui.scrollOption);
           },
           error: function(xhr, type) {
               mui.alert("添加失败,请稍后再试！");
           }
       });

       var tixianCode = function(tixianData) {
           // 显示提现金额
           var tixianCash = document.querySelector(".tixian-cash");
           tixianCash.innerHTML = "¥" + tixianData.balance;
           // 提现获取短信验证码
           $(".tixian-code").on("tap", function() {
               $.ajax({
                   type: "post",
                   url: GET_SMS,
                   data: {},
                   dataType: "json",
                   success: function(data) {
                       if (data.state == 'success') {
                        var timewait=120;
                        if(data.time!=undefined){
                          timewait = data.time;
                        }   
                        var timewaitbtn=$("#tixian_coderight .tixian-code");
                        timewaitfun(timewaitbtn,timewait); 
                        countTime();                                                     
                        mui.alert(data.msg);
                          
                       } else {
                           mui.alert(data.msg);
                       }
                   },
                   error: function(xhr, type) {
                       mui.alert("获取失败，请稍后再试！");
                   }
               });
           });
       };

       var  timewaitfun = function(e,timewait){
           e.attr("disabled",true);   
           // $('.mui-popup-text').text('您已获取验证码,请'+timewait+'秒后重试!');
           e.text("重新发送"+timewait);
           setTimeout(function(){
                if(timewait==0){
                  e.removeAttr("disabled");
                  $('.mui-popup-text').text('点击获取验证码重试!');
                  e.text("获取验证码");
                  return false;
                }else{
                  timewaitfun(e,timewait);
                }
           },1000);    
           timewait--;                 
             
        }

       // 提交提现
       var tixianConfirm = function(data) {
           $(".tixian-confirm-btn").on("tap", function() {
               
               var withdrawalsId = $("#showAccountPicker").attr("account-id"),
                   amountNum = $(".tixian-take").val(),
                   tixianCode = $(".tixian-code-num").val(),
                   phoneNum = $(".tixian-phone").val();                     
                 var  parents_toast1=$(".parents_toast1").text(), 
                      parents_toast2=$(".parents_toast2").text(), 
                      parents_toast3=$(".parents_toast3").text(), 
                      proving_money1=$(".proving_money1").attr("account-id"),
                      proving_money2=$(".proving_money2").val(),
                      proving_money3=$(".proving_money3").val();
                   if(proving_money1==""){                     
                     mui.toast("请"+parents_toast1);
                     return false;
                   }else if(proving_money2==""){
                      mui.toast("请输入"+parents_toast2);
                     return false;
                   }
                   else if(proving_money3==""){
                      mui.toast("请输入"+parents_toast3);
                     return false;
                   }else if(parseFloat(proving_money2)>parseFloat(data.balance)){
                      mui.toast('提现金额超出可提现金额');
                      return false;
                   }else{ 
                    linktixian();
                  }
          
                 function linktixian(){ 
                  $.ajax({
                       type: "post",
                       url: WITHDRAWALS_USER,
                       data: {
                           withdrawals_id: withdrawalsId, //账户ID
                           amount: amountNum, //提款金额
                           // sms_id: data.id, //验证码ID
                           sms_code: tixianCode //验证码,
                           // phone: phoneNum //手机号码
                       },
                       dataType: "json",
                       success: function(data) {
                           if (data.state === "success") {
                               mui.toast("提交申请成功");
                               
                           } else if(data.state === "check"){
                              mui.alert("您有未处理的提现申请，请耐心等待审核完成再提交申请");
                           }
                       },
                       error: function(xhr, type) {
                           mui.alert("添加失败,请稍后再试！");
                       }
                  });
                }
               

           });
       };
       // 提现记录
       var tixianNotes = function() {
           $(".tixian-notes").on("tap", function() {
               $.ajax({
                   type: "get",
                   url: RECORD,
                   data: {},
                   dataType: "json",
                   success: function(data) {
                       tixianNotesCreateDom(data);
                   },
                   error: function(xhr, type) {
                       mui.alert("添加失败,请稍后再试！");
                   }
               });
           });
           var tixianNotesCreateDom = function(data) {
               if (data && data.length !== 0) {
                   $(".tixian-manage-nohistory").hide();
                   $(".tixian-notes-main").show();
                   var tixianNotesHtml = "",
                       i;
                   for (i = 0; i < data.length; i += 1) {
                       var item = data[i],
                           statusResult;
                       switch (item.status) {
                           case "0":
                               statusResult = '审核中';
                               break;
                           case "1":
                               statusResult = '已审核';
                               break;
                           case "2":
                               statusResult = '失败';
                               break;

                       }

                       tixianNotesHtml += '<li><div class="mui-input-row c-666"><label class="c-333">申请时间:</label><i>' + item.time + '</i></div><div class="mui-input-row c-666"><label class="c-333">提现账户:</label><i>' + item.type_name + '(' + item.name + item.account + ')</i></div><div class="mui-input-row c-666"><label class="c-333">提现金额:</label><i>¥' + item.amount + '</i></div><div class="mui-input-row c-666"><label class="c-333">处理结果:</label><i>' + statusResult + '</i></div><div class="mui-input-row c-666"><label class="c-333">处理时间:</label><i>' + item.time + '</i></div></li>';
                   }
                   $(".tixian-notes-main").html(tixianNotesHtml);
               } else {
                   $(".tixian-manage-nohistory").show();
                   $(".tixian-notes-main").hide();
               }
           };
       };
       // 账户管理
       var tixianManage = function() {
           $(".tixian-manage").on("tap", function() {
               $.ajax({
                   url: ACCOUNT_MANAGE,
                   type: "get",
                   dataType: "json",
                   success: function(data) {
                       tixianManageCreateDom(data);
                   },
                   error: function(xhr, type) {
                       mui.alert("添加失败,请稍后再试！");
                   }
               });
           });
           var tixianManageCreateDom = function(data) {
               if (data && data.length !== 0) {
                   $(".tixian-manage-nohistory").hide();
                   var tixianManageHtml = "",
                       i;
                   for (i = 0; i < data.length; i += 1) {
                       var item = data[i],
                           accountType, iconType;
                       switch (item.account_type) {
                           case "1":
                               accountType = '支付宝';
                               iconType = "zhifubao";
                               break;
                           case "2":
                               accountType = '微信';
                               iconType = "weixin";
                               break;
                           case "3":
                               accountType = '银行卡';
                               iconType="yhk";
                               break;
                       }
                       tixianManageHtml += '<li class="mui-table-view-cell"><a href="/index.php?con=index&act=add_bank_account'+_mall_type+'&id='+item.id+'" class="mui-navigate-right"><i class="m-pay-img iconfont ' + iconType + ' icon-' + iconType + '"></i><div class="m-details"><div class="m-one c-333"><span>' + accountType + '</span><i>' + item.user_name + '</i></div><div class="m-two c-666"><span>账户:</span><i>' + item.account + '</i></div></div></a></li>';
                   }
                   $(".tixian-manage-main").html(tixianManageHtml);
               } else {
                   $(".tixian-manage-nohistory").show();
               }

           };
       };

      
   });
$(function(){
   $(".proving_money2").bind('keyup',function () {
     var reg = $(this).val().match(/\d+\.?\d{0,2}/);
      var txt = '';
      if (reg != null) {
          txt = reg[0];
      }
      $(this).val(txt);
    }).bind('change',function () {
      $(this).keypress();
    var v = $(this).val();
    if (/\.$/.test(v))
    {
         $(this).val(v.substr(0, v.length - 1));
     }
  });
});
