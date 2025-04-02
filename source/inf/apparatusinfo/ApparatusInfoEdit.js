var api = frameElement.api;

/**
 * 功能描述：页面初始化
 * 输入：
 * 输出：
 */
$jQuery().ready(function() {
		$jQuery("table input").attr("disabled",true);
		$jQuery("table textarea").attr("disabled",true);
		$jQuery("#close_btn").attr("disabled",false);
});
