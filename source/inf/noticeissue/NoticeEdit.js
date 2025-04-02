var api = frameElement.api;
/**
 * 初始化
 */
jQuery().ready(
		function() {
			// 工具栏为自定义类型
			CKEDITOR.replace('ckEditor', {
				language : 'zh-cn',
				width : '650',
				height : '280',
				toolbar : 'Full'
			});
			// 输入有效性验证
			$jQuery("#noticeEditForm").validate({
				rules : {
					noticeTitle : {
						required : true
					},
					noticeStartDate : {
						required : true
					},
					noticeEndDate : {
						required : true
					},
					noticeRange : {
						required : true
					},
					priorityLevel : {
						selectNone : true
					},
					noticeEndDate: {
						required: true,
						dateCompare : '#noticeStartDate'
					} 
				},messages : {
					noticeEndDate :{
						dateCompare : "结束日期必须大于等于开始日期"
					}
				}
			});
			var actionType = api.data.actionType;

			if (actionType == "add") {
			} else if (actionType == "edit") {
				ajaxRequest(
						"noticeIssueAction.do?method=doEdit&actionType=edit",
						initSuccess, initError,
						"noticeId=" + api.data.noticeId, false);
			}
		});
function initSuccess(data) {
	var ckEditor = CKEDITOR.instances.ckEditor;
	if (data.result.noticeContent == null) {
		ckEditor.setData("");
	} else {
		ckEditor.setData(data.result.noticeContent);
	}
	$jQuery("#noticeEditForm").initForm({
		data : data.result
	});
}

function initError() {
	jQuery().dlg_alert("Error");
}
/**
 * 保存
 */
function doSave() {
	var ckEditor = CKEDITOR.instances.ckEditor;
	$jQuery("#noticeContent").val(ckEditor.getData());
	$jQuery("#ckEditor").val(ckEditor.getData());
	// 非空验证
	if (!$jQuery("#noticeEditForm").valid()) {
		return false;
	}
	if (ckEditor.getData() == "") {
		api.opener.jQuery().dlg_alert("通知内容不能为空!");
		return false;
	}
	$jQuery('#noticeEditForm').ajaxSubmit({
		data : {
			actionType : api.data.actionType
		},
		dataType : 'json',
		success : doSuccess,
		error : doError,
		beforeSend : function(xhr) {
			xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");
		}
	});
}
/**
 * 功能描述：保存成功回调 输入：回调返回值 输出：
 */
function doSuccess(data) {
	if ("success" == data.result.info) {
		api.opener.jQuery().dlg_alert("保存成功", function() {
			frameElement.api.opener.doQuery();
			frameElement.api.close();
		});
	} else {
		api.opener.jQuery().dlg_alert(data.result.info);
	}
}

/**
 * 功能描述：保存失败回调 输入：回调返回值 输出：
 */
function doError() {
	api.opener.jQuery().dlg_alert("Error");
}

/**
 * 关闭
 */
function doClose() {
	var api = frameElement.api;
	api.close();
}