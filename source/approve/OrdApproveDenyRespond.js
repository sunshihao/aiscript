var api = frameElement.api;
function doConfirm(flag){
	//获取此次驳回意见
	var respondRemark = jQuery("#respondRemark").val();
	api.opener.getDenyResponse(respondRemark,flag);
	api.close();
	
}
/**
 * 页面初始化失败回调函数
 * @param req
 * @param status
 * @param error
 */
function initError(req, status, error){
	alert(status||error);
}
function closeWin(){
	api.close();
}