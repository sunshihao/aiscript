var api = frameElement.api;
jQuery().ready(
		function() {
			var applyFlag = $jQuery("#applyFlag").val();
			if(applyFlag == "1"){
				$jQuery("#ordConsignName").bind("click",function(){
					doSelectApplyPerson();
				});
			}
			var consumList = $jQuery("#consumList").val();
			if("[]" == consumList){
				jQuery("#consumablesInfo").css("display", "none");
			}else{
				jQuery("#consumablesInfo").css("display", "block");
			}
			changeTestType();
			$jQuery("#ordApplyForm").validate({
				rules : {
					ordSampleno :{
						required : true,
						maxlength : 200
					},
					ordSamplenum : {
						required : true,
						numberN : 10,
						maxlength: 10
					},
					ordTestType :{
						required :true,
					},
					ordTestTypeRemark :{
						required :true,
					},
					ordSampledescribe : {
						maxlength:256
					},
					predictFlow :{
						required :true,
						float:[10,2]
					},
					ordFinishtime :{
						required : true,
						dateCompare : '#ordSendsampleTime'
					},
					ordSendsampleTime :{
						required : true
					}
				},messages : {
					ordFinishtime :{
						dateCompare : "完成时间必须大于等于送样时间"
					}
				}
			});
	
			var trObj = jQuery("#ectable_table tbody tr");
			var tdObj = trObj.children().attr('ondblclick', '').unbind('ondblclick');
			
			var trConsuObj = jQuery("#ectableConsu_table tbody tr");
			var trConsuObj = trConsuObj.children().attr('ondblclick', '').unbind('ondblclick');

			//委托单编辑，保存按钮显示其他按钮隐藏
			var actionType = api.data.actionType;
			jQuery("#actiontype").val(actionType);
			if(actionType == 'edit' || actionType == 'copy'){
				jQuery("#savebtn").css("display", "block");
				jQuery("#approveBtn").css("display", "none");
				jQuery("#rejectbtn").css("display", "none");
				jQuery("#denyBtn").css("display", "none");
			}
			
			if('copy' == actionType){
				$jQuery("#ordResponse").val('');
				calculateTotalFee();
			}
		})
/**
 * 打开选择仪器页面
 */
function doOpenAddAppar(){
	var apparIds = jQuery("#apparIds").val();
	jQuery().openDlg({
		width : 910,
		height : 550,
		modal : true,
		url : WEB_CTX_PATH + "/ordApplyAction.do?method=getApparatusPopup",
		title : "预约仪器",
		data :{
			"apparIds" :apparIds
		},
		parent :api
	});
}

