$(function() {
    // 存储搜索框的值
    var localStorageInput = function() {
        var sVal = {},
            inputValArr;
        if (localStorage) {
            var key = localStorage.getItem("searchKeyWord");
            if (key === null) {
                sVal = { "searchWord": [] };
            } else {
                sVal = JSON.parse(key);
            }
        }
        $(".header-search .goodslist-search-btn").on("tap", function() {
            var inputVal = $(".search-input").val(),
                i, flag = 0;
            if (inputVal !== "") {
                if (sVal.searchWord.length === 0) {
                    sVal.searchWord.unshift(inputVal);
                } else {
                    for (i = 0; i < sVal.searchWord.length; i += 1) {
                        var item = sVal.searchWord[i];
                        if (item === inputVal) {
                            sVal.searchWord.splice(i, 1);
                            sVal.searchWord.unshift(inputVal);
                            flag = 0;
                            break;
                        } else {
                            flag = 1;
                        }
                    }
                    if (flag === 1) {
                        sVal.searchWord.unshift(inputVal);
                        flag = 0;
                    }
                }
                var str = JSON.stringify(sVal);
                localStorage.setItem("searchKeyWord", str);
            }
        });
    };
    var hotSearch = function() {
        $.ajax({
            type: "get",
            url: "/index.php?con=ajax&act=hot_search",
            data: {},
            dataType: "json",
            success: function(data) {
                console.log(data);
                hotSearchCreateDom(data);
            },
            error: function(xhr, type) {
                console.log("search-error!");
            }
        });
        var hotSearchCreateDom = function(data) {
            var hotSearch = "";
            for (i = 0; i < data.length; i += 1) {
                var item = data[i];
                hotSearch += '<a href="/index.php?con=index&act=goodslist&id=/' + escape(item.name) + '" class="hot-main-item">' + item.name + '</a>';
            }
            $(".hot-search .hot-main").html(hotSearch);
        };
    };
    var historySearch = function() {
        $(".search-input").on("input", function() {
            var val = escape($(this).val());
            $(".goodslist-search-btn").prop("href", "/index.php?con=index&act=goodslist&id=/" + val);
        });
        if (localStorage) {
            var historySearchNotes = JSON.parse(localStorage.getItem("searchKeyWord"));
            // console.log(historySearchNotes);
            if (historySearchNotes) {
                var searchWordArr = historySearchNotes.searchWord,
                    i, historySearchHtml = "";
                if (searchWordArr.length !== 0) {
                    for (i = 0; i < searchWordArr.length; i += 1) {
                        var item = searchWordArr[i];
                        historySearchHtml += '<a href="/index.php?con=index&act=goodslist&id=/' + escape(item) + '" class="history-search-item">' + item + '</a>';
                    }
                    $(".not-search-result").hide();
                    $(".has-search-result").show();
                    $(".has-search-result .mui-scroll").html(historySearchHtml);
                }
            }
        }
        // 删除历史记录
        $(".history-search-del").on("tap", function() {
            localStorage.removeItem("searchKeyWord");
            $(".has-search-result .mui-scroll").html("");
            if ($(".has-search-result .mui-scroll").html() === "") {
                $(".has-search-result").hide();
                $(".not-search-result").show();
            }
        });
    };
    localStorageInput();
    hotSearch();
    historySearch();
    mui('.search-clear-btn').input();
});
