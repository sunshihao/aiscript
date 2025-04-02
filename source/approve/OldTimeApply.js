var api = frameElement.api;

jQuery().ready(
		function() {
			
			//委托单编辑，保存按钮显示其他按钮隐藏
			var actionType = api.data.actionType;
			jQuery("#actiontype").val(actionType);
			switchFieldStatus(actionType);
			//点击检测进度操作列完成按钮时,委托单明细中的“备注”字段应可以修改，样品数应可以修改
			var viewType = api.data.viewType;
			if (viewType == "1") {
				jQuery("#ordSamplenum").attr("disabled",false);
				jQuery("#remark").attr("disabled",false);
			}

			changeTestType();
			$jQuery("#ordApplyForm").validate({
				rules : {
					ordSamplenum : {
						required : true,
						numberN : 10,
						maxlength: 10
					}
				}
			});
})
// 根据操作类型,设置页面元素的可编辑性
function switchFieldStatus(actionType) {

	if (actionType == "add") {

	} else if (actionType == "edit") {

	} else if (actionType == "view") {
		enableAllELements(document.forms[1], true);
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
	var groupKey = jQuery("#ordReceiveUnit").val();
	//原始委托单的费用信息
	if(api.data.type=='old'){
		priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getOldPriceInfo&ordId="+ordId+"&groupKey="+groupKey;
	//历史委托单的费用信息
	}else if(api.data.type=='his'){
		if(api.data.viewType=='2'){
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getHisPriceInfo&ordId="+ordId+"&viewType=1"+"&groupKey="+groupKey;
		}else{
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getHisPriceInfo&ordId="+ordId+"&groupKey="+groupKey;
		}
	}else{
		if(api.data.viewType=='1'){
			var consuablesInfo="";
			var obj = jQuery("#consumablesInfo").attr("class");
			if(typeof(obj) != "undefined"){
				consuablesInfo = getAllRows("ectableConsu");
			}
			var itemInfo = getItemAllRows("ectable");
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getPriceInfo&ordId="+ordId+"&viewType=1"+"&consuablesInfo="+consuablesInfo+"&itemInfo="+itemInfo+"&totalTestFee="+totalTestFee+"&newTotalTestFee="+newTotalTestFee+"&groupKey="+groupKey;
			priceUrl=encodeURI(priceUrl);
			priceUrl=encodeURI(priceUrl)//两次编码;
		}else{
			priceUrl  = WEB_CTX_PATH + "/ordApproveAction.do?method=getPriceInfo&ordId="+ordId+"&groupKey="+groupKey;
		}
	}
	jQuery().openDlg({
		width : 800,
		height : 550,
		modal : true,
		url : priceUrl,
		title : "费用明细",
		data : {
			ordSamplenum : jQuery("#ordSamplenum").val() 
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
	if($jQuery("#ordApplyForm").valid()){
		if(ectableConsuCheck()){
			//完成时，修改样品数量和备注信息
			var ordSamplenum = jQuery("#ordSamplenum").val();
			var remark = jQuery("#remark").val();
			
			var ordTotalFactFee = jQuery("#ordTotalFactFee").val();
			var ordActualFee = jQuery("#ordActualFee").val();
			var ordConsumablesFee = jQuery("#ordConsumablesFee").val();
			var consuablesInfo = "";
			if(consumList != "" && consumList != '[]' && null!=consumList){
				consuablesInfo = ECSideUtil.generateJson("ectableConsu","update");
			}
			ajaxRequest("ordProcessManageAction.do?method=doFinishTesting", initSuccess, initError, "&ordIds=" + id + "&ordNos=" + ordNo + "&ordReceiveUnits=" + api.data.ordReceiveUnit
					+ "&ordTotalFactFee=" + ordTotalFactFee+"&ordActualFee="+ordActualFee+"&ordConsumablesFee="+ordConsumablesFee+"&consuablesInfo="+consuablesInfo
					+ "&ordSamplenum=" + ordSamplenum + "&remark=" + remark + "&changeTestFeeParam=" + JSON.stringify(changeTestFeeParam) + "&ordTestFee="+jQuery("#ordTestFee").val()
			);
		}
	}
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

/**
 * 功能描述：更新耗材价格
 * 输入：
 * 输出：
 */
function doUpdateConsuFee(obj){
	
	var num = jQuery(obj).val();
	var trObj = jQuery(obj).parent().parent();
	var oriConsuFee = trObj.children().eq(7).attr("cellvalue");
	var consuPrice= trObj.children().eq(4).children(":first").text();
	var consuFee = 0.00;
	if(!isNaN(parseFloat(num))){
		consuFee = (parseFloat(num)*parseFloat(consuPrice)).toFixed(2);
	}
	trObj.children().eq(7).children(":first").text(consuFee);
	trObj.children().eq(7).attr("cellvalue",consuFee);
	
	var totalConsuFee = jQuery("#ordActualFee").val();
	var totalFactConsuFee = jQuery("#ordTotalFactFee").val();
	var ordConsumablesFee = jQuery("#ordConsumablesFee").val();
	
	totalConsuFee = parseFloat(totalConsuFee) - parseFloat(oriConsuFee);
	totalConsuFee = totalConsuFee + parseFloat(consuFee);
	totalFactConsuFee = parseFloat(totalFactConsuFee) - parseFloat(oriConsuFee);
	totalFactConsuFee = totalFactConsuFee + parseFloat(consuFee);
	ordConsumablesFee = parseFloat(ordConsumablesFee) - parseFloat(oriConsuFee);
	ordConsumablesFee = ordConsumablesFee + parseFloat(consuFee)
	//totalFactConsuFee = (parseFloat(totalFactConsuFee)-parseFloat(oriConsuFee)+consuFee).toFixed(2);
	jQuery("#ordActualFee").val(totalConsuFee.toFixed(2));
	jQuery("#ordTotalFactFee").val(totalFactConsuFee.toFixed(2));
	jQuery("#ordConsumablesFee").val(ordConsumablesFee.toFixed(2));
}

function ectableConsuCheck(){
	var ecsideObj = ECSideUtil.getGridObj("ectableConsu");
	if (ecsideObj && ecsideObj.ECListBody){
		var rs=ecsideObj.ECListBody.rows;
		for (var i=0;i<rs.length;i++){
			var cells=rs[i].cells;
			var index = i+1;
			if(ECSideUtil.hasClass(rs[i],"del")){
				continue;
			}
			for (var j=0;j<cells.length ;j++ ){
				var colValue = null;
				var flag = false;
				var sKey = ECSideUtil.getColumnName(cells[j],"ectableConsu");
				
				colValue = cells[j].getAttribute("cellValue");
				flag = true;
				
				if(flag){
					if(colValue == "" || colValue == null || colValue == undefined) {
						if(sKey=="consumablesNum"){
							alert("第"+ index +"行的耗材数量必须录入");
							return false;
						}
					} else {
						if (sKey=="consumablesNum") {
							if(!checkNumber(colValue)){
								alert("第"+ index +"行的耗材数量应为正整数");
								return false;
							}
							if(colValue.length > 10){
								alert("第"+ index +"行的耗材数量应小于10位");
								return false;
							}
						}
						
					}
				}
			}
		}
	}
	return true;
}

/**
 * 功能描述：按样品数更新价格
 * 输入：
 * 输出：
 * 
 */
var changeTestFeeParam = [];
var totalTestFee = 0.00;
var newTotalTestFee = 0.00;

function doUpdateSamplenumFee(obj){
	var newChangeTestFeeParam = [];
	var totalFee = parseFloat(jQuery("#ordActualFee").val());
	var totalFactFee = parseFloat(jQuery("#ordTotalFactFee").val());
	totalTestFee = 0.00;
	newTotalTestFee = 0.00;
	var sampleNum = parseFloat(jQuery(obj).val());
	if(isNaN(sampleNum)){
		sampleNum = 0;
	}
	var rs = jQuery("#ectable_table tbody").children();
	rs.each(function(){
				var testPriceType = jQuery(this).children().eq(9).text();
				var testPrice = parseFloat(jQuery(this).children().eq(8).text());
				var testFee = parseFloat(jQuery(this).children().eq(10).text());
				totalTestFee = totalTestFee + testFee;
	    		if('1' == testPriceType){
	    			testFee = sampleNum*testPrice;
	    			jQuery(this).children().eq(10).text(testFee.toFixed(2));
	    			var changeTestFee = {};
	    			changeTestFee.itemId = jQuery(this).children().eq(11).text();
	    			changeTestFee.changeTestFee = testFee.toFixed(2);
	    			newChangeTestFeeParam.push(changeTestFee);
	    		}
	    		newTotalTestFee = newTotalTestFee + testFee;
	  		});
	totalFee = (totalFee - totalTestFee + newTotalTestFee).toFixed(2);
	totalFactFee = totalFactFee - totalTestFee + newTotalTestFee;
	jQuery("#ordActualFee").val(totalFee);
	jQuery("#ordTotalFactFee").val(totalFactFee);
	jQuery("#ordTestFee").val(newTotalTestFee.toFixed(2));
	changeTestFeeParam = newChangeTestFeeParam;
	
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

