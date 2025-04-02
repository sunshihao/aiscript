/**
 * 页面加载
 */
$jQuery(document).ready(function() {
	jQuery("#orgId").select2({
	    data:belongUnitList,
	});
});
/**
 * 查询
 */
function doQuery() {
	var queryPara={	
			center : $jQuery("#center").val(),
			orgId : $jQuery("#orgId").val(),
			apparatusName : $jQuery("#apparatusName").val(),
			state : $jQuery("#state").val() ,
			//isSwingCard : $jQuery("#isSwingCard").val() ,
		};
	ECSideUtil.queryECForm("ec", queryPara, true);
}
/**
 * 功能描述：重置输入框
 * 输入：
 * 输出：
 */
function doReset(){
	$jQuery("#orgId").val(null).trigger("change");
}
/**
 * 功能描述：查询预约信息
 * 输入：id 主键ID
 * 输出：
 */
function getOrdApplyList(id){
	$jQuery().openDlg({
		 width: 1200,
		 height: 450,
		 modal: true,
		 url: WEB_CTX_PATH + "/apparatusOnlineAction.do?method=getapplyInfo&apparatusId="+id,
		 title: "查询预约信息",
		 data: {
		 }
	});
}
/**
 * 所属中心change事件
 */
function changeBelongCenter(type) {
	if (type=='-1') {
		return false;
	}
	var belongCenter = $jQuery("#center").val();
	if (belongCenter != "" && belongCenter != null){
		// 初始化中类下拉列表
		$jQuery("#belongUnit").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=InfMap.BELONG_UNIT" +
				"&elementName=orgId" + 
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
				"&elementName=orgId" + 
				"&conditions={'belongCenter': '"+ orgId +"'}"
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