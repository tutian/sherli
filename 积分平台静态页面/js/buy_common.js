$(function(){
	$(".mui-control-item").on("tap", function() {
        $(this).find("span").addClass("active").parent().siblings(".mui-control-item").find("span").removeClass("active");
    });
});