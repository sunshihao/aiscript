var api = frameElement.api;
var viewName = "";
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
			}
			changeTestType();
			$jQuery("#ordApplyForm").validate({
				rules : {
					ordSampleno :{
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
						dateCompare : '#ordSendsampleTime'
					}
				},messages : {
					ordFinishtime :{
						dateCompare : "完成时间必须大于送样时间"
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
			jQuery("#MainArea").hide();
			jQuery("#searchTool").hide();
			//查询时间段信息
			var ordId = api.data.ordId;
			var applyTime = jQuery("#applyTime").val();
			var url = encodeURI(WEB_CTX_PATH + "/ordApplyAction.do?method=saveTimeRequest&applyTime=" + applyTime.replace(/[ ]/g, "~"));
			jQuery("#timeDiv").html('<iframe id="complete" name="complete" '
			+ ' src = ' + url
			+ ' width = 100%'
			+ ' height = 63px'
			+ ' align="left" frameborder="0" scrolling="yes" ></iframe>');
			getAppAllTime("edit");//获取仪器和该仪器总预约时间的字符串，用于计算费用
			
			$jQuery("#ectableConsu_toolbarTable").remove();
			
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
		
		//时间预约用
		var times = $jQuery("#applyTime").val();
		if(null != times && "" != times && "undefined" != times.toLowerCase()){
			//先删除下拉框里的数据
			var selectOptionLength = $jQuery("#apparatusId_time option").length;
			for(var j = selectOptionLength - 1 ; j >= 0 ; j--){
				if($jQuery("#apparatusId_time option").eq(j).val() == id){
					$jQuery("#apparatusId_time option").eq(j).remove();
				}
			}
			//获取页面仪器和时间的大字符串
			var arrayTime = times.substring(0, times.length-1).split(',');
			for(var i =0 ; i < arrayTime.length ; i++){
				if(id == arrayTime[i].split('@')[0]){
					times = times.replace(arrayTime[i] + ",", "");
				}
			}
			$jQuery("#applyTime").val(times);
			//刷新iframe
			jQuery("#timeDiv").html('');
			jQuery("#timeDiv").text('');
			var url = encodeURI(WEB_CTX_PATH + "/ordApplyAction.do?method=saveTimeRequest&applyTime=" + jQuery("#applyTime").val().replace(/[ ]/g, "~"));
			var timeDiv = document.getElementById("timeDiv");
			jQuery("#timeDiv").html('<iframe id="complete" name="complete" '
			+ ' src = ' + url
			+ ' width = 100%'
			+ ' height = 63px'
			+ ' align="left" frameborder="0" scrolling="yes" ></iframe>');
			getAppAllTime();//获取仪器和该仪器总预约时间的字符串，用于计算费用
		}
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
	var groupKey = $jQuery("#ordReceiveUnit").val();
	var result = "";
	//选择的时间段（可能多段）
	var times = $jQuery("#applyTime").val();
	var jsonArrayObj = createJsonArrayObj(times);
	var jsonArrayStr = JSON.stringify(jsonArrayObj);
	var selectValue = "";//下拉框一共有几个仪器
	//时间段校验  1：重复校验2：某个仪器没有时间校验3：结束日期大于开始日期校验
	if(times != ""){
		jQuery("#MainArea").show();
		jQuery("#searchTool").show();
		//重复校验
    	var selectOptionLength = $jQuery("#apparatusId_time option").length;
    	for(var j = selectOptionLength - 1 ; j >= 0 ; j--){
    		//遍历下拉框里的所有仪器
    		var apparatusId_time = $jQuery("#apparatusId_time option").eq(j).val();
    		//将该仪器选中
			$jQuery("#apparatusId_time option").eq(j).attr("selected", "selected");
			//重新加载日历空间
			$jQuery("#timeFlag").val("");
            var apparatusId = $jQuery("#apparatusId_time option:selected").val();
            var ordId = api.data.ordId;
            $jQuery("#calendar").fullCalendar('removeEvents');
            $jQuery.ajax({
		        contentType: "application/json",
		        type: "post",
		        url : WEB_CTX_PATH + "/ordApplyAction.do?method=getApproveForTime&apparatusId=" + apparatusId + "&ordId=" + ordId + "&groupKey=" + groupKey,
		        dataType: "json",
		        success: function (data) {
			        //读取数据库中的数据显示在日历中
			        tempData = data.ResultList;
			        if(jQuery("#isSequencer").val() != "1" && jQuery("#isManyIntoOut").val() != "1"){//非多进多出仪器和测序仪
				        $jQuery.each(tempData, function (i) {
							var obj = {};
							obj.title = tempData[i].ordNo + " " + tempData[i].userName;
							obj.ordId = tempData[i].ordId;
							obj.start = tempData[i].ordStarttime;
							obj.end = tempData[i].ordEndtime;
							obj.editable = false;
							obj.allDay = false;
							$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
				        });
			        }
                }
            });
			//获取页面仪器和时间的大字符串
    		var arrayTime = times.substring(0, times.length-1).split(',');
        	for(var i =0 ; i < arrayTime.length ; i++){
        		var checkName = jQuery("#apparatusId_time option:selected").val() + "@" + $jQuery("#apparatusId_time option:selected").text() + "@";
        		if(times.indexOf(checkName) < 0){//某个仪器没有时间校验
        			alert("仪器【" + $jQuery("#apparatusId_time option:selected").text() + "】没有选择任何时间段！");
        			jQuery("#MainArea").hide();
        			jQuery("#searchTool").hide();
        			$jQuery("#applyTime").val(times);
        			return;
        		}
        		if(apparatusId_time == arrayTime[i].split('@')[0]){
        			if(new Date(arrayTime[i].split('@')[3]) <= new Date(arrayTime[i].split('@')[2])){//结束日期大于开始日期校验
            			alert("编号:【" + arrayTime[i].split('@')[4] + "】，仪器【" + $jQuery("#apparatusId_time option:selected").text() + "】结束日期大于开始日期！");
            			jQuery("#MainArea").hide();
            			jQuery("#searchTool").hide();
            			$jQuery("#applyTime").val(times);
            			return;
            		}
        			if(chkTimeOverlap(new Date(arrayTime[i].split('@')[2]), new Date(arrayTime[i].split('@')[3]), "1") == true){
        				var obj = {};
        				obj.ordId = "";
        				obj.color = "red";
        				obj.start = arrayTime[i].split('@')[2];
        				obj.end = arrayTime[i].split('@')[3];
        				obj.editable = false;
        				obj.allDay = false;
        				$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
            		}else{
            			alert("日期有重叠，请重新选择预约时间！编号:【" + arrayTime[i].split('@')[4] + "】，仪器名称：【" + arrayTime[i].split('@')[1] + "】");
            			jQuery("#MainArea").hide();
            			jQuery("#searchTool").hide();
            			$jQuery("#applyTime").val(times);
            			return;
            		}
        		}
        	}
        	selectValue = selectValue + apparatusId_time + ",";
	    }
    }else{
    	jQuery().dlg_alert("请选择预约时间！");
    	return;
    }
	
	/*
	 * 委托单验证，如是否到预约时间
	 */
	ajaxRequest("ordApplyAction.do?method=applyApparCheck",
		function (data) {
			var msg = ""+data.mapInfo.message;
			if(msg.length>0){
				jQuery().dlg_alert(msg,function(){
				});
				result=1;
			}else{
				//applyApparCheckRet=true;
			}
	    }
	, initError, "apparIds="
					+ selectValue,false);
	if(result==1){
		return false;
	}
	
    $jQuery("#applyTime").val(times);
    jQuery("#MainArea").hide();
	jQuery("#searchTool").hide();
	//校验最大预约时间和最长提前预约时间
	jQuery.ajax({
		async : false,
		url : WEB_CTX_PATH + "/ordApplyAction.do?method=checkMaxLongTime",
		type : "post",
		dataType : "text",
		data : {
			"jsonarray" : jsonArrayStr,
			"selectValue" : selectValue.substring(0, selectValue.length - 1)
		},
		success : function(data) {
			var obj = eval('(' + data + ')');  //转换json
			if(obj.errorMessage == undefined || obj.errorMessage == null || obj.errorMessage == ""){
				
			} else {
				alert(obj.errorMessage);
				result = "1";
				return false;
			}
		},
		error : function(){
			alert("网络错误");
			result = "1";
			return false;
		}
	});
	if(result == "1")  return false;
	if(jQuery("#isSequencer").val() == "1"){//测序仪比较最大预计数据量
		var predictFlow = jQuery("#predictFlow").val();
		var maxForecast = jQuery("#maxForecast").val();
		jQuery.ajax({
			async : false,
			url : WEB_CTX_PATH + "/ordApplyAction.do?method=checkOrdSamplenum",
			type : "post",
			dataType : "text",
			data : {
				jsonarray : jsonArrayStr,
				flag : "isSequencer",
				apparatusId : jQuery("#apparatusId_time option:selected").val(),
				ordId : api.data.ordId,
				groupKey : api.data.groupKey,
				actionType : jQuery("#actionType").val(),
				predictFlow : predictFlow,
				maxForecast : maxForecast
			},
			success : function(data) {
				var obj = eval('(' + data + ')');
				if(obj.message != undefined && obj.message != null && obj.message != ""){
					alert(obj.message);
					result = "1";
					return false;
				}
			},
			error : function(){
				alert("网络错误");
				result = "1";
				return false;
			}
		});
	}
	if(result == "1")  return false;
	if(jQuery("#isManyIntoOut").val() == "1"){//多进多出仪器比较最大样品数
		var ordSamplenum = jQuery("#ordSamplenum").val();
		var maxSamples = jQuery("#maxSamples").val();
		jQuery.ajax({
			async : false,
			url : WEB_CTX_PATH + "/ordApplyAction.do?method=checkOrdSamplenum",
			type : "post",
			dataType : "text",
			data : {
				jsonarray : jsonArrayStr,
				flag : "isManyIntoOut",
				apparatusId : jQuery("#apparatusId_time option:selected").val(),
				ordId : api.data.ordId,
				groupKey : api.data.groupKey,
				actionType : jQuery("#actionType").val(),
				ordSamplenum : ordSamplenum,
				maxSamples : maxSamples
			},
			success : function(data) {
				var obj = eval('(' + data + ')');
				if(obj.message != undefined && obj.message != null && obj.message != ""){
					alert(obj.message);
					result = "1";
					return false;
				}
			},
			error : function(){
				alert("网络错误");
				result = "1";
				return false;
			}
		});
	}
	if(result == "1")  return false;
	//其余信息校验
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
						var consuablesInfo =getTableAllRows("ectableConsu"); 
						var itemStandardInfo = getTableAllRows("ectable");
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
					var ordConsignPhone = jQuery("#ordConsignPhone").val();
					var ordConsignEmail = jQuery("#ordConsignEmail").val();
					
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
							"jsonArray" : jsonArrayStr,
							"ordTestFee" : ordTestFee,
							"ordPrecopeFee" : ordPrecopeFee,
							"ordConsumablesFee" : ordConsumablesFee,
							"ordTotalFee" : ordTotalFee,
							"ordActualFee" :ordActualFee,
							"selectValue" : selectValue,
							"createBy" : createBy,
							"isManyIntoOut" : jQuery("#isManyIntoOut").val(),
							"isSequencer" : jQuery("#isSequencer").val(),
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
//		if(data.result != null && data.result != ""){
//			api.opener.$jQuery().dlg_alert(data.result);
//		}else{
//			api.opener.$jQuery().dlg_alert("保存失败");
//		}
//	}
//}

function viewPriceDetail() {
	//var consuablesInfo = getTableAllRows("ectableConsu");
	var itemStandardInfo = getTableAllRows("ectable");
	var consuablesInfo = jQuery("#ectableConsu_table_body tr");
	var times = $jQuery("#applyTime").val();
	var arrayTime = times.substring(0, times.length-1).split(',');
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
		height : 240,
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
			flag:flag,
			groupKey: groupKey
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
//				frameElement.api.opener.doQuery();
				api.opener.doQuery();
			}
			api.close();
		});
	}else{
		api.opener.$jQuery().dlg_alert("驳回失败");
	}
}
/**
 * 委托单否决对话框
 */
