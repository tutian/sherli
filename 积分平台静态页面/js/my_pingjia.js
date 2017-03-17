$(function() {

    mui(".my-pingjia-wrapper").scroll(mui.scrollOption);
    var _url = window.location.href,
        _mall_type = "";
    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
    }
    var evelStar = function() {
        $(".evel-star-item .evel-star-list").on("tap", function() {
            var starChildNode = $(this).parent().children();
            var index = $(this).index(),
                i;
            //清除所有样式
            $(this).parent().find(".star-active").removeClass("star-active");
            //点击添加样式
            for (i = 0; i <= index; i += 1) {
                starChildNode.eq(i).addClass("star-active");
            }

        });
    };
    evelStar();
   
    $(".camera-area").fileUpload({
        "url": "/index.php?con=ajax&act=upload_image",
        "file": "file"
    });
    var imgArr = [];
    upLoadCreateDom = function(imgdata) {
        imgArr.push(imgdata.msg);
        $(".evel-pic").attr("data-img", imgArr.join(";"));
        if(imgArr.length===3){
            $(".camera-area").hide();
        }
    };
    var comfirmEvel = function() {
        var evaluate_info = [];
        $(".confirm-eval").on("tap", function() {
            evaluate_info = [];
            $(".evel-item").each(function() {
                
                var starActiveCount = $(this).find(".evel-star-list.star-active").size();
                var _content = $(this).find("#textarea").val();
                var _goods_id = $(this).attr("goods-id");
                var _order_no = $(this).attr("order-no");
                var evelImgArr = [],
                    _imgs = $(this).find(".evel-pic").attr("data-img");
                if (_imgs && _imgs.indexOf(";") > 0) {
                    evelImgArr = _imgs.split(";");
                } else {
                    evelImgArr.push(_imgs);
                }
                if (_content === "") {
                    _content = "";
                }
                var _evaluate_info = {
                    goods_id: _goods_id, //商品id
                    order_no: _order_no, //订单号
                    content: _content, //商品评论
                    point: starActiveCount, //评价星级
                    imgs: evelImgArr //评论上传图片
                };

                evaluate_info.push(_evaluate_info);

            });
            

            var evaluate_info = {evaluate_info};
            $.ajax({
                type: "post",
                url: "/index.php?con=ajax&act=evaluate",
                data: evaluate_info,
                dataType: "json",
                success: function(data) {
                    if(data.err===0){
                        window.location.replace("/index.php?con=index&act=my_order_all"+_mall_type);
                    }

                },
                error: function() {
                    console.log("请求服务器失败");
                }
            });
        });


    };
    comfirmEvel();
});
