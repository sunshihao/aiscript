var api = frameElement.api;
$jQuery(document).ready(function(){
	var ordState = api.data.ordState;
	if("03" == ordState){
		$jQuery("#infoTr").hide();
		$jQuery("#noSavebtn").hide();
	}else{
		$jQuery.ajax({
			async : false,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOrdResponse",
			type : "post",
			dataType : "text",
			data : {
				ordId : api.data.ordId,
				groupKey : api.data.groupKey
			},
			success : function(data) {
				$jQuery('#beforeResponseInfo').text("申请撤销原因："+data).css({
					"color" : 'red', 
					"font-size" : 3
				});
				$jQuery('#allResponseInfo').attr('title',data);
			},
			error : function(){
				alert("网络错误");
			}
		});
	}
	
});
/**
 * 同意撤销
 * @param req
 * @param status
 * @param error
 */
function doCancelConfirm(){
	api.opener.doCancleConfirm(api.data.ordId,api.data.groupKey,$jQuery("#respondRemark").val(),api.data.ordResponse);
	api.close();
}

/**
 * 否决撤销
 * @param req
 * @param status
 * @param error
 */
function doCancleReject(){
	var respondRemark = jQuery("#respondRemark").val();
	api.opener.doCancleReject(api.data.ordId,api.data.groupKey,respondRemark,api.data.ordResponse);
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