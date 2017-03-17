(function(){
	mui.init();
	mui.ready(function(){
		mui(".address-wrapper-scroll").scroll(mui.scrollOption);
		//删除收货地址
		$('.mui-icon-trash').on('tap', function(){
			var address_id = $(this).parent().parent().data('id');
			mui.confirm('确认删除该收货地址？',function(e){
				if(e.index == 1){
					//TODO AJAX删除收货地址
					console.log('确认删除'+address_id);
				}
			});
		});
		
		//设为默认地址
		$('.set-default-address').on('tap', function(){
			var checked = '';
			$('.set-default-address').each(function(k, v){
				if($(v).children('.iconfont').hasClass('icon-queren')){
					checked = $(v);
					$(v).children('.iconfont').replaceWith("<span class='iconfont mui-pull-left icon-kongxinyuan'></span>");
				}
			});
			$(this).children('.iconfont').replaceWith("<span class='iconfont mui-pull-left icon-queren dui'></span>");
			
			//TODO AJAX请求设为默认 如果失败则 checked 恢复选中状态
		});
		
		//选择收货地址
		$('.choose_address').on('tap', function(){
			//TODO 跳转至编辑页面
		});
	});
})();