/**
 * 查询
 */
function doQuery() {
	var queryPara={	
			noticeRange : $jQuery("#noticeRange").val(),
			createStartDate : $jQuery("#createStartDate").val(),
			createEndDate : $jQuery("#createEndDate").val(),
		};
	ECSideUtil.queryECForm("ec", queryPara, true);
}
/**
 * 新建
 */
function doAdd(){
	jQuery().openDlg({
		width : 850,
		height :600,
		modal : true,
		url : WEB_CTX_PATH + "/noticeIssueAction.do?method=doEditInit",
		title : "新建通知",
		data : {
			"actionType": "add"
		}
	});
}
/**
 * 编辑
 */
function doEdit(id){
	jQuery().openDlg({
		width : 850,
		height :600,
		modal : true,
		url : WEB_CTX_PATH + "/noticeIssueAction.do?method=doEditInit",
		title : "编辑通知",
		data : {
			"actionType": "edit",
			"noticeId":id
		}
	});
}
/**
 * 查看
 */
function doView(id){
	jQuery().openDlg({
		width : 850,
		height :580,
		modal : true,
		url : WEB_CTX_PATH + "/noticeIssueAction.do?method=doEditInit&actionType=view&noticeId="+id,
		title : "查看通知",
		data : {
			"actionType": "view",
			"noticeId":id
		}
	});
}

/**
 * 删除
 */
function doDelete(id){
	var formid = "ec";
	$jQuery().dlg_confirm("确认删除？", function() {
		var ecsideObj = ECSideUtil.getGridObj(formid);
		var url =WEB_CTX_PATH + "/noticeIssueAction.do?method=doDelete";
		var pars = "noticeId=" + id;
		ECSideUtil.doAjaxUpdate(url, pars, ecsideObj.CallBack, formid);
	});
}