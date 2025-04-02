var api = frameElement.api;
/**
 * 页面加载
 */
$jQuery(document).ready(function() {
});
function doPrint(ordId,ordState,groupKey){
	var url=WEB_CTX_PATH+"/ordApproveAction.do?method=getApplyPrintInfo&ordId="+ordId+"&ordState="+ordState+"&groupKey="+groupKey;
	jQuery().openDlg({
		width : 760,
		height : 800,
		modal : true,
		url : url,
		title : "委托单打印",
		data : {
		},parent:api
	});
}