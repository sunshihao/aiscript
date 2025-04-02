$jQuery().ready(function() {
	jQuery("#belongCenter").val(belongCenter);
	jQuery("#belongUnit").val(belongUnit);
	jQuery("#sampleType").val(sampleType);
	if (belongUnit!=''&&belongUnit!=null) {
		$jQuery("#belongGroup").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=BDAMap.BELONG_GROUP" +
				"&elementName=belongGroup" + 
				"&conditions={'belongUnit': '"+ belongUnit +"','status':'0'}"
				, function(responseData){
					$jQuery("#belongGroup").prepend("<option value=''>-请选择-</option>");
					$jQuery("#functionInfoForm").initItems({initItems:responseData.result});
					jQuery("#belongGroup").val(belongGroup);
				}
				, initError);
	}
	jQuery("#belongUnit").select2({
	    data:belongUnitList,
	});
	jQuery("#sampleType").select2({
	    data:sampleTypeList,
	});
	jQuery("#elementName").val(elementName);
	// jQuery("#isSwingCard").val(isSwingCard);
	var data = "&belongCenter=" + belongCenter
	+ "&belongUnit=" + belongUnit
	+ "&belongGroup=" + belongGroup
	+"&sampleType=" + sampleType.replace(/\s/g,'')
	//+ "&isSwingCard=" + isSwingCard 
	+ "&elementName=" +elementName;
	pager(data)
});
/**
 * 功能描述：页面查询
 * 输入：
 * 输出：
 */
function doQueryInfo(){
	var data = "&belongCenter=" + $jQuery("#belongCenter").val()
		+ "&belongUnit=" + $jQuery("#belongUnit").val()
		+ "&belongGroup=" + $jQuery("#belongGroup").val()
		+"&sampleType=" + $jQuery("#sampleType").val()
		//+ "&isSwingCard=" + $jQuery("#isSwingCard").val()
		+ "&elementName=" + $jQuery("#elementName").val();
	pager(data);
}
/**
 * 功能描述：重置输入框
 * 输入：
 * 输出：
 */
function doReset(){
	$jQuery("#belongUnit").val(null).trigger("change");
	$jQuery("#belongGroup").val(null).trigger("change");
	$jQuery("#sampleType").val(null).trigger("change");
}
/**
 * 功能描述：分页查询
 * 输入：
 * 输出：
 */
function pager(data) {
	$jQuery("#pager").pager({
		url: WEB_CTX_PATH + "/functionInfoAction.do?method=doQuery",
		data:data,
		pager: '#pager',
		datatype: "json", 
		dataAction : function(msg) {
			//msg json对象
			$("#mainBody").html("");
			$.each(msg.rows, function(i, n){
				$("#hiddenMain #sampleTypeName").html(n.sampleTypeName);
				$("#hiddenMain #belongUnit").html(n.belongUnit);
	            var elementNames="";
	            if (n.elementList!=null&&n.elementList!='') {
		            $.each(n.elementList, function(j, m){
		            	elementNames=elementNames + "[<a href=\"javascript:\" onclick=\"doApparatusInfo('"+m.elementIds+"')\">"+m.elementName+"</a>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		            });
	            }
	            var htmlStr = "<div class=\"col-md-12\">"+elementNames+"</div>";
	            $("#hiddenMain	#detail").html(htmlStr);
	            $("#mainBody").append("<div id=\"row" + i + "\" class=\"panel panel-default\">" + $("#hiddenMain").html() + "</div>");
			});		
			
        }
	});
}
function doApparatusInfo(elementId) {
	var data = "&belongCenter=" + $jQuery("#belongCenter").val()
	+ "&belongUnit=" + $jQuery("#belongUnit").val()
	+ "&belongGroup=" + $jQuery("#belongGroup").val()
	+"&sampleType=" + $jQuery("#sampleType").val()
	+ "&elementName=" + $jQuery("#elementName").val()
	//+ "&isSwingCard=" + $jQuery("#isSwingCard").val()
	+ "&elementId="+elementId;
	window.location.href="apparatusInfoAction.do?method=doInit&type=1"+data;
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
 * 所属单位change事件
 */
function changeBelongUnit() {
	var belongUnit = $jQuery("#belongUnit").val();
	if (belongUnit != "" && belongUnit != null){
		// 初始化小类下拉列表
		$jQuery("#belongGroup").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=BDAMap.BELONG_GROUP" +
				"&elementName=belongGroup" + 
				"&conditions={'belongUnit': '"+ belongUnit +"','status':'0'}"
				, function(responseData){
					$jQuery("#belongGroup").prepend("<option value=''>-请选择-</option>");
					var belongGroup = [];
					jQuery.each(responseData.result.belongGroup, function(i, b){
						var array = {}
						array.id=b.code;
						array.text=b.name;
						belongGroup.push(array);
					});
					 jQuery("#belongGroup").select2({
						    data:belongGroup,
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