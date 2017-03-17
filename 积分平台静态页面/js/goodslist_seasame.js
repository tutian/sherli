(function($) {
    //初始化
    mui('.scroll-wrapper').scroll({
        bounce: true,
        indicators: false, //是否显示滚动条
        deceleration: mui.deceleration
    });
    mui('.header-scroll-wrapper').scroll({
        bounce: true,
        indicators: false, //是否显示滚动条
        deceleration: mui.deceleration
    });
    mui('#offCanvasContentScroll').scroll({
        bounce: false,
        indicators: false, //是否显示滚动条
        deceleration: mui.deceleration
    });
    mui('.brand-content').scroll({
        bounce: false,
        indicators: false,
        deceleration: mui.deceleration
    });
    //侧滑容器父节点
    var offCanvasWrapper = mui('#offCanvasWrapper');
    //主界面容器
    var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
    //菜单容器
    var offCanvasSide = document.getElementById("offCanvasSide");

    //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
    var classList = offCanvasWrapper[0].classList;
    //变换侧滑动画移动效果；
    classList.add('mui-slide-in');

    document.getElementById('offCanvasHide').addEventListener('tap', function() {
        offCanvasWrapper.offCanvas('close');
    });
    //侧滑菜单界面支持区域滚动；
    mui('#offCanvasSideScroll').scroll();
})(mui);

(function($) {
    mui.ready(function() {
        // 懒加载
        var lazyLoadApi = mui('#offCanvasContentScroll .mui-scroll').imageLazyload({ autoDestroy: false, placeholder: '/themes/mobile/images/placeholder/main.png' });
        var goodsListUpload = function(data, _this) {
            if (data) {
                if (data.data) {
                    var datas = data.data,
                        table_view = _this.element.querySelector('.mui-scroll .goods-main .mui-table-view'),
                        li;

                    datas.forEach(function(item) {
                        li = document.createElement('li');
                        li.className = 'mui-table-view-cell mui-col-xs-6 goods-item';
                        var _html = '<input type="hidden" name="brand_id" value="' + item.brand_id + '" />';
                        _html += '<input type="hidden" name="category_id" value="' + item.category_id + '" />';
                        _html += '<input type="hidden" name="mall_type" value="' + item.mall_type + '" />';
                        _html += '<a href="' + GOODLIST_DETAIL + '&goods_id=' + item.id + '">';
                        _html += '<div class="goods-top"><span class="goods-img-box"><img data-lazyload="' + item.img + '" src="/themes/mobile//images/placeholder/main.png"></span></div>';
                        _html += '<div class="goods-bottom"><p class="goods-goodsname">' + item.name + '</p>';
                        _html += '<p style="height:18px">';
                        item.tags.forEach(function(tag) {
                            _html += '<span class="goods-post">' + tag + '</span>';
                        });
                        _html += '<p class="goods-price"><span class="goods-price-num"><i class="iconfont icon-zmb01"></i>' + item.sell_price + '</span></p>';
                        _html += '</div></a>';
                        li.innerHTML = _html;
                        table_view.appendChild(li);


                    });
                }
                if (data.sidebar && data.sidebar[1] && data.sidebar[1].chlid) {
                    var brand_list = data.sidebar[1].chlid;
                    var table_view = document.querySelector('.brand-content .goodslist-brand-group'),
                        create_div;
                    var brands = table_view.querySelectorAll('.goodslist-brand-group .mui-input-row');
                    var brand_ids = [];
                    for (var i = 0; i < brands.length; i++) {
                        brand_ids.push(brands[i].getAttribute('data-id'));
                    }
                    brand_list.forEach(function(item) {
                        if (brand_ids.indexOf(item['id']) === -1) {
                            create_div = document.createElement('div');
                            create_div.setAttribute('data-id', item.id);
                            create_div.className = 'mui-input-row mui-checkbox aside-checkbox';
                            var _html = '<label>' + item.name + '</label>';
                            _html += '<input name="checkbox1" data-id="' + item['id'] + '" value="Item 3" type="checkbox" class="mui-pull-right aside-input">';
                            create_div.innerHTML = _html;
                            table_view.appendChild(create_div);
                        }
                    });
                }

                _this.endPullupToRefresh();
            }
        };
        $('#offCanvasContentScroll').pullRefresh({
            up: {
                contentrefresh: "正在加载...",
                contentnomore: '没有更多数据了',
                callback: function() {
                    var _this = this;
                    setTimeout(function() {
                        var current_page = document.getElementById('current_page');
                        var currentPage = current_page.value;
                        currentPage++;
                        current_page.value = currentPage;

                        var data = { 'p': currentPage };
                        var keyword = document.querySelector('.search-input').value;
                        if (keyword) {
                            data['keyword'] = keyword;
                        }
                        var goods_sort = document.getElementById('goods_sort');
                        if (goods_sort) {
                            data['sort'] = goods_sort.value;
                        }
                        var category_id = document.getElementById('category_id');
                        if (category_id) {
                            data['cid'] = category_id.value;
                        }
                        var brand_ids = document.getElementById('brand_ids');
                        if (brand_ids) {
                            data['brand'] = brand_ids.value;
                        }
                        var price_ids = document.getElementById('price_ids');
                        if (price_ids) {
                            data['price'] = price_ids.value;
                        }
                        var mall_types = document.getElementById('mall_type');
                        if (mall_types) {
                            data['mall_type'] = mall_types.value;
                        }

                        $.ajax({
                            type: "get",
                            url: LOAD_GOODS_LIST,
                            data: data,
                            dataType: "json",
                            success: function(data) {
                                goodsListUpload(data, _this);
                                lazyLoadApi.refresh(true);
                            },
                            error: function(xhr, type) {
                                console.log(xhr);
                            }
                        });
                    }, 1000);
                }
            }
        });
        document.body.removeAttribute('data-lazyload');
        $(document).imageLazyload({
            placeholder: '/themes/mobile//images/placeholder/main.png'
        });
    })
})(mui);


