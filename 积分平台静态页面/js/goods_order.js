 $(function() {
     mui(".order-sure-wrapper").scroll(mui.scrollOption);
     
     //添加收货地址
     $('.m-mod1').on('tap', function(){
     	console.log("m-mod1");
     });
     
     //选择收货地址
     $('.m-mod2').on('tap', function(){
     	console.log('m-mod2');
     });
     
     //订单提交
     $('#confirm').on('tap', function(){
     	var _this = this;
     	var address_id = $('#address_id').val();
     	var goods = $('#goods').val();
		
		if(address_id){
			$(this).addClass("mui-disabled").css('opacity','0.7').html("提交中...");
			$.ajax({
				type:"post",
				url:"xxx.xxx.xxx",
				async:true,
				data:{address_id: address_id, goods: goods},
				success: function(data){
					if(data.result){
						//TODO 跳转支付页
					}else{
						mui.alert(data.msg);
						$(_this).removeClass("mui-disabled").css('opacity','1').html("提交订单");
					}
				},
				error: function(data){
					mui.toast("服务器忙，请稍后再试!");
					$(_this).removeClass("mui-disabled").css('opacity','1').html("提交订单");
				}
			});
		}else{
			mui.toast("请先填写收货地址!");
		}
     });
 });
