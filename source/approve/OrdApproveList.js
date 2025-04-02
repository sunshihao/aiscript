$jQuery(document).ready(function(){
	$jQuery("#hiddenTr1").hide();
	$jQuery("#ordState").val("00");
	
	var belongUnit = [];
	 var belongUnit1 = belongUnitMap.substr(1,belongUnitMap.length-2).split(",");
	 jQuery.each(belongUnit1, function(i, b){
		var belongUnit2 = b.split("=");
		var array = {};
		if (belongUnit2.length > 1) {
			array.id=jQuery.trim(belongUnit2[0]);
			array.text=belongUnit2[1];
			belongUnit.push(array);
		}
	 });
	 jQuery("#ordConsignUnit").select2({
		    data:belongUnit
	 });
});
/**
 * 查询委托单
 */
function doQuery(){
//	var param = $jQuery("#ordApproveForm").formSerialize();
	var ordNo = $jQuery("#ordNo").val();
	var apparatusName = $jQuery("#apparatusName").val();
	var ordState = $jQuery("#ordState").val();
	var ordApplyBy = $jQuery("#ordApplyBy").val();
	var startTime = $jQuery("#startTime").val();
	var endTime = $jQuery("#endTime").val();
	var ordConsignUnit = $jQuery("#ordConsignUnit").val();
	var ordConsignGroup = $jQuery("#ordConsignGroup").val();
	var ordPaystate = $jQuery("#ordPaystate").val();
	var ordReceiveName = $jQuery("#ordReceiveName").val();
	
	var param = "ordNo="+ordNo+"&apparatusName="+apparatusName
	            +"&ordState="+ordState+"&ordApplyBy="+ordApplyBy
	            +"&startTime="+startTime+"&endTime="+endTime
	            +"&ordConsignUnit="+ordConsignUnit+"&ordConsignGroup="+ordConsignGroup
	            +"&ordPaystate="+ordPaystate+"&ordReceiveName="+ordReceiveName;
	ECSideUtil.queryECForm("ec", param, true);
}
/**
 * 委托单审核
 * @param id
 */
function doApprove(ordId,ordModelType,groupKey){	
	if(ordModelType=='1'){
		jQuery().openDlg({
			width : 900,
			height : 500,
			modal : true,
			url : WEB_CTX_PATH + "/ordProductAction.do?method=getOrdProductInfo&ordId="+ordId+"&actionType=03"+"&groupKey="+groupKey,
			title : "机加工委托单审核",
			data : {
				"actionType" :'03',
				"ordId" :ordId,
				
			}
		});
	}else if(ordModelType=='2'){
		jQuery().openDlg({
			width : 900,
			height : 550,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOrdApplyInfo&ordId="+ordId+"&ordModelType="+ordModelType+"&actionType=03"+"&groupKey="+groupKey,
			title : "快速预约审核",
			data : {
				"actionType" :'03',
				"ordId" : ordId
			}
		});
	}else{
		jQuery().openDlg({
			width : 910,
			height : 650,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOrdApplyInfo&ordId="+ordId+"&ordModelType="+ordModelType+"&groupKey="+groupKey,
			title : "委托单审核",
			data : {
				"ordId" :ordId,
				"groupKey" : groupKey
			}
		});
	}
	
	
}
/**
 * 委托单编辑
 * @param id
 */
function doEdit(ordId,ordModelType,actionType,groupKey){	
	if(ordModelType=='1'){
		jQuery().openDlg({
			width : 900,
			height : 500,
			modal : true,
			url : WEB_CTX_PATH + "/ordProductAction.do?method=getOrdProductInfo&ordId="+ordId+"&actionType=edit"+"&groupKey="+groupKey,
			title : "机加工委托单审核",
			data : {
				"actionType" :'edit'
			}
		});
	}else if(ordModelType=='2'){
		jQuery().openDlg({
			width : 900,
			height : 550,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOrdApplyInfo&ordId="+ordId+"&ordModelType="+ordModelType+"&actionType=edit"+"&groupKey="+groupKey,
			title : "快速预约编辑",
			data : {
				"actionType" :'edit',
				"ordId" : ordId
			}
		});
	}else{
		jQuery().openDlg({
			width : 910,
			height : 650,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOrdApplyInfo&ordId="+ordId+"&ordModelType="+ordModelType+"&actionType="+actionType+"&groupKey="+groupKey,
			title : "委托单编辑",
			data : {
				"actionType" : actionType,
				"ordId" : ordId
			}
		});
	}
	
}

/**
 * 更多查询条件
 */
function getMoreCondition(obj){
	jQuery(obj).html("隐藏条件<span class='glyphicon glyphicon-menu-up'>");
	jQuery(obj).attr('onclick', '').unbind('click').click( function () { hiddenMoreCondition(this); });   

	jQuery("#hiddenTr1").show(); 
}
/**
 * 隐藏条件
 * @param obj
 */
