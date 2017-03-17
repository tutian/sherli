(function($) {

    var deceleration = mui.os.ios ? 0.003 : 0.0009;
    var flag=false;
    // $('.oLevel-scroll-wrapper').scroll({
    //     bounce: false,
    //     indicators: true, //是否显示滚动条
    //     deceleration: deceleration
    // });
    var createFragment = function(data) {
        var ul = document.querySelector('.my-jiazu-main');
        var fragment = document.createDocumentFragment();
        var li, i;
        var len = data.first_member.length;
        for (i = 0; i < len; i++) {
            var item = data.first_member[i];
            var myFamilyHtml = "";
            li = document.createElement('li');
            li.className = 'mui-table-view-cell mui-media';
            myFamilyHtml += '<div class="i-m-img"><img src="' + item.head_pic + '"></div>';
            myFamilyHtml += '<div class="mui-media-bodys list1 ovf-h">';
            myFamilyHtml += '<span class="m-name f-fl">' + item.member_name + '</span>';
            myFamilyHtml += '<span class="mui-ellipsis f-fr">累计返佣：<i class="c-purple">' + item.rake_back + '</i></span>';
            myFamilyHtml += '</div>';
            myFamilyHtml += '<div class="mui-media-bodys list2 ovf-h">';
            myFamilyHtml += '<span class="m-name f-fl">推广人：' + item.promoter_name + '</span>';
            myFamilyHtml += '<i class="mui-ellipsis f-fr">绑定时间：' + item.bind_time + '</i>';
            myFamilyHtml += '</div>';
            li.innerHTML = myFamilyHtml;
            fragment.appendChild(li);
        }
        ul.appendChild(fragment);
    };
    var myFamily = function(_p,_this) {
        var m = 0;
        $.ajax({
            type: "get",
            url: "/index.php?con=ajax&act=get_families",
            data: {
                class: m,
                page: _p,
                page_num: 10
            },
            dataType: "json",
            success: function(data) {
                createFragment(data, 10);
                if (data.first_member.length < 10) {
                    flag = true;
                }
                _this.endPullupToRefresh(flag);
            },
            error: function() {
                mui.alert("数据加载失败,请重新加载！");
            }
        });
    };
    var _p = 1;
    if (_flag === true) {
        mui.init({
            pullRefresh: {
                container: '.oLevel-scroll-wrapper',
                up: {
                    contentrefresh: "正在加载...",
                    contentnomore: '没有更多成员了',
                    callback: function() {
                        var _this = this;
                        setTimeout(function() {
                            myFamily(_p, _this);
                            _p++;

                        }, 1000);
                    }
                }
            }
        });
    }

})(mui);
