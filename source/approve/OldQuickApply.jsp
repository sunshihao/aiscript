<html><head></head><body class="ilead-body">&lt;%@ page contentType="text/html;charset=UTF-8" %&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic"%&gt;
&lt;%@page import="java.util.List"%&gt;

<title>项目预约</title>

<base target="_self">
&lt;%
	// 获得应用上下文
	String webPath = request.getContextPath();
%&gt;
<link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">

<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true">
<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true">
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common_extend.css" type="text/css">
<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>


<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css">
 <script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
 <script type="text/javascript" src="<%=webPath%>/sams/common/js/validate_method.js"></script>
 <script type="text/javascript" src="<%=webPath %>/sams/common/js/validate_ecside.js"></script>
 <script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OldQuickApply.js?ver=20190430"></script>



	<c:if test="${viewType == '1' }">
		<div class="container-fluid ilead-overBut">
			<div class="row ilead-overBut-box">
				<div class="col-xs-12">
					<div class="ilead-overBut-buts">
						<input id="finish_btn" type="button" class="ilead-overBut-ok fr" value="完成" onclick="doFinish('${approveApply.ordId }','${approveApply.ordNo }')">  
					</div>
				</div>
			</div>
		</div>
	</c:if>

	<input type="hidden" id="apparIds" name="apparIds" value="${apparIds }">
	<input type="hidden" id="apparName" name="apparName" value="${apparName}">
	<input type="hidden" id="apparStr" name="apparStr" value="${apparStr}">
	<input type="hidden" id="actionType" name="actionType" value="${actionType }">
	<div class="container">
	<form id="ordApplyForm" name="ordApplyForm" method="post">
	<input type="hidden" id="ordId" name="ordId" value="${approveApply.ordId }">
	<input type="hidden" id="ordNo" name="ordNo" value="${approveApply.ordNo }">
	<input type="hidden" id="ordState" name="ordState" value="${approveApply.ordState }">
	<input type="hidden" id="belongUnit" name="belongUnit" value="${approveApply.belongUnit }">
	<span id="ordNoDiv" style="float:left;font-size:12px;margin-bottom:10px;font-weight:bold">委托单编号：${approveApply.ordNo }</span>
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" id="apparatusInfo">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tbody><tr>
						<td align="right" style="width: 300px;color: #373942;font-size:12px;"></td>
						<td class="need w10"></td>
						<td class="w300"></td>
						<td class="w300"></td>
						<!-- 
						<td class="w240" align="right" >
							<input id="btnClose" type="button" value="明细" class="btn_style" onclick="viewPriceDetail(${approveApply.ordId })" />
						</td>
						 -->
					</tr>
				</tbody></table>
				<h3>预约仪器 </h3>
				<div>
				<c:foreach items="${ apparList}" var="item" varstatus="status">
								<c:choose>
									<c:when test="${status.index==0 }">
										</c:when></c:choose></c:foreach><c:otherwise>
										</c:otherwise><table id="apparaTable" name="apparaTable" border="0" style="width:100%">
					<tbody><tr id="apparaTabletr1" name="apparaTabletr1">
						<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1">
											<c:out value="${item.apparatusName }"></c:out>
											 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
										</td>
									
									<td style="width:20px"></td>
										<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1">
											<c:out value="${item.apparatusName }"></c:out>
											 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
										</td>
									
								
						
						<td></td>
					</tr>
				</tbody></table>
			</div>
		</div>
	</div>
</div>
</form>
<div class="row">
	<div class="col-xs-12">
		<div class="ilead-table-box fl" id="timeInfo">
		<h3>预约时间 </h3>
			<div id="timeDiv">
				<ec:table items="OrdTimeList" var="ordTime" retrieverowscallback="limit" tableid="ordTimeList" action="${pageContext.request.contextPath}/ordApproveAction.do?method=saveTimeRequest" listwidth="100%" resizecolwidth="true" classic="true" toolbarcontent="extend">
					<ec:row recordkey="${ordTime.apparatusId}">		
						<ec:column width="10%" property="apparatusName" title="仪器名称" ellipsis="true">
						<ec:column width="12%" property="ordStarttime" title="预约开始时间" ellipsis="true" parse="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
						<ec:column width="12%" property="ordEndtime" title="预约结束时间" ellipsis="true" parse="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
						<ec:column width="10%" property="ordDuration" title="预计工时" ellipsis="true">
					</ec:column></ec:column></ec:column></ec:column></ec:row>
				</ec:table>
			</div>
	</div>
	</div>
