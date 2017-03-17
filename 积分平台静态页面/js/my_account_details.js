$(function() {
    $.ajax({
        type: "get",
        url: GET_USER_INFO,
        data: {},
        cache:false, 
        ifModified :true ,
        dataType: "json",
        success: function(data) {
            AccountDetailAjax(data);
            changePic();
            changeName();
            changeSex();
        },
        error: function() {
            console.log("error");
        }
    });
    // 账户详情加载
    var AccountDetailAjax = function(data) {
        var sex;
        switch (data.sex) {
            case "0":
                sex = "女";
                break;
            case "1":
                sex = "男";
                break;
            default:
                sex = "";
                break;
        }
        if (data.head_pic && data.head_pic !== "") {
            $(".mui-icon-camera").hide();
            $(".account-detail-pic").css({
                "background-image": "url(" + data.head_pic + ")"
            });
        }
        $(".account-detail-nick").text(data.nick_name);
        $(".account-detail-sex").text(sex);
        $(".account-detail-phone").text(data.mobile);
    };

    // 修改信息接口
    var changeAccount = function(headPic, nicName, sexText, mobileId) {
        $.ajax({
            type: "get",
            url:  MODIFY_USERINFO,
            data: {
                head_pic: headPic, //用户头像地址
                nick_name: nicName, //用户昵称
                sex: sexText //用户性别(0.女  1.男)
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
            },
            error: function() {
                console.log("error");
            }
        });
    };
    // 修改头像
    var changePic = function() {
        [].slice.call(document.querySelectorAll('input[data-LUploader]')).forEach(function(el) {
            new LUploader(el, {
                url: UPLOAD_IMAGE, //post请求地址
                multiple: false, //是否一次上传多个文件 默认false
                maxsize: 1024000, //忽略压缩操作的文件体积上限 默认100kb
                accept: 'image/*', //可上传的图片类型
                quality: 0.1, //压缩比 默认0.1  范围0.1-1.0 越小压缩率越大
                showsize: false, //是否显示原始文件大小 默认false
                fn: function(data) {
                    var imgUrl = data.img;
                    changeAccount(imgUrl, "", "");
                }
            });
        });

    };
    // 修改昵称
    var changeName = function() {

        $(".info-nickname").on("tap", function() {
            $(".revise-name").show();
        });

        $(".edit-name-btn").on("tap", function() {
            var editName = $(".edit-name").val();
            if (editName !== "") {
                changeAccount("", editName, "");
                $(".revise-name").hide();
            } else {
                mui.toast("昵称不能为空！");
            }

            $(".account-detail-nick").text(editName);
        });
        $(".change-name-arrow").on("tap", function() {
            $(".revise-name").hide();
        });

    };
    // 修改性别
    var changeSex = function() {
        // 性别
        $(".info-sex").on("tap", function() {
            $(".mask-sex").show();
        });
        $(".sex-item").on("tap", function() {
            var sexText = $(this).text(),
                sexId;
            $(".account-detail-sex").text(sexText);
            switch (sexText) {
                case "男":
                    sexId = 1;
                    break;
                case "女":
                    sexId = 0;
                    break;
            }
            changeAccount("", "", sexId);
            $(".mask-sex").hide();
        });
        $(".sex-cancel-btn").on("tap", function() {
            $(".mask-sex").hide();
        });
    };
     $(".camera-area").fileUpload({
        "url": UPLOAD_IMAGE,
        "file": "file"
    });
     // 保护用户图像
     setAccountPic = function(img){
         changeAccount(img, "", "");
     };
});