function hiddenMoreCondition(obj){
	jQuery(obj).html("更多条件<span class='glyphicon glyphicon-menu-down'>");

	jQuery(obj).attr('onclick', '').unbind('click').click( function () { getMoreCondition(this); });   

	jQuery("#hiddenTr1").hide(); 
}
/**
 * 中心change事件
 */
function belongCenterChange() {
	var belongCenter = $jQuery("#belongCenter").val();
	if (belongCenter != ""){
		// 初始化下拉列表
		ajaxRequest("ordApplyAction.do?method=getSelectOptions&" +
				"conditions={'belongCenter': '"+ belongCenter +"'}"
				, function(responseData){
					$jQuery("#belongUnit option").remove();
					$jQuery("#belongUnit").prepend("<option value=''>-请选择-</option>");
					$jQuery("#ordApplyForm").initItems({initItems:responseData.result});
				}
				, initError);
	}
}
function initError(req, status, error){
	$jQuery().dlg_alert(status||error);
}
/**
 * 委托单付款
 * @param ordId
 */
function doPayForApply(ordId,ordPaystate,groupKey,ordState){
	formid = "ec";
	var ecsideObj=ECSideUtil.getGridObj(formid);
	var url = "ordApproveAction.do?method=doPayForApply";
	pars = "ordId=" + ordId+"&ordPaystate="+ordPaystate+"&groupKey="+groupKey+"&ordState="+ordState;
	ECSideUtil.doAjaxUpdate(url, pars, ecsideObj.CallBack, formid);
}
/**
 * 查询原始委托单
 * @param ordId
 * @param ordModelType
 */
function getOldApply(ordId,ordModelType,groupKey){
	if(ordModelType=='1'){
		jQuery().openDlg({
			width : 850,
			height : 450,
			modal : true,
			url : WEB_CTX_PATH + "/ordProductAction.do?method=getOldOrdProductInfo&ordId="+ordId+"&actionType=view"+"&groupKey="+groupKey,
			title : "机加工原始委托单",
			data : {
				"actionType" :'view',
				"type" : 'old'
			}
		});
	}else{
		jQuery().openDlg({
			width : 900,
			height : 650,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getOldOrdApplyDetail&ordId="+ordId+"&ordModelType="+ordModelType+"&groupKey="+groupKey,
			title : "原始委托单",
			data : {
				"actionType" :'view',
				"type" : 'old'
			}
		});
	}
}
/**
 * 任务单分配
 */
function doDispatchTask(ordId,groupKey){
	jQuery().openDlg({
		width : 800,
		height : 450,
		modal : true,
		url : WEB_CTX_PATH + "/ordTaskAction.do?method=getOrdTask&ordId="+ordId+"&groupKey="+groupKey,
		title : "任务单查询",
		data : {
			"ordId" : ordId,
			"groupKey" : groupKey
		}
	});
//	var url = WEB_CTX_PATH + "/ordTaskAction.do?method=getOrdTask&ordId="+ordId;
//	window.location.href=url;  
	
}

/**
 * 撤销
 */
function doCancleDlg(ordId,groupKey,ordState,obj){
	var rowObject = jQuery(obj).parent().parent();
	var ordResponse = rowObject.find("input[name='ordResponse']").val();
	var width = 420;
	var height = 170;
	if('03' != ordState){
		width = 420;
		height = 200;
	}
	jQuery().openDlg({
		width : width,
		height : height,
		modal : true,
		url : WEB_CTX_PATH + "/sams/ord/approve/CancelRespond.jsp",
		title : "是否同意撤销？",
		data : {
			ordId : ordId,
			groupKey : groupKey,
			ordState : ordState,
			ordResponse : ordResponse
		}
	});
	
}

/**
 * 撤销确认
 */
function doCancleConfirm(ordId,groupKey,newResponse,ordResponse){
	formid = "ec";
	var ecsideObj=ECSideUtil.getGridObj(formid);
	var url = "ordApproveAction.do?method=doCancleApply";
	pars = encodeURI("ordId=" + ordId+"&groupKey="+groupKey+"&newResponse="+newResponse+"&ordResponse="+ordResponse);
	ECSideUtil.doAjaxUpdate(url, pars, ecsideObj.CallBack, formid);
}

/**
 * 撤销否决
 */
function doCancleReject(ordId,groupKey,respondRemark,ordResponse){
	formid = "ec";
	var ecsideObj=ECSideUtil.getGridObj(formid);
	var url = "ordApproveAction.do?method=doCancleReject";
	pars = "ordId=" + ordId+"&groupKey="+groupKey+"&respondRemark="+respondRemark+"&ordResponse="+ordResponse;
	ECSideUtil.doAjaxUpdate(url, pars, ecsideObj.CallBack, formid);
}

/**
 * 机加工委托单完成
 */
