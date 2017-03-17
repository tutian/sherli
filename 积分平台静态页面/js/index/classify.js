(function() {
	mui.init();
	mui.ready(function(){
		mui('.classify-left-side').scroll(mui.scrollOption);
		mui('.classify-right-side').scroll(mui.scrollOption);
		
		
//		var data = ajax({url:'http://xxx.xxx.xxx/'});
		var data = [
			{id:1, name : '测试分类1'},
			{id:2, name : '测试分类2'},
			{id:3, name : '测试分类3'},
			{id:4, name : '测试分类4'},
			{id:5, name : '测试分类5'},
			{id:6, name : '测试分类6'},
			{id:7, name : '测试分类7'},
			{id:8, name : '测试分类8'},
			{id:9, name : '测试分类9'},
			{id:10, name : '测试分类10'},
			{id:11, name : '测试分类11'},
			{id:12, name : '测试分类12'},
			{id:13, name : '测试分类13'},
			{id:14, name : '测试分类14'},
			{id:15, name : '测试分类15'},
			{id:16, name : '测试分类16'},
			{id:17, name : '测试分类17'},
			{id:18, name : '测试分类18'},
			{id:19, name : '测试分类19'},
			{id:20, name : '测试分类20'}
		];
		if(data){
	        classifyLeftClassifyEvent(data);
	        classifyLeftNavH();
	        classifyRightChildClass(data[0].id);
		}
		
		function classifyLeftClassifyEvent(goods) {
	        var classifyLeft = $(".classify-left-scroll"),
	            i = 0,
	            classifyHtml = "";
	        classifyHtml += "<a href='#tabbar_classify?id=" + goods[0].id + "' index='1' data-id='" + goods[0].id + "' class='classify-left-item mui-control-item active'>" + goods[0].name + "</a>";
	        for (i = 1; i < goods.length; i += 1) {
	            classifyHtml += "<a href='#tabbar_classify?id=" + goods[i].id + "' index='"+(i+1)+"' data-id='" + goods[i].id + "' class='classify-left-item mui-control-item '>" + goods[i].name + "</a>";
	        }
	        classifyLeft.html(classifyHtml);
	    };
	    
	    function classifyLeftNavH() {
            $('.classify-left a').on("tap", function() {
                var muiScroll = $(this).parents("#list");
				var index = $(this).attr('index');
                var controlItemHeight = $(this).height();
                var maxTranslateNum = muiScroll.height() - $(window).height() + 100;
                var muiScrollH = muiScroll.height();
                var clientHeight = $(window).height();
                var _size = $(".classify-left a").size();
                _translateNum = 0;
                var classid = $(this).attr("data-id");
                $(this).addClass("active").siblings(".classify-left-item").removeClass("active");
                if (muiScrollH < clientHeight) {
                    _translateNum = 0;
                } else {
                    if (index <= 4) {
                        _translateNum = 0;
                    } else if (clientHeight < 600 && index >= (_size - 6)) {
                        _translateNum = -maxTranslateNum + controlItemHeight;
                    } else if (clientHeight >= 600 && clientHeight <= 736 && index >= (_size - 8)) {
                        _translateNum = -maxTranslateNum + controlItemHeight;
                    } else {
                        _translateNum = -(index - 4) * controlItemHeight;
                    }
                }
                mui('.classify-left-side').scroll().scrollTo(0, _translateNum, 800);
                classifyRightChildClass(classid);
            });
		};
		
		// 右边区域二级分类
	    function classifyRightChildClass(classdId) {
//			var data = ajax({url:'xxx.xxx.xxx'});
			var data = [
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
				{id : 1, name : '测试分类', img : '../../img/pj.jpg',url : 'javascript:'},
			];
	        
	        if(data){
		        	mui(".classify-scroll-wrapper").scroll(mui.scrollOption);
		        var classifyRightChildClassHtml = "",
		            i;
		        $.each(data, function(k, item) {    
		            classifyRightChildClassHtml += '<li class="mui-table-view-cell  mui-col-xs-4 classify-goods-box"><a href="' + item.url + '" class="classify-link-box "><span class="classify-img-wrapper"><img src="' + item.img + '" alt="' + item.name + '"></span><p class="classify-disc">' + item.name + '</p></a></li>';
		        });
		        $(".classify-details-goods").html(classifyRightChildClassHtml);
	//	        mui('.classify-right-con').scroll().scrollTo(0, 0, 800);
		        mui('.classify-right-side').scroll().scrollTo(0, 0, 500);
	        }
	    };
	    
	    $('.t-sosuo').on('tap', function() {
	        var keyword = document.querySelector('.search-input').value;
	        window.location.replace(GOODS_LIST_URL + '&keyword=' + keyword);
	    });
	    $(document).on("keyup", function(e) {
	        if (e.keyCode == 13) {
	            var keyword = document.querySelector('.search-input').value;
	            window.location.replace(GOODS_LIST_URL + '&keyword=' + keyword);
	        }
	    });
	});
})();
