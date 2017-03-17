(function(){
	mui.init();
	mui.ready(function(){
		var sesval = JSON.parse(sessionStorage.goods_list || '{}');
		var params = {};
		var run = true;
		//初始化页面参数
		params.cur_page = 0;
		params.keyword = $('#keyword').val() || getQueryString('keyword') || '';
		params.sort = 0;
		params.price = '';
		params.brand = [];
		params.cid = getQueryString('cid');
		if(sesval.params && sesval.params.cid != getQueryString('cid') && sesval.params.keyword != decodeURI(getQueryString('keyword'))){
			sessionStorage.removeItem("goods_list");
			params.cid = getQueryString('cid') || '';
			params.keyword = decodeURI(getQueryString('keyword')) ? decodeURI(getQueryString('keyword')) : '';
			sesval.params = params;
			sesval.goods = [];
			sessionStorage.goods_list = JSON.stringify(sesval);
		}else if(sesval.params && (sesval.params.cid == getQueryString('cid') || sesval.params.keyword == decodeURI(getQueryString('keyword')))){
			params = sesval.params;
		}else{
			sesval.params = params;
			sesval.goods = [];
			sessionStorage.goods_list = JSON.stringify(sesval);
		}
		$('#keyword').val(params.keyword);
	
		//初始化分页
		var cur_page = 0;
		//懒加载定义
		var lazyLoad = mui('#offCanvasContentScroll .mui-scroll').imageLazyload({
			placeholder: '../../img/pj.jpg',
			autoDestroy: false
		});
		//侧滑容器父节点
		var offCanvasWrapper = mui('#offCanvasWrapper');
		//主界面容器
		var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
		//菜单容器
		var offCanvasSide = document.getElementById("offCanvasSide");

		//侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
		var classList = offCanvasWrapper[0].classList;
		//变换侧滑动画移动效果；
		classList.add('mui-slide-in');

		document.getElementById('offCanvasHide').addEventListener('tap', function() {
			offCanvasWrapper.offCanvas('close');
		});
		
		//全局a标签功能
		$('#load_goods_list').delegate('a', 'tap', function() {
			window.location.href = $(this).attr('href');
		});
		
		//侧滑菜单界面支持区域滚动；
		mui('#offCanvasSideScroll').scroll();
		
		//加载工具栏功能
		mui('.goodslist-nav-bar').on('tap', 'a', function(){
			if(!$(this).attr('id')){
	            $('.goodslist-nav-bar').children('.active').removeClass('active');//清理active
	            $(this).addClass('active');
				$(this).siblings().children('.arrow-active').removeClass('arrow-active');
				
				if($(this).hasClass('goodslist-price')){
	            		$(this).children('.arrow').toggleClass('arrow-active');
	            }
	            
	            if($(this).children('span').hasClass('arrow-active')){
	            		params.sort = Number($(this).data('sort'));
	            }else if($(this).children('span').hasClass('pla')){
	            		params.sort = Number($(this).data('sort'));
	            }else{
	            		params.sort = Number($(this).data('sort')) + 1;
	            }
				
				params.cur_page = 0;
				sesval.params = params;
				sesval.goods = [];
				sessionStorage.goods_list = JSON.stringify(sesval);
				$('#load_goods_list').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}
		});
		
		//侧边栏完成按钮
        $(".aside-sure-btn").on("tap", function() {
			//关闭侧边栏
            mui("#offCanvasWrapper").offCanvas('close');
            
            sesval.params = params;
            sessionStorage.goods_list = JSON.stringify(sesval);
            $('#load_goods_list').children().remove();
			mui('#offCanvasContentScroll').pullRefresh().refresh(true);
			mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
        });
		
		//侧边栏点击事件
		$('.aside-cell-item').on('tap', function(){
			var id = $(this).attr('id');
			var a = $('.aside-page.'+id).show();
		});
		
		//弹框左上按钮点击隐藏
        $(".aside-left-icon").on('tap', function() {
            $('.aside-page').hide();
        });
        
        //确认筛选项
        $('.aside-page .mui-btn-link').on("tap", function() {
        		var id = $(this).attr('id');
        		if(id == 'price-group'){
        			var _price = $('.'+id).children('.mui-selected').children('.mui-navigate-right');
        			if(_price.length){
        				var flag = true;
	        			$.each(String(_price.data('info')).split('-'), function(k, v){
						if(isNaN(v)){
							flag = false;
							$('.mui-content .aside-right.'+id).html('不限');
        						params.price = '';
							return false;
						}
	        			});
	        			if(flag){
	        				$('.mui-content .aside-right.'+id).html(_price.html());
        					params.price = _price.data('info');
	        			}
        			}else{
        				$('.mui-content .aside-right.'+id).html("不限");
        				params.price = '';
        			}
        			
        		}else if(id == 'brand-group'){
        			var brand = [],
        				brand_id = [],
        				flag = true;
        			params.brand = [];
        			var checkboxs = $('.'+id).find("input[type='checkbox']:checked");
        			if(checkboxs.length){
	        			$.each(checkboxs, function(k, v){
	        				if(isNaN(v)){
		        				brand.push($(this).siblings('label').html());
		        				brand_id.push($(this).data('id'));
	        				}else{
	        					$('.mui-content .aside-right.'+id).html('不限');
	        					params.brand = [];
	        					flag = false;
	        					return false;
	        				}
	        			});
	        			if(flag){
	        				$('.mui-content .aside-right.'+id).html(brand.join(","));
	        				params.brand = brand_id;
	        			}
        			}else{
        				$('.mui-content .aside-right.'+id).html('不限');
        			}
        		}else{
        			mui.alert("非法操作，请刷新页面！");
        		}
            $('.aside-page').hide();
        });
        
        //清空筛选
        $('.aside-clear-btn').on('tap', function(){
        		params.brand = [];
        		params.price = '';
        		$('.mui-content .aside-right.brand-group').html('不限');
        		$('.mui-content .aside-right.price-group').html('不限');
        });
        
        //搜索键盘
        $('#seach').submit(function(){
        		var keyword =$('.search-input').val();
            if(keyword){
				params.keyword = keyword;
				
				sesval.params = params;
				sessionStorage.goods_list = JSON.stringify(sesval);
				$('#load_goods_list').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}else{
				params.keyword = '';
				
				sesval.params = params;
				sessionStorage.goods_list = JSON.stringify(sesval);
				$('#load_goods_list').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}
        });
        
		// 搜索按钮
        $('.t-sosuo').on("tap", function() {
            var keyword =$('.search-input').val();
            if(keyword){
				params.keyword = keyword;
				
				sesval.params = params;
				sessionStorage.goods_list = JSON.stringify(sesval);
				$('#load_goods_list').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}else{
				params.keyword = '';
				
				sesval.params = params;
				sessionStorage.goods_list = JSON.stringify(sesval);
				$('#load_goods_list').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}
        });
		
		//初始化上拉加载数据
		var scroll = mui('#offCanvasContentScroll').pullRefresh({
			container: '#offCanvasContentScroll',
			up : {
				auto : true,
				contentrefresh : "正在加载...",
				contentnomore : '更多精品敬请期待...',
				callback : uploadfun
			}
		});
		
		function uploadfun(){
			var _this = this;
			if(sesval.goods.length && run){
				run = false;
				setTimeout(function(){
					var table_view = document.body.querySelector('#load_goods_list'),
	                    li,
	                    fragment = document.createDocumentFragment();
					$.each(sesval.goods, function(k, v) {
						li = document.createElement('li');
						li.className = 'mui-table-view-cell mui-col-xs-6 goods-item';
						var _html = '';
						_html += '<a href="./test.html">';  //'<a data-url="' + GOODLIST_DETAIL + '&goods_id=' + item.id + '">';
						_html += '<div class="goods-top"><span class="goods-img-box"><img data-lazyload="' + v.img + '"></span></div>';
						_html += '<div class="goods-bottom"><p class="goods-goodsname">' + v.name + '</p>';
						_html += '<p style="height:18px">';
						v.tags.forEach(function(tag) {
							_html += '<span class="goods-post">' + tag + '</span>';
						});
						_html += '<p class="goods-price"><span class="goods-price-num"><i class="iconfont icon-zmb01"></i>' + v.sell_price + '</span></p>';
						_html += '</div></a>';
						li.innerHTML = _html;
						fragment.appendChild(li);
					});
					table_view.appendChild(fragment);
					lazyLoad.refresh(true);
					_this.endPullupToRefresh(false);
				}, 1000);
				_this.scrollTo(0,sesval.ypos,0);
			}else{
				run = false;
				setTimeout(function(){
					//TODO 服务器请求
	//				var _data = ajax({url:'/xxx/xxx/xxx/xxx'});
					var data = {
							info : [
								{
									img : '../../img/jrbd1.png',
									name : '示例商品示例商品示例商品示例商品示例商品示例商品示例商品',
									tags : [
										'包邮', '测试'
									],
									sell_price : '666.66'
								},
							]
		                };
					if(data.info.length){
						var table_view = document.body.querySelector('#load_goods_list'),
		                    li,
		                    fragment = document.createDocumentFragment();
						
						$.each(data.info, function(k, v) {
							for(var i = 0; i<10; i++){
								li = document.createElement('li');
								li.className = 'mui-table-view-cell mui-col-xs-6 goods-item';
								var _html = '';
								_html += '<a href="./test.html">';  //'<a data-url="' + GOODLIST_DETAIL + '&goods_id=' + item.id + '">';
								_html += '<div class="goods-top"><span class="goods-img-box"><img data-lazyload="' + v.img + '"></span></div>';
								_html += '<div class="goods-bottom"><p class="goods-goodsname">' + v.name + '</p>';
								_html += '<p style="height:18px">';
								v.tags.forEach(function(tag) {
									_html += '<span class="goods-post">' + tag + '</span>';
								});
								_html += '<p class="goods-price"><span class="goods-price-num"><i class="iconfont icon-zmb01"></i>' + v.sell_price + '</span></p>';
								_html += '</div></a>';
								li.innerHTML = _html;
								fragment.appendChild(li);
								sesval.goods.push(v);
							}
						});
						sessionStorage.goods_list = JSON.stringify(sesval);
						table_view.appendChild(fragment);
						lazyLoad.refresh(true);
						_this.endPullupToRefresh(false);
					}else{
						_this.endPullupToRefresh(true);
					}
				}, 1000);
			}
		}
		$('.mui-scroll-wrapper').on('scroll', function(e) {
			sesval.ypos = e.detail.y;
			sessionStorage.goods_list = JSON.stringify(sesval);
		});
		
		
		function othe_info(){
			//TODO 服务器请求
			var othe_info = {
				price:['0-300','400-800','900-1200','1300以上'],
				brand:[{id:1,name:'测试1'},{id:2,name:'测试2'},{id:3,name:'测试3'},{id:4,name:'测试4'}]
			};
			var price_view = document.body.querySelector('.mui-table-view.price-group'),
				brand_view = document.body.querySelector('.goodslist-brand-group'),
				li,
				div,
				_html,
				price_fragment = document.createDocumentFragment(),
				brand_fragment = document.createDocumentFragment();
			$.each(othe_info.price, function(k, v) {
				li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				_html = '<a class="mui-navigate-right" data-info="'+v+'">'+v+'</a>';
				li.innerHTML = _html;
				price_fragment.appendChild(li);
			});
			$.each(othe_info.brand, function(k, v){
				div = document.createElement('div');
				div.className = 'mui-input-row mui-checkbox aside-checkbox';
				_html = '<label>'+v.name+'</label>';
				_html += '<input name="checkbox1" data-id="'+v.id+'" type="checkbox" class="mui-pull-right aside-input">';
				div.innerHTML = _html;
				brand_fragment.appendChild(div);
			});
			price_view.appendChild(price_fragment);
			brand_view.appendChild(brand_fragment);
		}
		othe_info();
	});
})();