</div>
<c:if test="${ActualTimeList!=null &amp;&amp; ActualTimeList!='[]' &amp;&amp; ActualTimeList!='' }">
	<div class="row">
		<div class="col-xs-12">
			<div class="ilead-table-box fl" id="timeInfo">
				<h3>实际检测时间</h3>
				<div>
					<div id="timeDiv">
						<ec:table items="ActualTimeList" var="actualTime" retrieverowscallback="limit" tableid="actualTimeList" listwidth="100%" resizecolwidth="true" classic="true" toolbarcontent="extend">
							<ec:row recordkey="${actualTime.apparatusId}">		
								<ec:column width="10%" property="apparatusName" title="仪器名称" ellipsis="true">
								<ec:column width="12%" property="testingStartTime" title="检测开始时间" ellipsis="true" parse="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
								<ec:column width="12%" property="finishTime" title="检测结束时间" ellipsis="true" parse="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss">
								<ec:column width="10%" property="testingUsefulTime" title="检测用时" ellipsis="true">
							</ec:column></ec:column></ec:column></ec:column></ec:row>
						</ec:table>
					</div>
				</div>
			</div>
		</div>
	</div>
</c:if>
<div class="row">
	<div class="col-xs-12">
		<div class="popupBox fl" id="feeDiv">
			<h3>费用信息 </h3><c:if test="${viewType == '1' || viewType == '2' }">
					</c:if><table width="100%" border="0" cellspacing="0" cellpadding="0">
				
				<!-- 
				<tr>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">检测项目</td>
					<td class="need w10"></td>
					<td align="left">
						<input type="text" name="itemName" id="itemName" value="${itemStandardInfo.itemName }" readonly = "readonly"/>
					</td>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">检测标准</td>
					<td class="need w10"></td>
					<td align="left">
						<input type="text" name="standardName" id="standardName" value="${itemStandardInfo.standardName }" readonly = "readonly"/>
					</td>
				</tr>
				 -->
				<tbody><tr>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">单价</td>
					<td class="need w10"></td>
					<td align="left">
						<input type="text" name="quickTestPrice" id="quickTestPrice" value="${itemStandardInfo.testPrice }" readonly="readonly">
					</td>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">检测费用</td>
					<td class="need w10"></td>
					<td align="left">
						<c:choose>
							<c:when test="${approveApply.ordState == '09' || approveApply.ordState == '10' }">
								<input type="text" name="ordActualFee" id="ordActualFee" value="${approveApply.ordTotalFee }" readonly="readonly">
							</c:when>
							<c:otherwise>
								<input type="text" name="ordActualFee" id="ordActualFee" value="${approveApply.ordActualFee }" readonly="readonly">
							</c:otherwise>
						</c:choose>
					</td>
				</tr>
				<tr>
						<td align="right" style="width: 110px;color: #373942;font-size:12px;">实际检测时长(小时)</td>
						<td class="need w10"></td>
						<td align="left">
							<input type="text" name="quickTestPrice" id="quickTestPrice" value="${ordModel.totalTime }" readonly="readonly">
						</td>
						<td align="right" style="width: 110px;color: #373942;font-size:12px;">实际检测费用</td>
						<td class="need w10"></td>
						<td align="left">
							<input type="text" name="ordTotalFactFee" id="ordTotalFactFee" value="${ordModel.ordTotalFactFee }">
						</td>
					</tr>
				
			</tbody></table>
		</div>
	</div>
