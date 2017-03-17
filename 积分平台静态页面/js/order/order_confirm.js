 $(function() {
     mui(".order-sure-wrapper").scroll(mui.scrollOption);
     var orderSureSwitch = function() {
         // 发票
         $(".order-sure-switch").on("tap", function() {
             if ($(this).hasClass("mui-active")) {
                 $(".order-srue-bill").show();
             } else {
                 $(".order-srue-bill").hide();
             }
         });
         // 购物须知
         $(".shop-tip").on("tap", function() {
             $(".tips-mask").show();
         });
         $(".tips-close").on("tap", function() {
             $(".tips-mask").hide();
         });
     };
     orderSureSwitch();
     var _url = window.location.href, _mall_type = "";
     if (_url.indexOf("china") > 0) {
         _mall_type = '_china';
     } else if (_url.indexOf("seasame") > 0) {
         _mall_type = '_seasame';
     }
     // 订单生成
     var orderSurePay = function() {
        var voucher_id="";
         $(".order-sure-pay-btn").bind("tap", function() {
            // console.log($(".order-info-cash-num").text().split("¥")[1]);
            var btnhass=$(".order-sure-switch").hasClass("mui-active");
            if(btnhass&&$(".order-srue-bill").val()==""){

                mui.toast("请输入个人或公司名称");
                return false;
            }

             var invoiceTitle, isInvoice, _type;
             if ($(".order-sure-switch").hasClass("mui-active")) {
                 isInvoice = 1;
                 invoiceTitle = $(".order-srue-bill").val();
             } else {
                 invoiceTitle = "";
                 isInvoice = 0;
             }
             if ($('.whole_address').val() === "") {
                 mui.alert("请添加收货地址", function() {
                     window.location.href = "/index.php?con=index&act=add_address"+_mall_type;
                 });
                 return false;
             } else {
                 if (mall_type == 'oversea' && id_no == "") {
                     mui.alert("根据国家规定，进口商品需要身份证，请填写身份证号！",function(){
                        window.location.href = "/index.php?con=index&act=edit_address&confirm_address&addr_id="+$('.address_id').val();
                     });
                 } else {
                     $(".order-sure-pay-btn").unbind("tap");
                     voucher_id = $(".order-coupon-disc").attr("voucher-id");
                     $.ajax({
                         type: "post",
                         url: CREATE_ORDER,
                         data: {
                             address_id: $('.address_id').val(), //根据用户选择动态获取
                             payment_id: $('.payment_id').val(), //支付方式(1.余额支付)
                             prom_id: "", //优惠活动id
                             is_invoice: isInvoice, //根据页面选择获取
                             invoice_type: 0, //根据页面选择获取
                             invoice_title: invoiceTitle, //根据页面选择获取
                             user_remark: "",
                             voucher_id: voucher_id, //优惠券id
                             cart_type: "", //购物车类型
                             mall_type: $('.mall_type').val(),
                             type: $('.type').val(), //data.type, //订单类型(groupbuy:团购,flashbuy:抢购,bundbuy:捆绑销售)
                             id: "1", //优惠活动id
                             product_id: $('.product_id').val(),
                             buy_num: "1" //团购数量(非必传)
                         },
                         dataType: "json",
                         success: function(data) {
                             var order_no = data.order_no,
                                 order_amount = $(".total_amount").val();
                             window.location.replace(ORDER_PAY + _mall_type + "&order_no=" + order_no + "&order_amount=" + order_amount);

                         },
                         error: function() {
                             console.log("order-sure-error");
                         }
                     });
                 }

             }

         });
     };
     orderSurePay();
     if (window.sessionStorage) {
         $(".order-changge-address").on("tap", function() {
            sessionStorage.setItem("confirm_order", window.location.href);
         });
         $(".my-coupon").on("tap",function(){
            sessionStorage.setItem("confirm_order", window.location.href);
         });
         var coupon_obj = JSON.parse(window.sessionStorage.getItem("coupon_obj"));
         if(coupon_obj){
            var totalAmount = $(".total_amount").val();
            var totalCash = (totalAmount-coupon_obj.coupon_value).toFixed(2);
            $(".order-coupon-disc").text(coupon_obj.coupin_name);
            $(".order-coupon-disc").attr("voucher-id",coupon_obj.coupon_id);
            $(".order-info-fav-num").text("-¥"+coupon_obj.coupon_value);
            $(".order-info-cash-num").text("¥"+totalCash);
            window.sessionStorage.removeItem("coupon_obj");
         }
         
     }
 });
