var api = frameElement.api;

jQuery().ready(
		function() {
			
			//委托单编辑，保存按钮显示其他按钮隐藏
			var actionType = api.data.actionType;
			jQuery("#actiontype").val(actionType);
			switchFieldStatus(actionType);
})
// 根据操作类型,设置页面元素的可编辑性
function switchFieldStatus(actionType) {

	if (actionType == "add") {

	} else if (actionType == "edit") {

	} else if (actionType == "view") {
		enableAllELements(document.getElementById('otherInfoForm'), true);
	}
}
/**
 * 页面元素只读
 * @param form_obj
 * @param is_disable
 */
function enableAllELements(form_obj, is_disable) {
	var obj = form_obj || event.srcElement;
	var count = obj.elements.length;
	for (var i = 0; i < count; i++) {
		if ("button" == obj.elements[i].type) {
			continue;
		} else {
			obj.elements[i].disabled = is_disable;
		}
	}
}
function closeWin(){
	api.close();
}
function viewPriceDetail(ordId){
	var priceUrl ="";
	//原始委托单的费用信息
	if(api.data.type=='old'){
		priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getOldPriceInfo&ordId="+ordId;
	//历史委托单的费用信息
	}else if(api.data.type=='his'){
		priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getHisPriceInfo&ordId="+ordId;
	}else{
		if(api.data.viewType == '1'){
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getPriceInfo&ordId="+ordId+"&viewType=1";
		}else{
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getPriceInfo&ordId="+ordId;
		}
	}
	jQuery().openDlg({
		width : 800,
		height : 450,
		modal : true,
		url : priceUrl,
		title : "费用明细",
		data : {
		},
		parent:api
	});
}

/**
 * 完成
 * @param id
 * @returns {Boolean}
 */
function doFinish(id,ordNo){
	var ordTotalFactFee = jQuery("#ordTotalFactFee").val();
	ajaxRequest("ordProcessManageAction.do?method=doFinishTesting", initSuccess, initError, "&ordIds=" + id + 
			"&ordNos=" + ordNo + "&ordReceiveUnits=" + api.data.ordReceiveUnit + "&ordTotalFactFee=" + ordTotalFactFee);
}

function initSuccess(data){
	if ("error" == data.result.info) {
		api.opener.$jQuery().dlg_alert("完成失败");
	} else {
		api.opener.$jQuery().dlg_alert(data.result.info, function(){
			frameElement.api.opener.ECSideUtil.reload("ec");
			//api.opener.doQuery();
			api.close();
		});
	}

}

/**
 * 功能描述：页面初始化失败回调函数
 * 输入：回调返回值
 * 输出：
 */
function initError(data) {
	$jQuery().dlg_alert("ERROR");
}

function viewFlow(){
	var ordId = jQuery("#ordId").val();
	var ordState = jQuery("#ordState").val();
	var groupKey = jQuery("#ordReceiveUnit").val();
	$jQuery().openDlg({
		width:450,
		height:300,
		url : WEB_CTX_PATH+"/ordApplyAction.do?method=getOrdOperateRecord&ordId="+ordId+"&ordState="+ordState+"&groupKey="+groupKey,
		title : "处理过程",
		data : {
		},
		parent :api
	});
}