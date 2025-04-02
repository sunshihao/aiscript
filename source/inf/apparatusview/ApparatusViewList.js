/**
 * 页面加载
 */
$jQuery(document).ready(function() {
	jQuery("#hiddenTr1").hide(); 
	//jQuery("#hiddenTr2").hide();
	jQuery("#belongUnit").select2({
	    data:belongUnitList,
	});
	var myDate = new Date();
	jQuery("#endPurchaseDate").val(myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate());
});
/**
 * 功能描述：重置输入框
 * 输入：
 * 输出：
 */
function doReset(){
	with(document.forms[0]){
		belongCenter.value = "";
		apparatusName.value = "";
		bookType.value = "";
		bookForm.value = "";
		apparatusState.value = "";
		startPurchaseDate.value = "1900-01-01";
		shareState.value = "1";
		//isSwingCard.value = "";
	}
	jQuery("#endPurchaseDate").val(jQuery("#endPurchaseDateHidden").val());
	$jQuery("#belongUnit").val(null).trigger("change");
}
/**
 * 更多查询条件
 */
function getMoreCondition(obj){
	jQuery(obj).text("隐藏条件");
	jQuery(obj).attr('onclick', '').unbind('click').click( function () { hiddenMoreCondition(this); });   
	jQuery("#hiddenTr1").show(); 
	jQuery("#hiddenTr2").show(); 
	return false;
}
/**
 * 隐藏条件
 * @param obj
 */
function hiddenMoreCondition(obj){
	jQuery(obj).text("更多条件");
	jQuery(obj).attr('onclick', '').unbind('click').click( function () { getMoreCondition(this); });   
	jQuery("#hiddenTr1").hide(); 
	jQuery("#hiddenTr2").hide();
	return false;
}
/**
 * 查询
 */
function doQuery() {
	var queryPara={	
			belongCenter : $jQuery("#belongCenter").val(),
			belongUnit : $jQuery("#belongUnit").val(),
			apparatusName : $jQuery("#apparatusName").val(),
			bookType : $jQuery("#bookType").val(),
			bookForm : $jQuery("#bookForm").val(),
			apparatusState : $jQuery("#apparatusState").val(),
			startPurchaseDate : $jQuery("#startPurchaseDate").val(),
			endPurchaseDate : $jQuery("#endPurchaseDate").val(),
			shareState : $jQuery("#shareState").val(),
			//isSwingCard : $jQuery("#isSwingCard").val(),
		};
	ECSideUtil.queryECForm("ec", queryPara, true);
}
/**
 * 所属中心change事件
 */
function changeBelongCenter(type) {
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