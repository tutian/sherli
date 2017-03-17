$(function(){

    var rechargeNum = function() {
        // 选择充值金额
        var _href = $(".wallet-recharge-btn").prop("href").split("money=");
        var href = RECHARGE + "&money=";
        $(".wallet-recharge-item").on("tap", function() {
            var moneyNum;
            $(this).find(".icon-xiabiao").addClass("is-show").parents(".wallet-recharge-item")
                .siblings(".wallet-recharge-item").find(".icon-xiabiao").removeClass("is-show");
            $(".wallet-recharge-input").val("");
            moneyNum = parseInt($(this).find(".wallet-recharge-num").text());
            $(".wallet-recharge-btn").prop("href", href + moneyNum);
        });
        // 填写充值金额
        $(".wallet-recharge-input").on("input", function() {
            var moneyNum;
            $(".wallet-recharge-item").find(".icon-xiabiao").removeClass("is-show");
            moneyNum = parseFloat($(this).val());
            if (moneyNum > 0) {
                $(".wallet-recharge-btn").prop("href", href + moneyNum);
            } else {
                $(".wallet-recharge-btn").prop("href", "javascript:;");
            }

        });

    };
    rechargeNum();
});