//删除仪器
function doDeleAppar(obj,id,name){
	var tdNum = jQuery("#apparaTable td").size();
	if(tdNum == 2){
		alert("至少选择一个仪器");
		return false;
	}
	
	$jQuery().dlg_confirm("删除仪器后检测项目及标准需要重新输入，确认删除吗？",function(){
		//获取table有几列
		var tdNum = jQuery("#apparaTable td").size();
		if(tdNum==2){
			alert("至少选择一个仪器");
			return false;
		}else{
			//获取当前列
			var td = jQuery(obj).parent();
			//获取当前行有几列
			var num = td.parent().find("td").size();
			//如果只剩一列，将所在行删除；否则删除该列和上一列
			if(num == 1){
				td.parent().remove();
				td.remove();
			}else{
				td.prev().remove();
				td.remove();
			}
		}
		//从仪器列表中删除仪器
		deleteFromApparList(id,name);
		
		//删除耗材信息
		deleConsumeables(id);
	})
	
	
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
function doSave(flag){
	if($jQuery("#ordApplyForm").valid()){
		if($jQuery("#otherInfoForm").valid()){
			//检测项目及标准校验
			if(validEctable()){
				//耗材信息校验
				if(ectableConsuCheck()){
					var actionType = jQuery("#actionType").val();
					var apparStr = jQuery("#apparStr").val();
					var ordId = jQuery("#ordId").val();
					var ordNo = jQuery("#ordNo").val();
					var ordSampleno = jQuery("#ordSampleno").val();
					var ordSamplenum = jQuery("#ordSamplenum").val();
					var ordTestType = jQuery("#ordTestType").val();
					var ordTestTypeRemark = jQuery("#ordTestTypeRemark").val();
					var ordTaskSampledispose = jQuery("#ordTaskSampledispose").val();
					var ordSendsampleTime = jQuery("#ordSendsampleTime").val();
					var ordFinishtime = jQuery("#ordFinishtime").val();
					var ordPaystate = jQuery("#ordPaystate").val();
					var ordSampleform = jQuery("#ordSampleform").val();
					var ordState = jQuery("#ordState").val();
					var predictFlow = jQuery("#predictFlow").val();
					var ordSampledescribe = jQuery("#ordSampledescribe").val();
					
					var ordReceiveUnit = jQuery("#ordReceiveUnit").val();
					var ordReceiveGroup = jQuery("#ordReceiveGroup").val();
					var ordReceiveBy = jQuery("#ordReceiveBy").val();
					var ordReceivePhone = jQuery("#ordReceivePhone").val();
					var ordReceiveEmail = jQuery("#ordReceiveEmail").val();
					
					var ordConsignUnit = jQuery("#ordConsignUnit").val();
					var ordConsignGroup = jQuery("#ordConsignGroup").val();
					var ordConsignBy = jQuery("#ordConsignBy").val();
					var ordConsignPhone = jQuery("#ordConsignPhone").val();
					var ordConsignEmail = jQuery("#ordConsignEmail").val();
					var ordApplyBy = jQuery("#ordApplyBy").val();
					var ordApplyPhone = jQuery("#ordApplyPhone").val();
					var ordApplyEmail = jQuery("#ordApplyEmail").val();
					var ordSubjectId = jQuery("#ordSubjectId").val();
					var remark = jQuery("#remark").val();
					var ordResponse = jQuery("#ordResponse").val();
					var ordPrintDetail="";
					if(jQuery("#ordPrintDetail").is(":checked")){
						ordPrintDetail='1';
					}else{
						ordPrintDetail='0';
					}
					var ordPrintRespond="";
					if(jQuery("#ordPrintRespond").is(":checked")){
						ordPrintRespond='1';
					}else{
						ordPrintRespond='0';
					}
					
					if(actionType == 'copy'){
						var consuablesInfo = getTableAllRows("ectableConsu"); 
						var itemStandardInfo = getTableAllRows("ectable");;
					}else{
						var consuablesInfo="";
						var obj = jQuery("#consumablesInfo").attr("style");
						if(typeof(obj) != "undefined"){
							//consuablesInfo = ECSideUtil.generateJson("ectableConsu","update");
							consuablesInfo = getTableAllRows("ectableConsu");
						}
						var itemStandardInfo = getTableAllRows("ectable");
					}
					
					ordTestFee = jQuery("#ordTestFee").val();
					ordPrecopeFee = jQuery("#ordPrecopeFee").val();
					ordConsumablesFee = jQuery("#ordConsumablesFee").val();
					ordTotalFee = jQuery("#ordTotalFee").val();
					
					var ordActualFee = jQuery("#ordActualFee").val();
					var createBy = jQuery("#createBy").val();
					
					$jQuery("#ordApplyForm").ajaxSubmit({
						target : "#ordApplyForm",
						url : WEB_CTX_PATH + "/ordApplyAction.do?method=doSavaItemApply",
						dataType : 'json',
						method : 'POST',
						data:{
							"actionType" : actionType,
							"apparStr" : apparStr,
							"ordId" : ordId,
							"ordNo" : ordNo,
							"ordSampleno" : ordSampleno,
							"ordSamplenum" : ordSamplenum,
							"ordTestType" : ordTestType,
							"ordTestTypeRemark" : ordTestTypeRemark,
							"ordTaskSampledispose" : ordTaskSampledispose,
							"ordSendsampleTime" : ordSendsampleTime,
							"ordFinishtime" : ordFinishtime,
							"ordPaystate" : ordPaystate,
							"ordSampleform" : ordSampleform,
							"ordState" : ordState,
							"predictFlow" : predictFlow,
							"ordSampledescribe" : ordSampledescribe,
							"ordReceiveUnit" : ordReceiveUnit,
							"ordReceiveGroup" : ordReceiveGroup,
							"ordReceiveBy" : ordReceiveBy,
							"ordReceivePhone" : ordReceivePhone,
							"ordReceiveEmail" : ordReceiveEmail,
							"ordConsignUnit" : ordConsignUnit,
							"ordConsignGroup" : ordConsignGroup,
							"ordConsignBy" : ordConsignBy,
							"ordApplyBy" : ordApplyBy,
							"ordApplyPhone" : ordApplyPhone,
							"ordApplyEmail" : ordApplyEmail,
							"ordSubjectId" : ordSubjectId,
							"remark" : remark,
							"consuablesInfo" : consuablesInfo,
							"itemStandardInfo" : itemStandardInfo,
							"ordResponse" : ordResponse,
							"ordPrintRespond" :ordPrintRespond,
							"ordPrintDetail" :ordPrintDetail,
							"ordTestFee" : ordTestFee,
							"ordPrecopeFee" : ordPrecopeFee,
							"ordConsumablesFee" : ordConsumablesFee,
							"ordTotalFee" : ordTotalFee,
							"ordActualFee" :ordActualFee,
							"createBy" : createBy,
							"ordConsignPhone" : ordConsignPhone,
							"ordConsignEmail" : ordConsignEmail
				 		 },
						success : function(data){
							if("success" == data.result){
								api.opener.$jQuery().dlg_alert("保存成功", function(){
									if(flag == "1"){
										parent.location.reload();
									}else{
//										frameElement.api.opener.doQuery();
										api.opener.doQuery();
									}
									api.close();
								});
							}else{
								if(data.result != null && data.result != ""){
									api.opener.$jQuery().dlg_alert(data.result);
								}else{
									api.opener.$jQuery().dlg_alert("保存失败");
								}
							}
						},
						error : initError,
						beforeSend : function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");}
					});
				}
			}
		}
	}
	
}

//function doSuccess(data){
//	if(data.result == "success"){
//		api.opener.$jQuery().dlg_alert("保存成功", function(){
//			api.opener.doQuery();
//			api.close();
//		});
//	}else{
//		api.opener.$jQuery().dlg_alert("保存失败");
//	}
//}

function viewPriceDetail() {
	//var consuablesInfo = getTableAllRows("ectableConsu");
	var consuablesInfo = jQuery("#ectableConsu_table_body tr");
	var itemStandardInfo = getTableAllRows("ectable");
	var arrayTime = "item";
	calculateTotalFeeForConsu();
	calculateTotalFeeForItem();
	ordTotalFee = (parseFloat(ordTestFee) + parseFloat(ordPrecopeFee) + parseFloat(ordConsumablesFee)).toFixed(2);
	//calculateTotalFee();
	var ordModelType = jQuery("#ordModelType").val();
	jQuery().openDlg({
		width : 800,
		height : 550,
		modal : true,
		url : WEB_CTX_PATH + "/sams/ord/apply/OrdPriceDetail.jsp",
		title : "费用明细",
		data : {
			consuablesInfo : consuablesInfo,
			itemStandardInfo : itemStandardInfo,
			ordTestFee : ordTestFee,
			ordPrecopeFee : ordPrecopeFee,
			ordConsumablesFee : ordConsumablesFee,
			ordTotalFee : ordTotalFee,
			testSampleNum : jQuery("#ordSamplenum").val(),
			arrayTime : arrayTime
		},
	parent :api
	});
}

/**
 * 审核驳回
 */
function doReject(flag){
	var ordId = jQuery("#ordId").val();
	var groupKey = jQuery("#ordReceiveUnit").val();
	jQuery().openDlg({
		width : 540,
		height : 220,
		modal : true,
		url : WEB_CTX_PATH + "/sams/ord/approve/OrdApproveRespond.jsp?flag="+flag,
		title : "回复",
		data : {
			ordId : ordId,
			groupKey : groupKey,
			flag : flag
		},
		parent :api
	});
}
function getRejectResponse(response,flag){
	//获取以前的回复
	var ordResponseBefore = jQuery("#ordResponse").val();
	var ordId = jQuery("#ordId").val();
	var ordApplyEmail = jQuery("#ordApplyEmail").val();
	var ordNo = jQuery("#ordNo").val();
	//将此次驳回意见与以前驳回意见拼接，并以换行分割
	var respondRemark = ordResponseBefore+'\r\n'+ response;
	//分库分表
	var groupKey = jQuery("#ordReceiveUnit").val();
	jQuery("#ordResponse").val(respondRemark);
	$jQuery("#ordApplyForm").ajaxSubmit({
		target : "#ordApplyForm",
		url : WEB_CTX_PATH + "/ordApproveAction.do?method=doReject",
		dataType : 'json',
		method : 'POST',
		data:{
			ordId: ordId,
			ordResponse : jQuery("#ordResponse").val(),
			newResponse :response,
			ordApplyEmail : ordApplyEmail,
			ordNo : ordNo,
			flag : flag,
			groupKey : groupKey
		 },
		success : doRejectSuccess,
		error : initError,
		beforeSend : function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");}
		});
}

function doRejectSuccess(responseData){
	if(responseData.result == "success"){
		api.opener.$jQuery().dlg_alert("驳回成功", function(){
			if(responseData.flag == "1"){
				parent.location.reload();
			}else{
				api.opener.doQuery();
			}
			api.close();
		});
	}else{
		api.opener.$jQuery().dlg_alert("驳回失败");
	}
}
/**
 * 委托单否决
 */
function doDeny(flag){
	jQuery().openDlg({
		width : 540,
		height : 240,
		modal : true,
		url : WEB_CTX_PATH + "/sams/ord/approve/OrdApproveDenyRespond.jsp?flag="+flag,
		title : "回复",
		data : {
			flag : flag
		},
		parent :api
	});

}

/**
 * 委托单否决
 */
function getDenyResponse(response,flag){
	var ordResponseBefore = jQuery("#ordResponse").val();
	var respondRemark = ordResponseBefore+'\r\n'+ response;
	jQuery("#ordResponse").val(respondRemark);
	$jQuery("#otherInfoForm").ajaxSubmit({
		target : "#otherInfoForm",
		url : WEB_CTX_PATH + "/ordApproveAction.do?method=doDenyApply",
		dataType : 'json',
		method : 'POST',
		data:{
			ordId : jQuery("#ordId").val(),
			ordResponse : respondRemark,
			newResponse :response,
			ordNo : jQuery("#ordNo").val(),
			ordApplyEmail : jQuery("#ordApplyEmail").val(),
			flag : flag,
			groupKey : jQuery("#ordReceiveUnit").val()
		 },
		success : doDenySuccess,
		error : initError,
		beforeSend : function(xhr) {xhr.setRequestHeader("__REQUEST_TYPE", "AJAX_REQUEST");}
	});
}

function doDenySuccess(responseData){
	if(responseData.result == "success"){
		api.opener.$jQuery().dlg_alert("否决成功", function(){
			if(responseData.flag == "1"){
				parent.location.reload();
			}else{
//				frameElement.api.opener.doQuery();
				api.opener.doQuery();
			}
			api.close();
		});
	}else{
		api.opener.$jQuery().dlg_alert("否决失败");
	}
}

/**
 * 委托单通过
 */
function doApprove(flag){
	
	if(!jQuery().dlg_confirm("确认通过？",
			function(){
				jQuery("#actionType").val('03');
				doSave(flag);
			})
		){
			return;
		}
}
//选择课题
function doSelect(){
	jQuery().openDlg({
		width : 850,
		height : 550,
		modal : true,
		url : WEB_CTX_PATH + "/topicAction.do?method=doQueryPopup",
		title : "课题信息",
		data : {
	
		},
		parent : api
	});
}
function setTopicValue(topicId,topicName,topicPerson,topicPersonName){
	jQuery("#ordSubjectName").val(topicName);
	jQuery("#ordSubjectId").val(topicId);
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

function changeTestType(){
	var ordTestType = jQuery("#ordTestType").val();
	if(ordTestType==1){
		jQuery("#ordTestTypeRemarkTr").show();
	}else{
		jQuery("#ordTestTypeRemarkTr").hide();
	}
}