function doComplete(ordId,ordModelType,groupKey){
	
	jQuery().openDlg({
		width : 900,
		height : 450,
		modal : true,
		url : WEB_CTX_PATH + "/ordProductAction.do?method=getOrdProductComplete&ordId="+ordId+"&groupKey="+groupKey,
		title : "任务单明细",
		data : {
			"ordId" : ordId
		}
	});
}
/**
 * 委托单打印
 */
function doPrint(ordId,ordState,groupKey){
	var url=WEB_CTX_PATH + "/ordApproveAction.do?method=getApplyPrintInfo&ordId="+ordId+"&ordState="+ordState+"&groupKey="+groupKey;
	//window.open (url, 'newwindow', 'height=800, width=760, top=0, left=0, toolbar=no, menubar=no, scrollbars=yes,resizable=yes,location=no, status=no');
	jQuery().openDlg({
		width : 780,
		height : 800,
		modal : true,
		url : url,
		title : "委托单打印",
		data : {
		}
	});
}

//检测记录
function doEditTestRecord(ordId,ordNo,ordReceiveUnit,ordState){
	var url = "";
	if("09" == ordState || "10" == ordState){
		url = WEB_CTX_PATH + "/ordProcessManageAction.do?method=doQueryHisWorkLog&ordNo=" + ordNo+"&ordReceiveUnit="+ordReceiveUnit + "&type=1";
	}else{
		url = WEB_CTX_PATH + "/ordProcessManageAction.do?method=doQueryWorkLog&ordNo=" + ordNo+"&ordReceiveUnit="+ordReceiveUnit + "&type=1";
	}
	jQuery().openDlg({
		width : 850,
		height : 450,
		modal : true,
		url : url,
		title : "检测记录",
		data : {
			"actionType" : "testRecord",
			"type" : 1,
			"ordId" : ordId
		}
	});
}
function getGroup(obj){
	ajaxRequest("ordApproveAction.do?method=getSelectOptions&" +
			"conditions={'ordConsignUnit': '"+ jQuery(obj).val() +"'}"
			, function(responseData){
				var arrayList = [];
				$jQuery("#ordConsignGroup option").remove();
				$jQuery("#ordConsignGroup").prepend("<option value=''>-请选择-</option>");
				var ordConsignGroupList = responseData.result.ordConsignGroup;
				jQuery.each(ordConsignGroupList, function(i, b){
					var array = {}
					array.id=b.code;
					array.text=b.name;
					arrayList.push(array);
				 });
				jQuery("#ordConsignGroup").select2({
				    data:arrayList
			 });
			}
			, initError);
}

/**
 * 查询原始委托单
 * @param ordId
 * @param ordModelType
 */
function getHisApply(ordId,ordModelType,groupKey){
	if(ordModelType=='1'){
		jQuery().openDlg({
			width : 850,
			height : 450,
			modal : true,
			url : WEB_CTX_PATH + "/ordProductAction.do?method=getHisOrdProductInfo&ordId="+ordId+"&actionType=view"+"&groupKey="+groupKey,
			title : "机加工委托单信息",
			data : {
				"actionType" :'view',
				"type" : 'his'
			}
		});
	}else{
		jQuery().openDlg({
			width : 900,
			height : 650,
			modal : true,
			url : WEB_CTX_PATH + "/ordApproveAction.do?method=getHisOrdApplyDetail&ordId="+ordId+"&ordModelType="+ordModelType+"&viewType=2"+"&groupKey="+groupKey,
			title : "委托单信息",
			data : {
				"actionType" :'view',
				"type" : 'his',
				"viewType" : 2
			}
		});
	}
}

/**
 * 批量审核通过
 * @param 
 * @param 
 */
function doApproveBatchPass(){
	formid = "ec";
	var paramIds = getCheckeds(formid,"checkboxID");
	
	if(paramIds.length < 1){
		jQuery().dlg_alert("请选择需要审核的委托单！");
		return;
	}
	if(!jQuery().dlg_confirm("确认批量审核通过？",
			function(){
				var ecsideObj=ECSideUtil.getGridObj(formid);
		
				var url = "ordApproveAction.do?method=doApproveBatchPass";
				pars = "paramIds="+ paramIds;
				ECSideUtil.doAjaxUpdate(url, pars, ecsideObj.CallBack, formid);		
			})
	){
		return;
	}
	
}

/**
 * 重置
 * @param id
 */
function doReset(){
	$jQuery("#ordNo").val('');
	$jQuery("#ordConsignUnit").val('').trigger("change");
	$jQuery("#ordConsignGroup").val('').trigger("change");
	$jQuery("#apparatusName").val('');
	$jQuery("#ordState").val('00');
	$jQuery("#ordApplyBy").val('');
	$jQuery("#startTime").val('');
	$jQuery("#endTime").val('');
	$jQuery("#ordPaystate").val('');
}


