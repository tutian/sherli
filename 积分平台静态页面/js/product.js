(function(){
	mui.init();
	mui.ready(function(){
		//当前选中商品
		var cur_product;
		//初始化滚动
		var deceleration = mui.os.ios ? 0.001 : 0.0005;
	    mui('.goodsinfo-scroll-wrapper').scroll({
	        bounce: true,
	        indicators: false, //是否显示滚动条
	        deceleration: deceleration
	    });
	    
	    //图文详情
	    $(".mui-control-item").on("tap", function() {
	        $(this).find("span").addClass("active").parent().siblings(".mui-control-item").find("span").removeClass("active");
	    });
	    
	    //规格点击事件
	    $('.goods-size-list').on('tap', function(){
	    	cur_product = '';
	    		if($(this).hasClass('no-stock')){
	    			return false;
	    		}
	    		var flage = $(this).hasClass('size-active');
	    		$(this).parent().children('.goods-size-list').removeClass('size-active');
	    		if(!flage){
		    		$(this).addClass('size-active');
	    		}
	    		changeStatus();
	    		if($('.goods-size-disc').length == $('.goods-size-disc .size-active').length){
	    			var sku = [];
	    			$(".goods-size-disc .size-active").each(function(i){
                    sku[i]= $(this).data("value");
                })
	    			var sku_key = ";"+sku.join(";")+";";
	    			var sku = skuMap[sku_key];
	    			if(sku){
	    				cur_product = sku;
	    				$('.goodsinfo-sell-price').html('￥'+sku.sell_price);
	    				$('.goodsinf-market-num').html('￥'+sku.market_price);
	    				$('.goods-price').html('￥'+sku.sell_price);
	    				$('#store_nums').html(sku.store_nums);
	    				mui('#numbox').numbox().setOption('max',sku.store_nums);
	    				var cur_num = mui('#numbox').numbox().getValue();
	    				if(cur_num > sku.store_nums)
	    					mui('#numbox').numbox().setValue(sku.store_nums);
	    				else if(cur_num < 1)
	    					mui('#numbox').numbox().setValue(1);
	    			}
	    		}
	    });
	    
	    var changeStatus = function(){
	    		var specs_array = new Array();
	        $(".goods-size-disc").each(function(i){
	            var selected = $(this).find(".size-active");
	            if(selected.length>0)specs_array[i]=selected.attr("data-value");
	            else specs_array[i] = "\\\d+:\\\d+";
	        });
	       $(".goods-size-disc").each(function(i){
	            var selected = $(this).find(".size-active");
	            $(this).find("span").removeClass("no-stock");
	            var k = i;
	            $(this).find("span").each(function(){
	                var temp = specs_array.slice();
	                temp[k] = $(this).attr('data-value');
	                var flage = false;
	                for(sku in skuMap){
	                    var reg = new RegExp(';'+temp.join(";")+';');
	                    if(reg.test(sku) && skuMap[sku]['store_nums']>0) flage = true;
	                }
	                if(!flage)$(this).addClass("no-stock");
	            })
	
	        });
	    }
	    //加入购物车
	    $(".goodsinfo-add-cart").on("tap",function(){
	        if(cur_product){
	            var id = cur_product["id"];
	            var num = parseInt($("#goodsinfoInputNumbox").val());
	            var max = parseInt($("#store_nums").html());
	            if(max<=0){
	                mui.alert('库存不足,请选择其他商品!');
	                return false;
	            }
				var data = ajax({url:'xxxx.xxxx.xxxx'});
				if(data){
					mui.toast(data.msg);
				}
	        }else{
	        		mui.alert('请选择您要购买的商品规格!');
	        }
	    });
	    
	    //立即购买
		$(".order-sure-original active").on("tap",function(){
		    if (cur_product) {
		        var id = cur_product["id"];
		        var num = parseInt($("#goodsinfoInputNumbox").val());
		        var max = parseInt($("#store_nums").text());
		        if (num > max) {
		            mui.alert('购买商品数量，超出了库存的最大量！');
		            return false;
		        } else if (max <= 0) {
		            mui.alert("库存不足！");
		            return false;
		        }
		        var url = "{url:/index/goods_add/id/__id__/num/__num__}";
		        url = url.replace("__id__",id);
		        url = url.replace("__num__",num);
		        window.location.href = url;
		    } else {
		        $('#spec-msg').css('display', '');
		        showMsgBar('alert', '请选择您要购买的商品规格！');
		    }
		});
	    
	    //收藏
	    $(".goodinfo-shoucan").on("tap", function() {
            $(this).find(".goodsinfo-collect-icon").toggleClass("icon-shoucang").toggleClass("icon-icon47");
            if ($(this).find(".goodsinfo-collect-icon").hasClass("icon-shoucang")) {
                $(this).find(".goodsinfo-collect-icon").siblings(".goodsinfo-collect-disc").text("收藏").addClass('f-666').removeClass('f-basecolor');
            } else {
                $(this).find(".goodsinfo-collect-icon").siblings(".goodsinfo-collect-disc").text("已收藏").addClass('f-basecolor').removeClass('f-666');
            }
			//TODO收藏请求
			var data = ajax({url:'xxx.xxx.xxx',data:{'goods_id':goods_id}});
			if(data){
				mui.alert(data.msg);
			}
        });
        
        //显示商品规格
		$(".goodsinfo-select").on("tap", function() {
            $(".goodsinfo-cart-mask").show();
        });
	});
})();