function doDeny(flag){
	var ordId = jQuery("#ordId").val();
	var groupKey = jQuery("#ordReceiveUnit").val();
	var ordApplyEmail = jQuery("#ordApplyEmail").val();
	var ordNo = jQuery("#ordNo").val();
	jQuery().openDlg({
		width : 540,
		height : 240,
		modal : true,
		url : WEB_CTX_PATH + "/sams/ord/approve/OrdApproveDenyRespond.jsp?flag="+flag,
		title : "回复",
		data : {
			'ordId' : ordId,
			"groupKey" : groupKey,
			"ordApplyEmail" : ordApplyEmail,
			"ordNo":ordNo,
			"flag":flag
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
	var times = $jQuery("#applyTime").val();
	if('' == times){
		jQuery().dlg_alert("请选择预约时间！");
		return;
	}
	jQuery("#MainArea").show();
	jQuery("#searchTool").show();
	renderCalendar();//初始化日期控件
    $jQuery("#applyTime").val(times);
    jQuery("#MainArea").hide();
	jQuery("#searchTool").hide();
	if(!jQuery().dlg_confirm("确认通过？",
			function(){
				jQuery("#actionType").val('03');
				doSave(flag);
			})
		){
			return;
		}
}	
		
function renderCalendar() {
	//清空页面保存的时间段
	var timesCheck = $jQuery("#applyTime").val();
	var ordId = api.data.ordId;
	var actionType = api.data.actionType;
	$jQuery("#applyTime").val("");
	$jQuery('#calendar').fullCalendar({
		buttonText:{
			today: '今天',
			month: '月',
			week: '周',
			day: '天'
		},
		monthNames : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		monthNamesShort : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
		dayNames : ['周天', '周一', '周二', '周三', '周四', '周五', '周六'],
		dayNamesShort : ['周天', '周一', '周二', '周三', '周四', '周五', '周六'],
		titleFormat : {
			month: 'yyyy年 MMMM', // September 2013
			week: "yyyy年 MMM d[ yyyy]日{ '—'[ MMM] d日}", // Sep 7 - 13 2013
			day: 'yyyy年 MMM d日' // Tuesday, Sep 8, 2013
		},
		allDayText : '全天',
		axisFormat : 'HH:mm',
		firstHour: 7,
		slotMinutes : 30,
		timeFormat : {
			agenda: 'HH:mm{ - HH:mm}',
			month: 'HH:mm{ - HH:mm}'
		},
		height : 550,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView:"agendaWeek",
        minTime:"0",
        maxTime:"24",
        slotEventOverlap:false,
        viewDisplay: function (view) {
        	  viewName = view.name;
              var viewStart = $jQuery.fullCalendar.formatDate(view.start, "yyyy-MM-dd HH:mm");
              var viewEnd = $jQuery.fullCalendar.formatDate(view.end, "yyyy-MM-dd HH:mm");
              var selectOptionLength = $jQuery("#apparatusId_time option").length;
              //把下拉框定位在最后一个
              //$jQuery("#apparatusId_time option").eq(0).attr("selected", "selected");
              var apparatusId = $jQuery("#apparatusId_time").val();
              var groupKey = $jQuery("#ordReceiveUnit").val();
              $jQuery("#calendar").fullCalendar('removeEvents');
              $jQuery.ajax({
                  contentType: "application/json",
                  type: "post",
                  url : WEB_CTX_PATH + "/ordApplyAction.do?method=getApproveForTime&startTime="
                  + viewStart + "&endTime=" + viewEnd + "&apparatusId=" + apparatusId + "&ordId=" + ordId + "&actionType=" + actionType + "&groupKey=" + groupKey,
                  dataType: "json",
                  success: function (data) {
                	  var userId = $jQuery("#userId").val();
                	  //读取数据库中的数据显示在日历中
                	  tempData = data.ResultList;
                	  if(jQuery("#isSequencer").val() != "1" && jQuery("#isManyIntoOut").val() != "1"){//非多进多出仪器和测序仪
	                      $jQuery.each(tempData, function (i) {//该处赋值为非本预约单的仪器的预约时间，所以为默认蓝色
	                          var obj = {};
	                          obj.id = tempData[i].ordTimeId;
	                          obj.title = tempData[i].ordNo + " " + tempData[i].userName;
	                          obj.ordId = tempData[i].ordId;
	                          obj.apparatusId = tempData[i].apparatusId;
	                          obj.start = tempData[i].ordStarttime;
	                          obj.end = tempData[i].ordEndtime;
	                          var ordTimeuserId = tempData[i].userId;
	                          if(userId != ordTimeuserId){
                            	  obj.color = "green";
                              }
	                          // 选择一格时间显示问题
	                          if(viewName != "month"){
	                        	  var range = (new Date(tempData[i].ordEndtime.replace(/-/g,"/")).getTime()-new Date(tempData[i].ordStarttime.replace(/-/g,"/")).getTime())/ 1000 / 60;
	                              if(range<=30){
	                              	var endDT = $jQuery.fullCalendar.formatDate(new Date(tempData[i].ordEndtime.replace(/-/g,"/")), "HH:mm");
	                                obj.title = endDT;
	                              }
	                          }
	                          obj.editable = false;
	                          obj.allDay = false;
	                          $jQuery("#calendar").fullCalendar('renderEvent', obj, false);
	                      });
                	  }
                	  
                	//判断当前页面是否有保存的日历信息（主要用于月日周切换）
                      var times = $jQuery("#applyTime").val();
                      var timeFlag = $jQuery("#timeFlag").val();
                      if(times != "" && timeFlag != ""){
                    	  var arrayTime = times.substring(0, times.length-1).split(',');
	    	              for(i=0;i<arrayTime.length;i++){
	    	            	  if(apparatusId == arrayTime[i].split('@')[0]){
	    	            		var obj = {};
	      	              		obj.ordId = "";
	      	              		obj.color = "red";
	      	              		obj.start = arrayTime[i].split('@')[2];
	      	              		obj.end = arrayTime[i].split('@')[3];
	      	              		// 选择一格时间显示问题
	  	          			    var range = (new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")).getTime()-new Date(arrayTime[i].split('@')[2].replace(/-/g,"/")).getTime())/ 1000 / 60;
	  	          			    if(range<=30){
	  	          			    	var endDT = $jQuery.fullCalendar.formatDate(new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")), "HH:mm");
	  	          			        obj.title = endDT;
	  	          			    }
	      	              		obj.editable = false;
	      	              		obj.allDay = false;
	      	              		$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
	    	            	  }
	    	              } 
                      }
                      $jQuery("#timeFlag").val("1");
                      //显示仪器维修时间
                      var repairApplyList = data.RepairApplyList;
                      $jQuery.each(repairApplyList, function (i) {
                          var obj = {};
                          obj.title = "仪器维修时间";
                          obj.id = repairApplyList[i].repairApplyId;
                          obj.apparatusId = repairApplyList[i].apparatusId;
                          obj.color = "gray";
                          obj.start = repairApplyList[i].applyStartTime;
                          obj.end = repairApplyList[i].applyEndTime;
                          obj.editable = false;
                          obj.allDay = false;
                          $jQuery("#calendar").fullCalendar('renderEvent', obj, false);
                      });
                  }
              })
              
          },
        eventAfterRender : function(event, element, view) {
        	var e = event;
        },
        selectable: true,
        selectHelper: true,
        select: function (startDate, endDate, allDay, jsEvent, view) {
        	if(allDay){
				endDate.setDate(endDate.getDate() + 1);
				endDate.setSeconds(endDate.getSeconds() - 1);
        	}
        	var startDT = $jQuery.fullCalendar.formatDate(startDate, "yyyy-MM-dd HH:mm");
            var endDT = $jQuery.fullCalendar.formatDate(endDate, "yyyy-MM-dd HH:mm");
            
            if('month' != view.name && chkTimeOverlap(startDate,endDate)==false){
            	jQuery().dlg_alert("预约时间重叠，请重新选择预约时间！");
            	return false;
        	}
            
            var apparatusId = $jQuery("#apparatusId_time option:selected").val();
    		var AppName = $jQuery("#apparatusId_time option:selected").text();
    		//如果timesCheck为空，说明是第一次选择时间，此时需要手动讲选的时间段拼接上去
    		timesCheck = $jQuery("#applyTime").val() + apparatusId + "@" + AppName + "@" + startDT + "@" + endDT + "@" + "1,";
    		var jsonArrayObj = createJsonArrayObj(timesCheck);
    		var jsonArrayStr = JSON.stringify(jsonArrayObj);
    		
    		//校验最大预约时间和最长提前预约时间
    		jQuery.ajax({
    			async : false,
    			url : WEB_CTX_PATH + "/ordApplyAction.do?method=checkMaxLongTime",
    			type : "post",
    			dataType : "text",
    			data : {
    				"jsonarray" : jsonArrayStr,
    				"selectValue" : apparatusId
    			},
    			success : function(data) {
    				var obj = eval('(' + data + ')');  //转换json
    				if(obj.errorMessage == undefined || obj.errorMessage == null || obj.errorMessage == ""){
    					jQuery().openDlg({
                    		width : 275,
                    		height : 140,
                    		modal : true,
                    		url : WEB_CTX_PATH + "/sams/ord/apply/ApplyTimeEdit.jsp",
                    		title : "编辑预约时间",
                    		data : {
                    			"actionType" : "popup",
                    			"startTime" : startDT,
                    			"endTime" : endDT
                    		},
                    		parent:api
                    	});
    				} else {
    					alert(obj.errorMessage);
    					timesCheck = "";
    				}
    			},
    			error : function(){
    				alert("网络错误");
    				timesCheck = "";
    			}
    		});
        },
        eventClick: function (calEvent, jsEvent, view) {
        	var groupKey = $jQuery("#ordReceiveUnit").val();
        	if(typeof(calEvent.id) == "string"&&calEvent.color!="gray"){
        		jQuery().openDlg({
            		width : 270,
            		height : 200,
            		modal : true,
            		url : WEB_CTX_PATH + "/sams/ord/apply/ApplyTimeView.jsp?ordTimeId="+calEvent.id
            		+"&ordId="+calEvent.ordId+"&apparatusId="+calEvent.apparatusId+"&groupKey="+groupKey,
            		title : "查看预约信息",
            		data : {
            			"actionType" : "popup",
            		},
            		parent:api
            	});
        	}

            // change the border color just for fun
            $jQuery(this).css('border-color', 'red');

        },
    })
}
/**
* 存储选择的预约时间段
*/
function createApply(startTime,endTime) {
	var startTimeView = startTime.replace(/-/g,"/");
	var endTimeView = endTime.replace(/-/g,"/");
	if(chkTimeOverlap(new Date(startTimeView), new Date(endTimeView)) == true){
		var obj = {};
		obj.ordId = "";
		obj.color = "red";
		obj.start = startTime;
		obj.end = endTime;
		// 选择一格时间显示问题
	    var range = (new Date(endTimeView).getTime()-new Date(startTimeView).getTime())/ 1000 / 60;
	    if(range<=30){
	    	var endDT = $jQuery.fullCalendar.formatDate(new Date(endTimeView), "HH:mm");
	        obj.title = endDT;
	    }
		obj.editable = false;
		obj.allDay = false;
	}else{
		jQuery().dlg_alert("预约时间重叠，请重新选择预约时间！");
		return false;
	}
	$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
	var timeDuration = parseFloat((new Date(endTimeView).getTime() - new Date(startTimeView).getTime())/ 1000 / 60 / 60).toFixed(2);
	var applytime = startTime + "@" + endTime;
	var ai = $jQuery("#applyTime").val();
	var len = ai.substring(0, ai.length - 1).split(",").length;
	var AppName = $jQuery("#apparatusId_time option:selected").text();
	var AppId = $jQuery("#apparatusId_time").val();
	if("" == ai){
		ai = ai + AppId + "@" + AppName + "@" + applytime + "@1"+"@"+timeDuration + ",";
	}else{
		ai = ai + AppId + "@" + AppName + "@" + applytime + "@" + (Number(ai.substring(0, ai.length - 1).split(",")[len - 1].split("@")[4]) + 1)+"@"+timeDuration + ",";
	}
	$jQuery("#applyTime").val(ai);
	testApplyTimeChange();
}
/**
 * 再次打开日期控件
 */
function timeControl() {
	jQuery("#mainDiv").hide();
	jQuery("#mainDivBut").hide();
	jQuery("#timeInfo").hide();
	jQuery("#sampleInfo").hide();
	jQuery("#itemInfo").hide();
	jQuery("#consumablesInfo").hide();
	jQuery("#feeDiv").hide();
	jQuery("#otherInfo").hide();
	jQuery("#searchTool").show();
	jQuery("#next_btn_4").attr("display","block");
	jQuery("#MainArea").show();
	var times = $jQuery("#applyTime").val();
	$jQuery("#calendar").html("");
	renderCalendar();//初始化日期控件
    var ordId = api.data.ordId;
    if(times != ""){
    	var selectOptionLength = $jQuery("#apparatusId_time option").length;
		//遍历下拉框里的所有仪器
		var apparatusId_time = $jQuery("#apparatusId_time option").eq(0).val();
		//将该仪器选中
		$jQuery("#apparatusId_time option").eq(0).attr("selected", "selected");
		//重新加载日历空间
		$jQuery("#timeFlag").val("");
        var apparatusId = $jQuery("#apparatusId_time option:selected").val();
		//获取页面仪器和时间的大字符串
		var arrayTime = times.substring(0, times.length-1).split(',');
		if($jQuery("#timeFlag").val() == ""){
			for(var i =0 ; i < arrayTime.length ; i++){//该处赋值为本预约单的仪器的预约时间，颜色设置成红色
	    		if(apparatusId_time == arrayTime[i].split('@')[0]){
	    			if(chkTimeOverlap(new Date(arrayTime[i].split('@')[2].replace(/-/g,"/")), new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")), "1") == true){
	    				var obj = {};
	    				obj.ordId = "";
	    				obj.color = "red";
	    				obj.start = arrayTime[i].split('@')[2];
	    				obj.end = arrayTime[i].split('@')[3];
	    				// 选择一格时间显示问题
	    			    var range = (new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")).getTime()-new Date(arrayTime[i].split('@')[2].replace(/-/g,"/")).getTime())/ 1000 / 60;
	    			    if(range<=30){
	    			    	var endDT = $jQuery.fullCalendar.formatDate(new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")), "HH:mm");
	    			        obj.title = endDT;
	    			    }
	    				obj.editable = false;
	    				obj.allDay = false;
	    				$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
	        		}else{
	        			alert("手动修改日期有重叠，请重新选择预约时间！编号:【" + arrayTime[i].split('@')[4] + "】，仪器名称：【" + arrayTime[i].split('@')[1] + "】");
	        			jQuery("#mainDiv").show();
	        			jQuery("#mainDivBut").show();
	        			jQuery("#timeInfo").show();
	        			jQuery("#sampleInfo").show();
	        			jQuery("#itemInfo").show();
	        			jQuery("#consumablesInfo").show();
	        			jQuery("#feeDiv").show();
	        			jQuery("#otherInfo").show();
	        			jQuery("#next_btn_4").hide();
	        			jQuery("#MainArea").hide();
	        			jQuery("#searchTool").hide();
	        			$jQuery("#applyTime").val(times);
	        			return;
	        		}
	    		}
	    	}
		}
    }
    $jQuery("#applyTime").val(times);
}
/**
 * 下拉框联动
 * */
function changeApparatusId(){
	var userId = $jQuery("#userId").val();
	var times = $jQuery("#applyTime").val();
	$jQuery("#timeFlag").val("1");
	//重新加载日历空间
	$jQuery("#calendar").fullCalendar('removeEvents');
	var apparatusId = $jQuery("#apparatusId_time option:selected").val();
	var ordId = api.data.ordId;
	var actionType = api.data.actionType;
	//分库分表
	var groupKey = $jQuery("#ordReceiveUnit").val();
	$jQuery.ajax({
    	async: false,
        contentType: "application/json",
        type: "post",
        url : WEB_CTX_PATH + "/ordApplyAction.do?method=getApproveForTime&apparatusId=" + apparatusId + "&ordId=" + ordId + "&groupKey=" + groupKey + "&actionType=" + actionType,
        dataType: "json",
        success: function (data) {
	        //读取数据库中的数据显示在日历中
	        tempData = data.ResultList;
	        $jQuery.each(tempData, function (i) {
				var obj = {};
				obj.title = tempData[i].ordNo + " " + tempData[i].userName;
				obj.id = tempData[i].ordTimeId;
				obj.ordId = tempData[i].ordId;
				obj.apparatusId = tempData[i].apparatusId;
				obj.start = tempData[i].ordStarttime;
				obj.end = tempData[i].ordEndtime;
				var ordTimeuserId = tempData[i].userId;
                if(userId != ordTimeuserId){
              	  obj.color = "green";
                }
                // 选择一格时间显示问题
                var viewName = $jQuery("#calendar").fullCalendar('getView').name;
                if(viewName != "month"){
              	  var range = (new Date(tempData[i].ordEndtime.replace(/-/g,"/")).getTime()-new Date(tempData[i].ordStarttime.replace(/-/g,"/")).getTime())/ 1000 / 60;
                    if(range<=30){
	                	var endDT = $jQuery.fullCalendar.formatDate(new Date(tempData[i].ordEndtime.replace(/-/g,"/")), "HH:mm");
	                	obj.title = endDT;
                    }
                }
				obj.editable = false;
				obj.allDay = false;
				$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
	        });
	        
	        //显示仪器维修时间
            var repairApplyList = data.RepairApplyList;
            $jQuery.each(repairApplyList, function (i) {
                var obj = {};
                obj.title = "仪器维修时间";
                obj.id = repairApplyList[i].repairApplyId;
                obj.apparatusId = repairApplyList[i].apparatusId;
                obj.color = "gray";
                obj.start = repairApplyList[i].applyStartTime;
                obj.end = repairApplyList[i].applyEndTime;
                obj.editable = false;
                obj.allDay = false;
                $jQuery("#calendar").fullCalendar('renderEvent', obj, false);
            });
        }
    });
	//获取页面仪器和时间的大字符串
	var arrayTime = times.substring(0, times.length-1).split(',');
	for(var i =0 ; i < arrayTime.length ; i++){//该处赋值为本预约单的仪器的预约时间，颜色设置成红色
		if(apparatusId == arrayTime[i].split('@')[0]){
			var obj = {};
			obj.ordId = "";
			obj.color = "red";
			obj.start = arrayTime[i].split('@')[2];
			obj.end = arrayTime[i].split('@')[3];
			// 选择一格时间显示问题
		    var range = (new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")).getTime()-new Date(arrayTime[i].split('@')[2].replace(/-/g,"/")).getTime())/ 1000 / 60;
		    if(range<=30){
		    	var endDT = $jQuery.fullCalendar.formatDate(new Date(arrayTime[i].split('@')[3].replace(/-/g,"/")), "HH:mm");
		        obj.title = endDT;
		    }
			obj.editable = false;
			obj.allDay = false;
			$jQuery("#calendar").fullCalendar('renderEvent', obj, false);
		}
	}
	$jQuery("#applyTime").val(times);
}

/**
 * 生成时间的LIST表格中修改时间触发的方法---开始时间
 * */
function changeTimeApplyStart(id, name, stime, number){
	if(null == stime || "" == stime){
		alert("第" + number + "行，仪器【" + name + "】" + "没有选择开始时间");
		jQuery(window.frames["complete"].document).find("#" + number + "_ST").val(stime);
		return;
	}
	var applyTime = jQuery("#applyTime").val().replace("~", /[ ]/g);
	var applyTimes = applyTime.split(",");//多条数据的数组
//	var endTime = window.frames["complete"].document.getElementById(id + "_ET").value;
	var endTime = jQuery(window.frames["complete"].document).find("#" + number + "_ET").val();
	for(var i = 0 ; i < applyTimes.length ; i++){
		if(number == applyTimes[i].split("@")[4]){
			//找到对应的位置修改值
			if(null != stime && "" != stime){//修改开始时间
				applyTime = applyTime.replace(id + "@" + name + "@" + applyTimes[i].split("@")[2], id + "@" + name + "@" + stime);
			}
		}
	}
	jQuery("#applyTime").val(applyTime);
	getAppAllTime();//获取仪器和该仪器总预约时间的字符串，用于计算费用
}
/**
 * 生成时间的LIST表格中修改时间触发的方法---结束时间
 * */
function changeTimeApplyEnd(id, name, etime, number){
	if(null == etime || "" == etime){
		alert("第" + number + "行，仪器【" + name + "】" + "没有选择结束时间");
		jQuery(window.frames["complete"].document).find("#" + number + "_ET").val(etime);
		return;
	}
	var applyTime = jQuery("#applyTime").val().replace("~", /[ ]/g);
	var applyTimes = applyTime.split(",");//多条数据的数组
	var startTime = jQuery(window.frames["complete"].document).find("#" + number + "_ST").val();
	for(var i = 0 ; i < applyTimes.length ; i++){
		if(number == applyTimes[i].split("@")[4]){
			//找到对应的位置修改值
			if(null != etime && "" != etime){//修改结束时间
				applyTime = applyTime.replace(id + "@" + name + "@" + startTime + "@" + applyTimes[i].split("@")[3], id + "@" + name + "@" + startTime + "@" + etime);
			}
		}
	}
	jQuery("#applyTime").val(applyTime);
	getAppAllTime();//获取仪器和该仪器总预约时间的字符串，用于计算费用
}
/**
 * 再次编辑页面时候的日期控件里的下一步
 * */
function nextPage_4(){
	//刷新iframe
	jQuery("#timeDiv").html('');
	jQuery("#timeDiv").text('');
	var url = encodeURI(WEB_CTX_PATH + "/ordApplyAction.do?method=saveTimeRequest&applyTime=" + jQuery("#applyTime").val().replace(/[ ]/g, "~"));
	var timeDiv = document.getElementById("timeDiv");
	jQuery("#timeDiv").html('<iframe id="complete" name="complete" '
	+ ' src = ' + url
	+ ' width = 100%'
	+ ' height = 63px'
	+ ' align="left" frameborder="0" scrolling="yes" ></iframe>');
	getAppAllTime();//获取仪器和该仪器总预约时间的字符串，用于计算费用
	jQuery("#mainDiv").show();
	jQuery("#mainDivBut").show();
	jQuery("#timeInfo").show();
	jQuery("#sampleInfo").show();
	jQuery("#itemInfo").show();
	jQuery("#consumablesInfo").show();
	jQuery("#feeDiv").show();
	jQuery("#otherInfo").show();
	jQuery("#MainArea").hide();
	jQuery("#searchTool").hide();
	var consumList = $jQuery("#consumList").val();
	if("[]" == consumList){
		jQuery("#consumablesInfo").css("display", "none");
	}
}
/**
* 创建预约时间数组对象
*/
function createJsonArrayObj(times){
	var arrayTime = times.substring(0,times.length-1).split(',');
	var arr = [];
	for(i=0;i<arrayTime.length;i++){
		var obj = {};
		obj.id = arrayTime[i].split('@')[0];
		obj.name = arrayTime[i].split('@')[1];
		obj.start = arrayTime[i].split('@')[2];
		obj.end = arrayTime[i].split('@')[3];
		obj.number = arrayTime[i].split('@')[4];
		obj.editable = false;
		obj.allDay = false;
		arr.push(obj);
	}
	return arr;
}
/**
* 校验时间是否重叠
*/
function chkTimeOverlap (st,et,flag){
	//获取日历上所有事件
	var arraytimes= $jQuery("#calendar").fullCalendar('clientEvents');
	for(i=0;i<arraytimes.length;i++){
		if(arraytimes[i].start<st && st<arraytimes[i].end){
			return false;
		}
		if(arraytimes[i].start<et && et<arraytimes[i].end){
			return false;		
		}
		if(st<arraytimes[i].start && arraytimes[i].start<et){
			return false;
		}
		if(st<arraytimes[i].end && arraytimes[i].end<et){
			return false;
		}
		if(null == flag || "" == flag){
			if(st.getTime()==arraytimes[i].start.getTime() && arraytimes[i].end.getTime()==et.getTime()){
				return false;
			}
		}
	}
	return true;
}
/**
* 刷新日历控件
*/
function refetchCalendar() {
	$jQuery("#calendar").html("");
	//重新加载日历空间
	renderCalendar();
}
/**
 * 删除行
 * */
function doTimeCancel(number){
	var times = $jQuery("#applyTime").val();
	//获取页面仪器和时间的大字符串
	var arrayTime = times.substring(0, times.length-1).split(',');
	for(var i =0 ; i < arrayTime.length ; i++){
		if(number == arrayTime[i].split('@')[4]){
			times = times.replace(arrayTime[i] + ",", "");
		}
	}
	$jQuery("#applyTime").val(times);
	//刷新iframe
	jQuery("#timeDiv").html('');
	jQuery("#timeDiv").text('');
	var url = encodeURI(WEB_CTX_PATH + "/ordApplyAction.do?method=saveTimeRequest&applyTime=" + jQuery("#applyTime").val().replace(/[ ]/g, "~"));
	var timeDiv = document.getElementById("timeDiv");
	jQuery("#timeDiv").html('<iframe id="complete" name="complete" '
	+ ' src = ' + url
	+ ' width = 100%'
	+ ' height = 63px'
	+ ' align="left" frameborder="0" scrolling="yes" ></iframe>');
	getAppAllTime();//获取仪器和该仪器总预约时间的字符串，用于计算费用
	testApplyTimeChange();
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

function reinitIframe(){  
	var iframe = document.getElementById("complete");  
	try{  
		var bHeight = iframe.contentWindow.document.body.scrollHeight;  
		var dHeight = iframe.contentWindow.document.documentElement.scrollHeight;  
		var height = Math.max(bHeight, dHeight);  
		iframe.height =  height;  
	}catch (ex){}  
}  
window.setInterval("reinitIframe()", 200);  
