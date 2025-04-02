/**
 * 页面加载
 */
$jQuery(document).ready(function() {
	jQuery("#belongUnit").select2({
	    data:belongUnitList,
	});
	getTotalInfo();
});
/**
 * 功能描述：重置输入框
 * 输入：
 * 输出：
 */
function doReset(){
	with(document.forms[0]){
		belongCenter.value = "";
		apparatusState.value = "";
		//isSwingCard.value = "";
	}
	$jQuery("#belongUnit").val(null).trigger("change");
	$jQuery("#shareState").val("1");
}
/**
 * 查询
 */
function doQuery() {
	getTotalInfo();
	var queryPara={	
			belongCenter : $jQuery("#belongCenter").val(),
			belongUnit : $jQuery("#belongUnit").val(),
			apparatusState : $jQuery("#apparatusState").val(),
			shareState : $jQuery("#shareState").val() ,
			//isSwingCard : $jQuery("#isSwingCard").val() ,
		};
	ECSideUtil.queryECForm("ec", queryPara, true);
}
function getTotalInfo() {
	var para = "belongCenter=" + $jQuery("#belongCenter").val()
				+"&belongUnit="+ $jQuery("#belongUnit").val()
				+"&apparatusState=" + $jQuery("#apparatusState").val()
				//+"&isSwingCard=" + $jQuery("#isSwingCard").val()
				+"&shareState=" + $jQuery("#shareState").val();
	ajaxRequest("unitViewAction.do?method=getTotalInfo", initSuccess,
			initError, para);
}
/**
 * 功能描述：页面初始化成功回调方法
 * 输入：回调返回值
 * 输出：
 */
function initSuccess(data) {
	$jQuery("#totalApp").val(data.totalApp);
	$jQuery("#totalMoney").val(data.totalMoney);
	$jQuery("#totalUsers").val(data.totalUsers);
}
/**
 * 所属中心change事件
 */
function changeBelongCenter() {
	var belongCenter = $jQuery("#belongCenter").val();
	if (belongCenter != "" && belongCenter != null){
		// 初始化中类下拉列表
		$jQuery("#belongUnit").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=InfMap.BELONG_UNIT" +
				"&elementName=belongUnit" + 
				"&conditions={'belongCenter': '"+ belongCenter +"'}"
				, function(responseData){
					$jQuery("#belongUnit").prepend("<option value=''>-请选择-</option>");
					var belongUnit = [];
					jQuery.each(responseData.result.belongUnit, function(i, b){
						var array = {}
						array.id=b.code;
						array.text=b.name;
						belongUnit.push(array);
					});
					 jQuery("#belongUnit").select2({
						    data:belongUnit,
					 });
				}
				, initError);
	} else {
		$jQuery("#belongUnit").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=InfMap.BELONG_UNIT" +
				"&elementName=belongUnit" + 
				"&conditions={'belongUnit': '"+ orgId +"'}"
				, function(responseData){
					$jQuery("#belongUnit").prepend("<option value=''>-请选择-</option>");
					var belongUnit = [];
					jQuery.each(responseData.result.belongUnit, function(i, b){
						var array = {}
						array.id=b.code;
						array.text=b.name;
						belongUnit.push(array);
					});
					 jQuery("#belongUnit").select2({
						    data:belongUnit,
					 });
				}
				, initError);
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