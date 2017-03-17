(function(){
	mui.init();
	mui.ready(function(){
		var keyword = '';
		var mask = mui.createLoadMask();
		//初始化上拉加载数据
		var scroll = mui('#offCanvasContentScroll').pullRefresh({
			container: '#offCanvasContentScroll',
			up : {
				auto : true,
				contentrefresh : "正在加载...",
				contentnomore : '更多精品敬请期待...',
				callback : uploadfun
			},
			scroll: {indicators: true}
		});
		
		function uploadfun(){
			var _this = this;
			setTimeout(function(){
				//TODO 服务端请求
				var data = [{
					img : '../../img/jrbd1.png',
					name : '霸王别姬',
					r_name : '张三',
					give : '999',
					b_time : '2017-01-01'
				}];
				
				var table_view = document.body.querySelector('.my-jiazu-main'),
                    li,
                    fragment = document.createDocumentFragment();
				
				$.each(data, function(k, v) {
					for(i = 0; i < 15; i++){
						li = document.createElement('li');
						li.className = 'mui-table-view-cell mui-media mui-transitioning';
						
						var _html = '';
						_html += '<div class="mui-slider-right mui-disabled">	<a class="mui-btn mui-btn-grey">备注</a><a class="mui-btn mui-btn-red">赠送</a></div>';
						_html += '<div class="mui-slider-handle mui-table">';
						_html += '<div class="i-m-img"><img src="'+v.img+'"></div>';
						_html += '<div class="mui-media-bodys list1 ovf-h">';
						_html += '<span class="m-name f-fl">'+v.name+'</span>';
						_html += '<span class="mui-ellipsis f-fr">累积赠送：';
						_html += '<i class="c-purple">'+v.give+'</i>';
						_html += '</span>';
						_html += '</div>';
						_html += '<div class="mui-media-bodys list2 ovf-h">';
						_html += '<span class="m-name f-fl">备注：<i class="beizhu">'+v.r_name+'</i></span>';
						_html += '<i class="mui-ellipsis f-fr">绑定时间：'+v.b_time+'</i>';
						_html += '</div>';
						_html += '</div>';
						li.innerHTML = _html;
						fragment.appendChild(li);
					}
				});
				table_view.appendChild(fragment);
				_this.endPullupToRefresh(false);
			},1000);
		};
		
		//搜索键盘
	    $('#seach').submit(function(){
	    		var keyword =$('.search-input').val();
	        if(keyword){
				keyword = keyword;
				
				$('.my-jiazu-main').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}else{
				keyword = '';
				
				$('.my-jiazu-main').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}
	    });
		// 搜索按钮
	    $('.t-sosuo').on("tap", function() {
	        var keyword =$('.search-input').val();
	        if(keyword){
				keyword = keyword;
				
				$('.my-jiazu-main').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}else{
				keyword = '';
				
				$('.my-jiazu-main').children().remove();
				mui('#offCanvasContentScroll').pullRefresh().refresh(true);
				mui('#offCanvasContentScroll').pullRefresh().pullupLoading();
			}
	    });
		
		mui('.my-jiazu-main').on('tap','.mui-btn',function(){
			var _this = this;
			var parent = $(this).parent().parent();
			var m_name = parent.find('.m-name').html();
			if($(this).hasClass('mui-btn-grey')){
				mui.prompt('为用户[<font color="blue">'+m_name+'</font>]备注','请输入要备注的内容','备注客户',
					function(e){
						if(e.index == 1){
							mask.show();
							var content = e.value;
							if(content){
								//TODO 提交服务端
								
								parent.find('.beizhu').html(content);
								mask.close();
								mui.alert('备注成功！','成功');
								setTimeout(function(){
									mui.swipeoutClose(_this.parentNode.parentNode);
								},0);
							}else{
								mui.alert('请输入备注内容！','错误');
								mask.close();
								return false;
							}
						}
					}
				);
			}else if($(this).hasClass('mui-btn-red')){
				mui.prompt('为用户[<font color="blue">'+m_name+'</font>]赠送积分','请输入要赠送的积分数量','赠送积分',
					function(e){
						if(e.index == 1){
							mask.show();
							var content = Number(e.value);
							if(!isNaN(content) && content > 0){
								//TODO 提交服务端
								
								var jf = Number(parent.find('.c-purple').html());
								parent.find('.c-purple').html(jf+content)
								mask.close();
								mui.alert('赠送成功！','成功');
								setTimeout(function(){
									mui.swipeoutClose(_this.parentNode.parentNode);
								},0);
							}else{
								mui.alert('请输入正确的数字！','错误');
								mask.close();
								return false;
							}
						}
					}
				);
			}
		});
	});
})();