</div>
<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl  m-b-60" id="otherInfo">
				<form id="otherInfoForm" name="otherInfoForm">
					<div style="float:left;width:100%">
						<h3>承检方信息</h3>
					</div>
					<div>
						<table border="0" style="width:100%">
							<tbody><tr>
								<td class="formName w110">承检方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveUnitName" name="ordReceiveUnitName" value="${approveApply.ordReceiveUnitName }">
									<input type="hidden" class="w140" id="ordReceiveUnit" name="ordReceiveUnit" value="${approveApply.ordReceiveUnit }">
								</td>
								<td class="formName w110">承检研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveGroupName" name="ordReceiveGroupName" value="${approveApply.ordReceiveGroupName }">
									<input type="hidden" class="w140" id="ordReceiveGroup" name="ordReceiveGroup" value="${approveApply.ordReceiveGroup }">
								</td>
								<td class="formName w110">承检人</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordReceiveName" name="ordReceiveName" value="${approveApply.ordReceiveName }">
									<input type="hidden" class="w140" id="ordReceiveBy" name="ordReceiveBy" value="${approveApply.ordReceiveBy }">
								</td>
							</tr>
							<tr>
								<td class="formName w110">电话</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceivePhone" name="ordReceivePhone" value="${approveApply.ordReceivePhone }"></td>
								<td class="formName w110">Email</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceiveEmail" name="ordReceiveEmail" value="${approveApply.ordReceiveEmail }"></td>
							</tr>
						</tbody></table>
					</div>	
					<div style="float:left;width:100%">
						<h3>委托方信息</h3>
					</div>
					<div>
						<table border="0" style="width:100%">
							<tbody><tr>
								<td class="formName w110">委托方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignUnitName" name="ordConsignUnitName" value="${approveApply.ordConsignUnitName }">
									<input type="hidden" class="w140" id="ordConsignUnit" name="ordConsignUnit" value="${approveApply.ordConsignUnit }">
								</td>
								<td class="formName w110">委托研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignGroupName" name="ordConsignGroupName" value="${approveApply.ordConsignGroupName }">
									<input type="hidden" class="w140" id="ordConsignGroup" name="ordConsignGroup" value="${approveApply.ordConsignGroup }">
								</td>
								<td class="formName w110">付款人</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignName" name="ordConsignName" value="${approveApply.ordConsignName }">
									<input type="hidden" class="w140" id="ordConsignBy" name="ordConsignBy" value="${approveApply.ordConsignBy }">
								</td>
							</tr>
							<tr>
								<td class="formName w110">联系人</td>
								<td class="need w10">*</td>
								<td>
									<input type="text" class="w140" id="ordApplyBy" name="ordApplyBy" value="${approveApply.ordApplyBy }">
								</td>
								<td class="formName w110">联系电话</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyPhone" name="ordApplyPhone" value="${approveApply.ordApplyPhone }"></td>
								<td class="formName w110">Email</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyEmail" name="ordApplyEmail" value="${approveApply.ordApplyEmail }"></td>
							</tr>
						</tbody></table>
					</div>	
					<div style="float:left;width:100%">
						<h3>其他信息</h3>
					</div>
					<div>
						<table border="0" style="width:100%;height: 100px">
							<tbody><tr>
								<td class="formName w110">备注</td>
								<td class="need w10"></td>
								<td><textarea rows="3" cols="105" id="remark" name="remark">${approveApply.remark }</textarea></td>
							</tr>
						</tbody></table>
					</div>
					<c:if test="${approveApply.ordResponse != null &amp;&amp; approveApply.ordResponse != ''}">
						<div style="float:left;width:100%">
							<h3>意见及建议</h3>
						</div>
						<div>
							<table border="0" style="width:100%">
								<tbody><tr>
									<td class="formName w110">答复</td>
									<td class="need w10"></td>
									<td>
										<textarea rows="3" cols="105" id="ordResponse" name="ordResponse" readonly="readonly">${approveApply.ordResponse}</textarea>
									</td>
								</tr>
							</tbody></table>
						</div>
					</c:if>
					
					<table border="0" style="width:100%">
						<tbody><tr>
							<td class="formName w600">
							</td>
							<td class="formName w90">
							</td>
							<td class="formName w80">
								<a href="javascript:" onclick="viewFlow()" style="text-decoration:underline;color:blue">
								          处理过程
								</a>
							</td>
							<td class="need w10"></td>
							<td></td>
						</tr>
					</tbody></table>
					</form>
				</div>
			</div>
		</div>
</div>
&lt;%@ include file="/framework/ui3/jsp/PostInit.jsp"%&gt;

</jsp:include></jsp:include></body></html>