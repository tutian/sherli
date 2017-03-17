   (function() {
       //苹果端字体大小重置
       if (mui.os.ios) {
           document.querySelector("body").classList.add("ios-font-size");
       }
       //阻止touchmove事件
		document.body.addEventListener('touchmove', function(event) {
//			event.preventDefault();
			if (event.cancelable) {
				if (!event.defaultPrevented) {
					event.preventDefault();
				}
			}
		}, false);
       // 滚动
       mui.deceleration = mui.os.ios ? 0.002 : 0.0005;
       mui.scrollOption = {
           bounce: false,
           indicators: false, // 是否显示滚动条
           deceleration: mui.deceleration
       };
   })();

   // 取消订单
    var _url = window.location.href,
        _mall_type = "";
    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
   var cancelOrder = function(orderArr) {
       var timer, ele;
       clearTimeout(timer);
       $(".mask-sure-btn").on("tap", function() {
           var ordertitle = ele.parents(".order-con-item-bottom").siblings(".m-title ").find(".order-all-type");
           var orderDelBtn = ele.siblings(".del-order");
           var orderBtn = ele.siblings(".my-order-all-pay");
           orderNum = ele.attr("order-id");
           $.ajax({
               type: "get",
               url: CANCEL_ORDER,
               data: {
                   order_no: orderNum //订单号
               },
               dataType: "json",
               success: function(_data) {
                    window.location.href="/index.php?con=index&act=my_order_all"+_mall_type;

               },
               error: function() {
                   console.log("error");
               }
           });
           timer = setTimeout(function() {
               $(".order-all-mask").hide();
           }, 300);
       });


       $(".cancel-order-btn").on("tap", function() {
           ele = $(this);
           $(".order-all-mask").show();

       });


       $(".mask-cancel-btn").on("tap", function() {
           clearTimeout(timer);
           timer = setTimeout(function() {
               $(".order-all-mask").hide();
           }, 300);
       });
   };
   // 删除订单
   var delOrder = function(orderArr) {
      var ele;
       $(".del-order").on("tap", function() {
           var self = $(this);
           $(".del-order-mask").show();
           ele = self;
       });
       $(".mask-sure-btn").on("tap", function() {
           clearTimeout(timer);
           var orderId = ele.attr("order-id");
           var orderControl = $(".order-all-control .mui-active");
           var muiControlContent = ele.parents(".mui-control-content");
           $.ajax({
               type: "get",
               url: DELETE_ORDER,
               data: {
                   order_no: orderId
               },
               dataType: "json",
               success: function(data) {
                   ele.parents(".m-list").remove();
                   window.location.href = "/index.php?con=index&act=my_order_all" + _mall_type;
               },
               error: function() {
                   console.log("error");
               }
           });

           var timer = setTimeout(function() {
               $(".del-order-mask").hide();
           }, 300);
       });
       $(".mask-cancel-btn").on("tap", function() {
           $(".del-order-mask").hide();
       });
   };
   // 确认收货
   var confirmGoods = function() {
       //确认收货
       $(".confirm-goods-btn").on("tap", function() {
           $(".confirm-goods-btn").off("tap");
           var orderNo = $(this).attr("order-no");
           $.ajax({
               type: "get",
               url: CONFIRM_RECEIPT,
               data: {
                   order_no: orderNo
               },
               dataType: "json",
               success: function(data) {
                   window.location.href = CONFIRM_GOODS;
               },
               error: function() {
                   console.log("error");
               }
           });
       });

   };
   // 验证手机号码倒计时
   var countTime = function() {
       clearInterval(timer);
       $(".get-code").hide();
       $(".count-time").show();
       var totalTime = $(".count-time").html();
       var timer = setInterval(function() {
           $(".count-time").html(totalTime--);
           if (totalTime <= 0) {
               clearInterval(timer);
               $(".get-code").show();
               $(".count-time").hide();
           }
       }, 1000);

   };

   // 弹框绑定手机
   var popMask = function() {
       var popMaskHtml = "";
       popMaskHtml = '<div class="mui-backdrop myshow-del-mask share-coin-mask" style="display: block;"><div class="mask-main" ><div class="mask-title ta-c">请先绑定手机号码</div><p class="phone-num"><input type="text" name="mobile" placeholder="请输入手机号码" class="phone-input" ></p><p class="mask-main-bottom" ><input type="text" name="code" placeholder="请输入验证码" class="fl code-input" ><span class="mask-btn fr get-code phone-code bind-phone" >获取验证码</span><span class="mask-btn count-time phone-code">120</span></p><p class="confirm-phone-btn confirm-phone" >确定</p></div></div>';
       $("body").append(popMaskHtml);
       // 获取验证码
       $(".bind-phone").on("tap", function() {
           var mobile = $(".phone-input").val();
           $.ajax({
               type: "get",
               url: SEND_SMS,
               data: {
                   mobile: mobile
               },
               dataType: "json",
               success: function(data) {
                   if (data.state == 'success') {
                       mui.alert(data.msg);
                       if(data.msg!=="请勿重复获取！"){
                          // countTime();
                          // var timewait2=data.time;
                          // var  timewaitfun2 = function(){
                          //    $(".get-code").hide();
                          //    $(".count-time").show();
                          //    $(".count-time").text("重新发送"+timewait2);
                          //    setTimeout(function(){
                          //         if(timewait==0){
                          //           $(".get-code").show();
                          //           $(".count-time").hide();
                          //           return false;
                          //         }else{
                          //           timewaitfun2();
                          //         }
                          //    },1000);    
                          //    timewait--;                 
                               
                          // }
                       }
                   } else {
                       mui.alert(data.msg);
                   }
               },
               error: function() {
                   mui.alert("获取失败，请稍后再试！");
               }
           });
       });
       $(".confirm-phone-btn").on("tap", function() {
           var mobile = $(".phone-input").val();
           var code = $(".code-input").val();
           $.ajax({
               type: "get",
               url: BIND_MOBILE,
               data: {
                   mobile: mobile,
                   sms_code: code
               },
               dataType: "json",
               success: function(data) {
                   if (data.state == 'success') {
                       mui.alert(data.msg, function() {
                           window.location.reload();
                       });
                   } else {
                       mui.alert(data.msg);
                   }
               },
               error: function() {
                   mui.alert("绑定失败，请稍后再试！");
               }
           });
       });
   };

   // 验证手机号
   var confirmMoble = function() {
       $.ajax({
           type: "get",
           url: GET_SMS,
           data: {},
           dataType: "json",
           success: function(data) {
               if (data.state == 'success') {
                   mui.alert(data.msg);
                   if(data.msg!=="请勿重复获取！"){
                      // countTime();
                          var timewait2=120;
                          if(data.time!=undefined){
                            timewait2 = data.time;
                          }   
                          timewaitfun2();
                          function  timewaitfun2(){                             
                             setTimeout(function(){
                                  if(timewait2==0){
                                    $(".get-code").show();
                                    $(".count-time").hide();
                                    return false;
                                  }else{
                                    timewaitfun2();
                                    $(".get-code").hide();
                                     $(".count-time").show();
                                     $(".count-time").text("重新发送"+timewait2);
                                  }
                             },1000);    
                             timewait2--;                  
                          }
                   }
                   
               } else {
                   mui.alert(data.msg);
               }
               $(".text-get-code").attr("code-id", data.id);
           },
           error: function() {
               mui.alert("获取失败，请稍后再试");
           }
       });
   };




