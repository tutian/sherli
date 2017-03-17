$(function() {
    //退换货详情
    var _url = window.location.href,
        _mall_type = "",
        mall_type = 'oversea';
    var refund_no = _url.match(/&refund_no=(\d+)/)[1];
    var type = _url.match(/&type=(\d)/)[1];

    if (_url.indexOf("china") >= 0) {
        _mall_type = "_china";
        mall_type = 'china';
    } else if (_url.indexOf("seasame") >= 0) {
        _mall_type = "_seasame";
        mall_type = 'seasame';
    }


      $(".sure-btn").on('tap',function(){
              //验证表单不为空
          mui(".select_express_div .inputproving").each(function() {
            //若当前input为空，则alert提醒 
           var sendcompanyid=$("#showExpress").attr('express-id');
           var sendgoodsnumber=$("#thhsend_goods_number").val();
           var check=true;
            if(sendcompanyid<=0||sendcompanyid=="") {
                var label = $(".express_lbl").text();
                mui.alert('请选择'+label );
                check = false;
                return false;

            }else if(sendgoodsnumber=="") {
                var label = $(".express_lbl2").text();
                mui.alert(label+ "不允许为空");
                check = false;
                return false;

            }
            if(check){
                linkproving();
            }
            }); //校验通过，继续执行业务逻辑 
            
          function linkproving(){
              var sendcompanyid=$("#showExpress").attr('express-id');
              var sendgoodsnumber=$("#thhsend_goods_number").val();
              $.ajax({
                type:"post",
                url:'/index.php?con=ajax&act=refund_post',
                data:{
                     refund_no:refund_no,
                     type:type,
                     express:sendcompanyid,
                     express_no:sendgoodsnumber
                },
                dataType:"json",
                success:function(data){
                        if(data.err==0){
                            mui.alert('提交邮寄信息成功',function(){
                                window.location.href = '/index.php?con=index&act=my_order_thh'+_mall_type+'&mall_type='+mall_type;
                            });
                            
                        }else{
                            mui.alert(data.err_info);
                        }
                    },  
                    error:function(xhr,type){
                        mui.alert('提交邮寄信息失败’');
                    }
              });
          };
    });




    mui.selectExpress();
// 获取邮件信息的快递公司，快递单
});


(function($) {
    var express_url = '/index.php?con=ajax&act=get_express_company'    
     mui.selectExpress = function() {
           mui.ready(function() {
               mui.get(express_url,
               {},
               function(data) {
                   var selectExpressPicker = new $.PopPicker(),
                       i, setDataArr = [];
                   for (i = 0; i < data.length; i += 1) {
                       var item = data[i];
                       setDataArr.push({ value: item.id, text: item.name });
                   }
                   // console.log(setDataArr);
                   selectExpressPicker.setData(setDataArr);
                   var showSelectAccountPickerButton = document.getElementById('showExpress');0
                    showSelectAccountPickerButton.addEventListener('tap', function(event) {
                      if(data.length===0){
                        mui.alert("暂无可选快递公司");
                      }else{
                        selectExpressPicker.show(function(items) {
                        var _text =(items[0] || {}).text;
                        if(_text!==undefined){
                            showSelectAccountPickerButton.innerText = (items[0] || {}).text;
                            showSelectAccountPickerButton.setAttribute("express-id", (items[0] || {}).value);
                        }
                           
                       });
                      }
                       
                   }, false);
               }, 'json');
           });

       };


})(mui);

     