$(function() {
    //退换货详情
    var _url = window.location.href,
        _mall_type = "",
        mall_type = 'oversea';
    var refund_no = _url.match(/&refund_no=(\d+)/)[1];
    var goods_id = _url.match(/&goods_id=(\d+)/)[1];
    var type = _url.match(/&type=(\d)/)[1];

    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
        mall_type = 'china';
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
        mall_type = 'seasame';
    }
    var operate_html = '';
    $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=get_refund_detail",
        data: {
            refund_no: refund_no,
            goods_id: goods_id,
            type: type
        },
        dataType: "json",
        success: function(data) {
            thhDetail(data);
            cancelThh(data);
            deleteThh(data);
        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
    var thhDetail = function(data) {
        var _status, thhDetailDiscHtml = "",
            thhDetailGoodsHtml = "";
            console.log(data);
        if (data && data.refund_info) {
            var item = data.refund_info;
            var _status;
            if(item.type==1){
                    if(item.status==0&&item.logistics_status==0){
                        _status = '待处理';
                        operate_html = '<a class="z-focus btn cancel-btn">取消申请</a>';
                    }else if(item.status==3&&item.logistics_status==0){
                         _status = '拒绝申请';
                         operate_html = '<a class="z-focus btn cancel-btn">取消申请</a>';
                    }else if(item.status==4){
                        _status = '已取消';
                        operate_html = '<a class="z-focus btn delete-btn">删除退货单</a>';
                    }else if(item.status==1&&item.logistics_status==0){
                        _status = '待邮寄货品';
                         operate_html = '<a href="/index.php?con=index&act=thh_send_goods'+_mall_type+'&refund_no='+data.refund_info.refund_no+'&type='+type+'&mall_type='+mall_type+'" class="z-focus btn fill-btn">填写邮寄信息</a>';                         
                    }else if(item.status==1&&item.logistics_status==1){
                         _status = '货品邮寄中';
                        operate_html = '<a class="z-focus btn see-btn" href="/index.php?con=index&act=wuliu_details&express_company='+data.refund_info.express_company+'&express_no='+data.refund_info.express_no+'&is_refund=1">查看物流</a>';
                    }
                    else if(item.status==2&&item.logistics_status==2){
                         _status = '退货完成';
                          operate_html = '<a class="z-focus btn delete-btn">删除退货单</a>';
                    }else if(item.status==3&&item.logistics_status==2){
                         _status = '原货打回';
                          operate_html = '<a class="z-focus btn see-btn" href="/index.php?con=index&act=wuliu_details&express_company='+data.refund_info.express_company+'&express_no='+data.refund_info.express_no+'&is_refund=1">查看物流</a>';
                    }
                }else{
                  if(item.status==0&&item.logistics_status==0){
                        _status = '待处理';
                         operate_html = '<a class="z-focus btn cancel-btn">取消申请</a>';
                    }else if(item.status==4){
                         _status = '已取消';
                         operate_html = '<a class="z-focus btn delete-btn">删除退货单</a>';
                    }else if(item.status==3&&item.logistics_status==0){
                         _status = '拒绝申请';
                         operate_html = '<a class="z-focus btn cancel-btn">取消申请</a>';
                    }else if(item.status==1&&item.logistics_status==0){
                        _status = '待邮寄货品';
                        operate_html = '<a href="/index.php?con=index&act=thh_send_goods'+_mall_type+'&refund_no='+data.refund_info.refund_no+'&type='+type+'&mall_type='+mall_type+'" class="z-focus btn fill-btn">填写邮寄信息</a>';
                    }else if(item.status==1&&item.logistics_status==1){
                         _status = '货品邮寄中';
                         operate_html = '<a class="z-focus btn see-btn" href="/index.php?con=index&act=wuliu_details&express_company='+data.refund_info.express_company+'&express_no='+data.refund_info.express_no+'&is_refund=1">查看物流</a>';
                    }
                    else if(item.status==1&&item.logistics_status==2){
                         _status = '已重新发货';
                         operate_html = '<a class="z-focus btn see-btn" href="/index.php?con=index&act=wuliu_details&express_company='+data.refund_info.express_company+'&express_no='+data.refund_info.express_no+'&is_refund=1">查看物流</a>';
                    }else if(item.status==3&&item.logistics_status==2){
                         _status = '原货打回';
                         operate_html = '<a class="z-focus btn see-btn" href="/index.php?con=index&act=wuliu_details&express_company='+data.refund_info.express_company+'&express_no='+data.refund_info.express_no+'&is_refund=1">查看物流</a>';
                    }else if(item.status==2&&item.logistics_status==2){
                         _status = '退货完成';
                          operate_html = '<a class="z-focus btn delete-btn">删除退货单</a>';
                    }
                }
            $(".thh-detail-status").text(_status);
            thhDetailDiscHtml = '<ul class="m-form"><li class="ui-border-b"><span>退换货编号</span><i class="f-fr thh-detail-order-no">' + data.refund_info.refund_no + '</i></li><li class="ui-border-b"><span>创建时间</span><i class="f-fr">' + data.refund_info.create_time + '</i></li><li class="ui-border-b"><span>问题描述</span></li></ul><p class="thh-detail-content">' + data.refund_info.content + '</p>';
            $(".thh-detail-disc").html(thhDetailDiscHtml);

            $('.thh_operate').html(operate_html);
        }
        if (data && data.goods_info) {
            var goods = data.goods_info[0];
            thhDetailGoodsHtml = '<li class="ui-border-b"><a href="/index.php?con=index&act=goods_detail' + _mall_type + '&goods_id=' + data.goods_info[0].goods_id + '"><div class="m-img"><img class="mui-media-object mui-pull-left" src="' + goods.img + '"></div><div class="m-details"><div class="list list1 ovf-h"><div class="f-fl goods-name-details">' + goods.name + '</div></div><div class="list list3 ovf-h"><i class="f-fl">数量:</i><i class="f-fl">' + goods.goods_num + '</i><i class="f-fr m-price">¥' + goods.sell_price + '</i><i class="f-fr">小计:</i></div></div></a></li>';
            $(".m-goods-details").html(thhDetailGoodsHtml);
        }
    };
    // 取消退换货
    var cancelThh = function(data) {
        $(".cancel-btn").on("tap", function() {
            $(".cancel-thh-backdrop").show();
        });
        $(".mask-cancel-btn").on("tap", function() {
            clearTimeout(timer);
            var timer = setTimeout(function() {
                $(".cancel-thh-backdrop").hide();
            }, 300);
        });
        $(".cancel-sure-btn").on("tap", function() {
            $.ajax({
                type: "post",
                url: " /index.php?con=ajax&act=cancel_refund_apply",
                data: {
                    refund_no:data.refund_info.refund_no,      //退换货单号
                    type:data.refund_info.type  
                },
                dataType: "json",
                success: function(data) {
                    mui.alert('取消成功',function(){
                        window.location.href='/index.php?con=index&act=my_order_thh'+_mall_type+'&mall_type='+mall_type;
                    });
                    
                },
                error: function(xhr, type) {
                    console.log(xhr);
                }
            });
        });
    };

// 删除退货单
    var deleteThh = function(data){
        $('.thh_operate').on('tap','.delete-btn',function(){


            mui.confirm('是否删除退货单？',function(e){
                if(e.index==1){
                    var id = data.refund_info.id;
                    var type = data.refund_info.type;
                    var url = '/index.php?con=ajax&act=refund_delete';
                    $.ajax({
                        url:url,
                        data:{
                            id:id,
                            type:type
                        },
                        dataType:'json',
                        type:'post',
                        success:function(data){
                            if(data.err==0){                        
                        window.location.href = '/index.php?con=index&act=my_order_thh'+_mall_type+'&mall_type='+mall_type;
                                
                            }else{
                                mui.alert(data.err_info);
                            }
                        },  
                        error:function(xhr,type){
                            mui.alert('请求失败，请稍后重试');
                        }
                    });
                }else{}
                           
            });         
        });
    };
// 获取邮件信息的快递公司，快递单
 var getsendgoodsinfo = function(data){
        $('.sure-btn').on('tap',function(){
            var id = data.refund_info.id;
            var type = data.refund_info.type;
            var url = '/index.php?con=ajax&act=refund_delete';
            $.ajax({
                url:url,
                data:{
                    id:id,
                    type:type
                },
                dataType:'json',
                type:'post',
                success:function(data){
                    if(data.err==0){
                        mui.alert('删除成功',function(){
                           window.location.href = '/index.php?con=index&act=my_order_thh'+_mall_type+'&mall_type='+mall_type; 
                        });
                        
                    }else{
                        mui.alert(data.err_info);
                    }
                },  
                error:function(xhr,type){
                    mui.alert('请求失败，请稍后重试');
                }


            });

        });
    };

});