$(function() {
    $('#load_goods_list').delegate('a', 'tap', function() {
        window.location.href = $(this).attr('href')
    });
    //侧边栏
    var asideCreateDom = function(goods, id) {
        // 加载侧边栏
        var asideHtml = "",
            i, asidePriceHtml = "",
            asideBrandHtml = "";

        // 完成按钮
        $(".aside-sure-btn").on("tap", function() {
            var asideRight = $(".aside-content .aside-right"),
                brandText = asideRight.eq(1).attr("data-id");
            if (asideRight.eq(0).text() === "不限") {
                priceText = "";
            } else {
                priceText = asideRight.eq(0).text();
            }
            var params = '';
            var mall_type = document.getElementById('mall_type');
            if (mall_type) {
                params += '&mall_type=' + mall_type.value;
            }

            params += '&price=' + priceText;
            if (brandText) {
                params += '&brand=' + brandText;
            }

            var keyword = document.querySelector('.search-input').value;
            if (keyword) {
                params += '&keyword=' + keyword;
            }

            var category_id = document.getElementById('category_id');
            if (category_id) {
                params += '&cid=' + category_id.value;
            }
            mui("#offCanvasWrapper").offCanvas('close');
            window.location.href = LOAD_GOODS_LIST + params;
        });

        // asideDom();
    };
    asideCreateDom();
    var navDom = function(id) {
        mui(".goodslist-nav-bar").on("tap", "a", function() {
            var goodslistNavBar = document.querySelector(".goodslist-nav-bar");
            var active = goodslistNavBar.querySelectorAll(".active");
            var isTrue = this.lastElementChild.classList.contains("arrow");
            var isOffCanvasBtn = this.classList.contains("off-canvas-btn");
            var arrowActive = goodslistNavBar.querySelectorAll(".arrow-active");
            for (var i = 0; i < active.length; i++) {
                active[i].classList.remove('active');
            }
            this.classList.add("active");
            if (arrowActive) {
                for (var i = 0; i < arrowActive.length; i++) {
                    arrowActive[i].classList.remove('arrow-active');
                }
            }
            if (isTrue) {
                var arrow = this.querySelector(".arrow");
                arrow.classList.add("arrow-active");
            }

            var keyword = document.querySelector('.search-input').value;
            var category = document.getElementById('category_id');
            var category_id = 0;
            if (category) {
                category_id = category.value;
            }
            var params = '&keyword=' + keyword + "&cid=" + category_id;
            var brand_ids = document.getElementById('brand_ids');
            if (brand_ids) {
                params += '&brand=' + brand_ids.value;
            }
            var price_ids = document.getElementById('price_ids');
            if (price_ids) {
                params += '&price=' + price_ids.value;
            }
            var mall_types = document.getElementById('mall_type');
            if (mall_types) {
                params += '&mall_type=' + mall_types.value;
            }

            if ($(this).hasClass("goodslist-default")) {
                window.location.href = GOODLIST_DEFAULT + params;
                //              goodslistMainAjax("", 0);
            }
            if ($(this).hasClass("goodslist-sell")) {
                window.location.href = GOODLIST_SELL + params;
                //              goodslistMainAjax("", 1);
            }
            if ($(this).hasClass("goodslist-hot")) {
                window.location.href = GOODLIST_HOT + params;
                //              goodslistMainAjax("", 2);
            }
            if ($(this).hasClass("goodslist-price")) {
                window.location.href = GOODLIST_PRICE + params;
                //              goodslistMainAjax("", 4);
            }
        });
    };
    navDom();
    var asideDom = function() {

        var asidePage = document.querySelectorAll(".aside-page");
        var asideRight = document.querySelectorAll(".aside-right");
        var asideClearBtn = document.querySelector(".aside-clear-btn");
        var tSosuo = document.querySelector(".t-sosuo");
        //点击栏目弹出相对应的选项
        mui(".aside-cell-item").each(function(index, ele) {
            this.addEventListener("tap", function() {
                asidePage[index].style.display = "block";
            });
        });
        //弹框左上按钮点击隐藏
        mui(".aside-left-icon").each(function(index, ele) {
            this.addEventListener("tap", function() {
                asidePage[index].style.display = "none";
            });
        });
        //弹框确定按钮
        mui(".aside-page .mui-btn-link").each(function(index, ele) {
            this.addEventListener("tap", function() {
                var checkedInput = this.parentNode.nextElementSibling.querySelectorAll("input[type=checkbox]:checked");
                var asideP = this.parentNode.parentNode;
                var muiCell = asideP.querySelectorAll(".mui-table-view-cell");
                var asidePriceText = document.getElementById("asidePriceText");
                var minPrice = asidePriceText.querySelector(".aside-min-price");
                var maxPrice = asidePriceText.querySelector(".aside-max-price");
                var flag = true,
                    i, arrText = [],
                    arrBrand = [],
                    arrDataID = [];
                for (var i = 0; i < checkedInput.length; i++) {
                    var innerHtml = checkedInput[i].previousElementSibling.innerHTML;
                    var dataId = checkedInput[i].getAttribute("data-id");
                    arrBrand.push(innerHtml);
                    arrDataID.push(dataId);
                }
                if (arrBrand && arrBrand.length !== 0) {
                    asideRight[index].innerHTML = arrBrand.join(" ");
                }
                if (arrDataID && arrDataID.length !== 0) {
                    asideRight[index].setAttribute("data-id", arrDataID.join(","));
                }
                arrBrand = [];
                //价格页面
                if (asideP.classList.contains("aside-price")) {
                    for (i = 0; i < muiCell.length; i += 1) {
                        var item = muiCell[i];
                        if (item.classList.contains("mui-selected")) {
                            asideRight[index].innerHTML = item.firstElementChild.innerHTML;
                            flag = true;
                            break;
                        } else {
                            flag = false;
                        }
                    }
                    if (flag === false) {
                        var minVal = minPrice.value === "" ? 0 : minPrice.value;
                        var maxVal = maxPrice.value === "" ? 99999 : maxPrice.value;
                        arrText.push(minVal);
                        arrText.push(maxVal);
                        asideRight[index].innerHTML = arrText.join("-");
                    }

                }
                this.parentNode.parentNode.style.display = "none";
            });
        });
        //价格弹框事件
        mui("#asidePriceText").on("input", "input", function() {
            var muiCell = this.parentNode.previousElementSibling.querySelector(".mui-selected");
            if (muiCell) {
                muiCell.classList.remove("mui-selected");
            }
        });
        //单选价格时，清空input框
        mui(".aside-price .mui-navigate-right").each(function(index, ele) {
            this.addEventListener("tap", function() {
                var textInput = this.parentNode.parentNode.nextElementSibling.querySelectorAll("input");
                for (var i = 0; i < textInput.length; i++) {
                    textInput[i].blur();
                    textInput[i].value = '';
                }
            });
        });

        //清空按钮
        asideClearBtn.addEventListener("tap", function() {
            for (var i = 0; i < asideRight.length; i++) {
                asideRight[i].innerHTML = '不限';
            }
        });

        // 搜索
        tSosuo.addEventListener("tap", function() {
            // keyword
            var keyword = document.querySelector('.search-input').value;
            var request_url = SEARCH_KEYWORD;
            if (keyword) {
                request_url += '&keyword=' + encodeURIComponent(keyword);
            }
            var mall_types = document.getElementById('mall_type');
            if (mall_types) {
                request_url += '&mall_type=' + mall_types.value;
            }
            window.location.href = request_url;
        });
    };
    asideDom();
});
