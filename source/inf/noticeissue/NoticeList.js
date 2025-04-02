function doView(id){
	jQuery().openDlg({
		width : 850,
		height :550,
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