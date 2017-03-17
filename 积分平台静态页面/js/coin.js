(function($) {
    //余额明细
    var coinInit = function() {
        mui(".coin-scroll-wrapper").scroll(mui.scrollOption);
    };
     // 排序
    var orderSort = function(page, orderId, incomeId, dataTime, logType) {
        mui.post("/index.php?con=ajax&act=balance_log", {
            p: page, //页数
            balance_type: orderId, //1-余额多到少,2-余额少到多,空为全部
            income_type: incomeId, //1-收入,2-支出,空为全部
            data: dataTime, //时间筛选
            log_type: logType
        }, function(data) {
            walletDetailCreateDom(data);
        }, 'json');
    };

    //创建dom
    var walletDetailCreateDom = function(data) {
        console.log(data);
        var notDate = document.getElementById("notDate");
        if (data && data.length !== 0) {
            var walletDetailHtml = "",
                i;
            notDate.style.display = "none";
            for (i = 0; i < data.length; i += 1) {
                var item = data[i];
                var disc = item.amount.indexOf("-") >= 0 ? item.amount : "+" + item.amount;
                walletDetailHtml += "<div class='coin-item'><div class='coin-item-main'><div class='coin-item-right fr'><p class='coin-item-right-top'>" + disc + "</p><p class='coin-item-right-bottom'>余额</p></div><div class='coin-item-left'>" + item.note + "</div></div><p class='coin-item-footer'><time datetime='" + item.time + "'>" + item.time + "</time></p></div>";
            }
            document.querySelector(".balance-scroll").innerHTML = walletDetailHtml;
        } else {
            notDate.style.display = "block";
        }
        var coinItemRightTop = document.querySelectorAll(".coin-item-right-top");
        var coinItemRightTopCont = coinItemRightTop.innerHTML;
        var arg = Array.prototype.slice.call(coinItemRightTop);
        arg.forEach(function(cont) {
            if (cont.innerHTML.match(/\-/)) {
                cont.classList.add("minus-color");
            }
        });
    };

    //排序
    var sort = function(data) {
        var sharecoin = document.getElementById("sharecoin");
        var exp = document.getElementById("exp");
        var coinBackdrop = document.querySelector(".coin-backdrop");
        var muiTitle = document.querySelector(".coin-title").innerHTML;
        mui(".coin-nav .coin-nav-item").each(function(index, ele) {
            this.addEventListener("tap", function() {
                
                var active = document.querySelectorAll(".active");
                var coinNavIcon = this.querySelector(".coin-nav-icon");
                var coinNavTime = this.querySelector(".coin-nav-time");
                var activeArr = Array.prototype.slice.call(active);
                var notDate = document.getElementById("notDate");

                //移除所有active
                activeArr.forEach(function(item) {
                    item.classList.remove("active");
                });
                //点击添加样式
                this.classList.add("active");
                //子元素coinNavIcon存在的情况下添加active，否则移除
                if (coinNavIcon) {
                    var CoinchildNode = Array.prototype.slice.call(coinNavIcon.childNodes);
                    CoinchildNode.forEach(function(child) {
                        child.classList.add("active");
                    });
                }
                //子元素是日期按钮
                if (coinNavTime) {
                    coinNavTime.classList.add("active");
                    var optionsJson = this.getAttribute('data-options') || '{}';
                    var options = JSON.parse(optionsJson);
                    var id = this.getAttribute('id');
                    var picker = new $.DtPicker(options);
                    var coinScroll = document.querySelector(".coin-scoll");
                    picker.show(function(rs) {
                        //清空主体内容
                        coinScroll.innerHTML = "";
                        switch (muiTitle) {
                            case "芝麻币明细":
                                orderSort(0, " ", " ", rs.text, 1);
                                break;
                            case "乐享币明细":
                                orderSort(0, " ", " ", rs.text, 2);
                                break;
                            default:
                                orderSort(0, " ", " ", rs.text, 0);
                                break;
                        }
                        //释放组件资源
                        picker.dispose();
                    });
                }
                // 弹框
                switch (index) {
                    case 1:
                        coinBackdrop.style.display = "block";
                        sharecoin.style.display = "block";
                        break;
                    case 2:
                        coinBackdrop.style.display = "block";
                        exp.style.display = "block";
                        break;
                }
            });
        });

        mui(".coin-popover").on("tap", ".sort-item", function() {
            var coinNavIconArrow = document.querySelectorAll(".coin-nav-icon-arrow");

            //清空主体部分的内容
            document.querySelector(".balance-scroll").innerHTML = "";
            notDate.style.display = "none";
            //如果点击为从大到小按钮
            if (this.classList.contains("big-sort")) {
                //升序
                switch (muiTitle) {
                    case "芝麻币明细":
                        orderSort(0, 1, " ", " ", 1);
                        break;
                    case "乐享币明细":
                        orderSort(0, 1, " ", " ", 2);
                        break;
                    default:
                        orderSort(0, 1, " ", " ");
                        break;
                }

                coinNavIconArrow[0].classList.remove("active");
                sharecoin.style.display = "none";
                coinBackdrop.style.display = "none";
            } else if (this.classList.contains("small-sort")) {
                //降序

                switch (muiTitle) {
                    case "芝麻币明细":
                        orderSort(0, 2, "", "", 1);
                        break;
                    case "乐享币明细":
                        orderSort(0, 2, "", "", 2);
                        break;
                    default:
                        orderSort(0, 2, "", "");
                        break;
                }
                coinNavIconArrow[1].classList.remove("active");
                sharecoin.style.display = "none";
                coinBackdrop.style.display = "none";
            } else if (this.classList.contains("icon-sort")) {
                //收入

                switch (muiTitle) {
                    case "芝麻币明细":
                        orderSort(0, "", 1, "", 1);
                        break;
                    case "乐享币明细":
                        orderSort(0, "", 1, "", 2);
                        break;
                    default:
                        orderSort(0, "", 1, "");
                        break;
                }
                coinNavIconArrow[2].classList.remove("active");
                coinBackdrop.style.display = "none";
                exp.style.display = "none";
            } else if (this.classList.contains("pay-sort")) {
                //支出
                console.log(muiTitle);
                switch (muiTitle) {
                    case "芝麻币明细":
                        orderSort(0, "", 2, "", 1);
                        console.log("ok");
                        break;
                    case "乐享币明细":
                        orderSort(0, "", 2, "", 2);
                        break;
                    default:
                        orderSort(0, "", 2, "");
                        break;
                }
                coinNavIconArrow[3].classList.remove("active");
                coinBackdrop.style.display = "none";
                exp.style.display = "none";
            } else if (this.classList.contains("all-sort")) {

                switch (muiTitle) {
                    case "芝麻币明细":
                        orderSort(0, "", "", "", 1);
                        break;
                    case "乐享币明细":
                        orderSort(0, "", "", "", 2);
                        break;
                    default:
                        orderSort(0, "", "", "");
                        break;
                }
                sharecoin.style.display = "none";
                exp.style.display = "none";
                coinBackdrop.style.display = "none";
            }
        });
    };

    
     $.ajax({
        type: "get",
        url: "/index.php?con=ajax&act=balance_log",
        data: {
            log_type: 3
        },
        dataType: "json",
        success: function(data) {
            coinInit();
            walletDetailCreateDom(data);
            sort();

        },
        error: function(xhr, type) {
            console.log(xhr);
        }
    });
})(mui);