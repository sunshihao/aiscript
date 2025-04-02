$jQuery().ready(function() {
	if (type=='1') {
		$jQuery("#apparatusState").val('5');
		var data = "&apparatusState=" + $jQuery("#apparatusState").val();
		pager(data);
	} else {
		if (flg=='0') {
			$jQuery("#apparatusState").val('5');
		} else {
			$jQuery("#apparatusState").val('1');
		}
		pager('');
	}
	 $jQuery("#belongUnit").select2({
		    data:belongUnitList,
	 });
	
	
});

/**
 * 功能描述：页面查询
 * 输入：
 * 输出：
 */
function doQueryInfo(){
	var data = "&apparatusName=" + $jQuery("#apparatusName").val()
		+ "&bookType=" + $jQuery("#bookType").val()
		+ "&bookForm=" + $jQuery("#bookForm").val()
		+ "&belongCenter=" + $jQuery("#belongCenter").val()
		+ "&belongUnit=" + $jQuery("#belongUnit").val()
		+ "&belongGroup=" + $jQuery("#belongGroup").val()
		+ "&categoryHigh=" + $jQuery("#categoryHigh").val()
		+ "&categoryMiddle=" + $jQuery("#categoryMiddle").val()
		+ "&categorySmall=" + $jQuery("#categorySmall").val()
		+ "&apparatusState=" + $jQuery("#apparatusState").val()
		+ "&elementName=" + $jQuery("#elementName").val()
		//+ "&isSwingCard=" + $jQuery("#isSwingCard").val()
		+ "&elementId=" + $jQuery("#elementId").val();
		
	pager(data);
}
/**
 * 功能描述：分页查询
 * 输入：
 * 输出：
 */
function pager(data) {
	var url = WEB_CTX_PATH + "/apparatusInfoAction.do?method=doQuery";
	if (elementId!='null' && elementId!='') {
		url = WEB_CTX_PATH + "/apparatusInfoAction.do?method=doQuery&elementId="+elementId;
	} 
	$jQuery("#pager").pager({
		url: url,
		data:data,
		pager: '#pager',
		datatype: "json", 
		dataAction : function(msg) {
			//msg json对象
			$("#mainBody").html("");
			$.each(msg.rows, function(i, n){
				$("#hiddenMain #apparatusId").html(n.apparatusId);
	            $("#hiddenMain #apparatusName").html(n.apparatusName);
	            if (n.apparatusModel!=null&&n.apparatusModel!='') {
	            	$("#hiddenMain #apparatusModel").html("["+n.apparatusModel+"]");
	            }
	            $("#hiddenMain #bookType").html(n.bookType);
				$("#hiddenMain #bookForm").html(n.bookForm);
				console.log(n.apparatusAdmin);
	            if (n.apparatusAdmin) {
	            	$("#hiddenMain #apparatusAdmin").html(n.apparatusAdmin.replace(/,/g, "</br>"));
	            } else {
	            	 $("#hiddenMain #apparatusAdmin").html("");
	            }
	            if (n.telPhone) {
	            	$("#hiddenMain #telPhone").html(n.telPhone.replace(/,/g, "</br>"));
	            } else {
	            	 $("#hiddenMain #telPhone").html("");
	            }
	            var htmlStr = "";
	            if (n.sampleTypeList!=null&&n.sampleTypeList!='') {
	            	$.each(n.sampleTypeList, function(j, m){
		            	var elementNames = "";
		            	if (m.elementList!=null&&m.elementList!='') {
		            		$.each(m.elementList, function(j, k){
			            		elementNames=elementNames + "[<a href=\"javascript:\" onclick=\"doApparatusApply('"+n.apparatusId+"','"+n.apparatusFlow+"','"+k.elementIds+"','"+m.sampleType+"')\">"+k.elementName+"</a>]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
			            		
		            		});
		            	}
		            	htmlStr = htmlStr + "<div id=\"rowDetail" + j + "\"class=\"col-md-12\">"+m.sampleTypeName+"："+elementNames+"</div>";
		            });
	            }
	            $("#hiddenMain #detail").html(htmlStr);
	            $("#mainBody").append("<div id=\"row" + i + "\" class=\"panel panel-default\">" + $("#hiddenMain").html() + "</div>");
			});			
        }
	});
}
/**
 * 功能描述：重置输入框
 * 输入：
 * 输出：
 */
function doReset1(){
	$("#belongUnit").val(null).trigger("change");
	$("#belongGroup").val(null).trigger("change");
}
/**
 * 功能描述：打开查看窗口
 * 输入：id 主键ID
 * 输出：
 */
function doView(obj){
	var apparatusId= obj.childNodes[0].innerText;
	var pageURL = WEB_CTX_PATH + "/apparatusInfoAction.do?method=doSelectById&apparatusId="+apparatusId;
	//window.open(pageURL,"newwindow","height=360,width=440,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no");
	jQuery().openDlg({
		width : 440,
		height : 360,
		modal : true,
		url : pageURL,
		title : "查看仪器信息",
		data : {
		}
	});
}
/**
 * 仪器预约
 * @param id
 * @returns {Boolean}
 */
function doApparatusApply(id,apparatusFlow,elementId,sampleType){
	doApply(id,elementId,"info",apparatusFlow,sampleType);
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
 * 大类change事件
 */
function changeCategoryHigh() {
	var categoryHigh = $jQuery("#categoryHigh").val();
	if (categoryHigh != "" && categoryHigh != null){
		// 初始化中类下拉列表
		$jQuery("#categoryMiddle").empty();
		$jQuery("#categorySmall").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=BDAMap.CATEGORY_MIDDLE" +
				"&elementName=categoryMiddle" + 
				"&conditions={'categoryHighId': '"+ categoryHigh +"'}"
				, function(responseData){
					$jQuery("#categoryMiddle").prepend("<option value=''>-请选择-</option>");
					$jQuery("#categorySmall").prepend("<option value=''>-请选择-</option>");
					$jQuery("#apparatusInfoForm").initItems({initItems:responseData.result});
				}
				, initError);
	}
}
/**
 * 中类change事件
 */
function changeCategoryMiddle() {
	var categoryMiddle = $jQuery("#categoryMiddle").val();
	if (categoryMiddle != "" && categoryMiddle != null){
		// 初始化小类下拉列表
		$jQuery("#categorySmall").empty();
		ajaxRequest("codeNameAction.do?method=getSelectOptions&" +
				"codeType=BDAMap.CATEGORY_SMALL" +
				"&elementName=categorySmall" + 
				"&conditions={'categoryMiddleId': '"+ categoryMiddle +"'}"
				, function(responseData){
					$jQuery("#categorySmall").prepend("<option value=''>-请选择-</option>");
					$jQuery("#apparatusInfoForm").initItems({initItems:responseData.result});
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
function doBack(){
	var data = "&belongCenter=" + $jQuery("#belongCenterHidden").val()
	+ "&belongUnit=" + $jQuery("#belongUnitHidden").val()
	+ "&belongGroup=" + $jQuery("#belongGroupHidden").val()
	+"&sampleType=" + $jQuery("#sampleTypeHidden").val()
	+ "&elementName=" + $jQuery("#elementNameHidden").val()
	+ "&isSwingCard=" + $jQuery("#isSwingCardHidden").val() ;
	window.location.href=WEB_CTX_PATH + "/functionInfoAction.do?method=doInit"+data;
}