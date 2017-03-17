(function(){
	mui.init();
	mui.ready(function(){
		mui(".order-pay-wrapper").scroll(mui.scrollOption);
		mui.get("../../js/city.data.json", function(data) {

            var cityPicker = new mui.PopPicker({
                layer: 3
            });
            cityPicker.setData(data);
            var showCityPickerButton = document.querySelector('#showCityPicker');
            var addAddressSel = document.querySelector(".add-address-sel");
            showCityPickerButton.addEventListener('tap', function(event) {
                cityPicker.show(function(items) {
                    addAddressSel.innerText = (items[0] || {}).text + " " + (items[1] || {}).text + " " + (items[2] || {}).text;
                    addAddressSel.setAttribute("data-province", (items[0] || {}).value);
                    addAddressSel.setAttribute("data-city", (items[1] || {}).value);
                    addAddressSel.setAttribute("data-county", (items[2] || {}).value);
                    addAddressSel.style.color = '#222';
                });
            }, false);
        });
        
		$('.confirm-address').on('tap', function(){
//			$(this).addClass("mui-disabled").css('opacity','0.7').html("保存中...");
//			$(this).removeClass("mui-disabled").css('opacity','1').html("保存");
			var addrs = {
				real_name : $('#real_name').val(),
				phone : $('#phone').val(),
				zip : $('#zip').val(),
				county : $('#addr').data('county'),
				city : $('#addr').data('city'),
				province : $('#addr').data('province'),
				address : $('#address').val(),
				is_default : $('#is_default').hasClass('mui-active') ? 1 : 0,
				addr_id : $('#addr_id').val()
			};
			var phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
			
			if(addrs.real_name == ''){
				mui.toast("请填写收货人姓名!");
				return false;
			}else if(addrs.phone == '' || phoneReg.test(addrs.phone) == false){
				mui.toast("请输入有效的手机号码!");
				return false;
			}else if(addrs.county == '' || addrs.city == '' || addrs.province == ''){
				mui.toast("请选择所在地区!")
				return false;
			}else if(addrs.address == ''){
				mui.toast("请填写详细地址!")
				return false;
			}else{
				console.log(addrs);
				//TODO AJAX提交服务端 服务端返回成功后跳转订单收货地址列表页
			}
		});
	});
})();