//获取地址栏参数
//function GetQueryString(name)
//{
//   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
//   var r = window.location.search.substr(1).match(reg);
//   if(r!=null)return  unescape(r[2]); return null;
//}

//获取url参数
function getQueryString(name) { 
	var reg = new RegExp("(^|\/)" + name + "\/([^\/]*)(\/|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

//AJAX封装
function ajax(params){
	var defaults = {
		method : 'GET',
		url : '',
		data : {},
		dataType : 'json',
		async : true,
		cache : true,
		contentType: 'application/x-www-form-urlencoded'
	};
	
	
	
	if(typeof params != 'object' || !params['url']){
		mui.alert('参数错误。');
		return '';
	}
	
	
	$.each(params, function(k, v){
		defaults[k] = v;
	});
	
	
	$.ajax({
		type : defaults['method'],
		url : defaults['url'],
		data : defaults['data'],
		dataType : defaults['dataType'],
		async : defaults['async'],
		cache : defaults['cache'],
		contentType: defaults['contentType'],
		success : function(data){
			return successCallback(data);
		},
		error : function(){
			return errorCallback();
		}
	});
}

//成功回调
function successCallback(data){
	if(data.result){
		return data.info;
	}else{
		mui.alert(data.msg);
		return '';
	}
}
//失败回调
function errorCallback(data){
	mui.toast('服务器忙，请稍后再试。');
	return false;
}