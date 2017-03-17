(function(){
	mui.init();
	mui.ready(function(){
		var products = [];
		//初始化滚动区域
		mui('.mui-scroll-wrapper').scroll(mui.scrollOption);
		
		//初始化减号
		$('.lib-item-center-bottom').each(function(k,v){
			var num = $(v).children('.lib-item-goods-num').html();
			if(num <= 1){
				$(v).children('.shop-lib-reduce-num').addClass('disabled');
			}
		});
		
		//增加购买数量
		$('.shop-lib-add-num').on('tap', function(){
			var id = $(this).parent().data('id');
			if(id){
				var num = Number($(this).siblings('.lib-item-goods-num').html());
				num++;
				change_goods(id, num);
				$(this).siblings('.lib-item-goods-num').html(num);
				$(this).siblings('.shop-lib-reduce-num').removeClass('disabled');
			}
			return;
		});
		
		//减少购买数量
		$('.shop-lib-reduce-num').on('tap', function(){
			var id = $(this).parent().data('id');
			if(id){
				var num = Number($(this).siblings('.lib-item-goods-num').html());
				if(num > 1){
					num--;
					change_goods(id, num);
					$(this).siblings('.lib-item-goods-num').html(num);
					$(this).siblings('.shop-lib-add-num').removeClass('disabled');
					if(num<=1){
						$(this).addClass('disabled');
					}
				}
			}
			return;
		});
		
		//增减商品数量
		var change_goods = function(id,num){
			//TODO 服务端请求
			$.ajax({
				type:"post",
				url:"xxx.xxx.xxx",
				async:true,
				data:{id:id,num:num},
				dataType: "json",
				ssuccess: function(data){
					if(!data.result){
						num--;
						mui.toast(data.msg);
						var total = Number($('#'+id).data('total')) * num;
						$('#'+id).data('total',total);
						if($('#'+id).find("input[type='checkbox']:checked")){
							price_total();
						}
					}
				},
				error:function(){
					mui.toast("服务器忙，请稍后再试!");
				}
			});
		};
		
		//计算总价
		var price_total = function(){
			var checked = $('.mui-scroll').find("input[type='checkbox']:checked");
			var total = 0;
			$.each(checked, function(k, v){
				if($(v).data('total')){
					total += Number($(v).data('total'));
				}
				products.push($(v).data('id'));
			});
			$('.select-all-num').html(checked.length);
			$('.select-all-price').html(total);
		};
		
		//勾选价格计算
		$('.shop-lib-checkbox').on('change', function(){
			price_total();
		});
		
		$('.checkall-total').on('change',function(){
			if($(this).prop('checked')){
				$('.mui-scroll').find("input[type='checkbox']").prop('checked',true);
			}else{
				$('.mui-scroll').find("input[type='checkbox']").prop('checked',false);
			}
			price_total();
		});
		
		//结算
		$('.account-btn').on('tap', function(){
			if(Number($('.select-all-num').html()) <= 0){
				mui.alert('请先选择需要结算的商品!');
			}else{
				//TODO跳转结算页面
			}
		});
		
		//删除商品
		$('.icon-shanchu').on('tap', function(){
			var _this = this;
			mui.confirm('确定删除该商品？',function(e){
				if(e.index == 1){
					console.log($(_this).data('id'));
					$(_this).parent().parent().parent().remove();
				}
				return;
			});
		});
	});
})();
