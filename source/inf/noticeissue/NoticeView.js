/**
 * 初始化
 */
jQuery().ready(function() {
	// 工具栏为自定义类型
	CKEDITOR.replace('ckEditor', {
		language : 'zh-cn',
		width : '650',
		height : '300',
		toolbar : 'Full'
	});
	var ckEditor = CKEDITOR.instances.ckEditor;
	if ($jQuery("#noticeContent").val() == null || $jQuery("#noticeContent").val() == '') {
		ckEditor.setData("");
	} else {
		ckEditor.setData($jQuery("#noticeContent").val());
	}
	$jQuery("table input").attr("disabled",true);
	$jQuery("#noticeRange").attr("disabled",true);
	$jQuery("table textarea").attr("disabled",true);
	$jQuery("table select").attr("disabled",true);
});