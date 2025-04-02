<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic"%>
<%@page import="java.util.List"%>
<html>
<title>快速预约</title>
<head>
<base target='_self' />
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
	String userId = request.getSession().getAttribute(com.dhc.framework.base.config.CONFIG.LOGON_USERID).toString();
	String apparName = request.getAttribute("apparName").toString().replace(",", "");
	String apparId = request.getAttribute("apparIds").toString().replace(",", "");
	String orgId = request.getSession().getAttribute(com.dhc.framework.base.config.CONFIG.LOGON_ORGID).toString();
%>
<link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">

<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common_extend.css" type="text/css"/>
<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>

<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css"/>
 <script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
 <script type="text/javascript" src="<%=webPath%>/sams/common/js/validate_method.js"></script>
 <script type="text/javascript" src="<%=webPath %>/sams/common/js/validate_ecside.js"></script>
 <script type="text/javascript" src="<%=webPath%>/sams/ord/apply/OrdApplyCommon.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdApproveOfQuickEdit.js"></script>

<script type="text/javascript" src="<%=webPath%>/sams/common/fullcalendar/moment.min.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/common/fullcalendar/fullcalendar.min.js"></script>
<link rel="stylesheet" href="<%=webPath%>/sams/common/fullcalendar/fullcalendar.css" type="text/css"/>
<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css"/>
</head>
<body class="ilead-body">
<input type="hidden" id="applyTime" value="${appString }"/>
<div id="searchTool">
	<table>
		<tr>
			<td class="searchTool_name w110">仪器名称：</td>
			<td colspan="5" class="w1000">		
				<input type="text" id="AppName" disabled = "disabled" name="AppName"  style="width:300px" value="<%=apparName %>"/>
				<input type="hidden" id="apparId" disabled = "disabled" name="apparId" value="<%=apparId %>"/>
			</td>
		</tr>
	</table>
	<div class="container-fluid ilead-overBut">
		<div class="row ilead-overBut-box">
			<div class="col-xs-12">
				<div class="ilead-overBut-buts">
                	<input id="next_btn_4" type="button" class="ilead-overBut-ok fr" value="下一步" onclick="nextPage_4()"/>  
                	<input id="btnCreate" type="button" value="清空" class="btn_style fr" onclick="refetchCalendar()" />
				</div>
			</div>
		</div>
	</div>
</div>
<!-- 日期控件 -->
<div class="listBox" id="MainArea">
	<div id='calendar'></div>
</div>	
<div class="container-fluid ilead-overBut" id="mainDivBut">
		<div class="row ilead-overBut-box">
			<div class="col-xs-12">
				<div class="ilead-overBut-buts">
					<input id="savebtn" type="button" style="display: none"  class="ilead-overBut-ok fr" value="保存"  onclick="doSave(${flag})" />
					<input id="denyBtn" type="button"  class="ilead-overBut-no fr" value="否决"  onclick="doDeny(${flag})" />
					<input id="rejectbtn" type="button"  class="ilead-overBut-no fr" value="驳回"  onclick="doReject(${flag})" />
					<input id="approveBtn" type="button"  class="ilead-overBut-ok fr" value="通过"  onclick="doApprove(${flag})" />
				</div>
			</div>
		</div>
</div>

<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" style="width:850px;" id="mainDiv">
				<input type="hidden" id="apparIds" name="apparIds" value="${apparIds }">
				<input type="hidden" id="apparName" name="apparName" value="${apparName}">
				<input type="hidden" id="apparStr" name="apparStr" value="${apparStr}">
				<input type="hidden" id="actionType" name="actionType" value="${actionType }">
				<input type="hidden" id="ordId" name="ordId" value="${approveApply.ordId }">
				<input type="hidden" id="ordNo" name="ordNo" value="${approveApply.ordNo }">
				<input type="hidden" id="ordState" name="ordState" value="${approveApply.ordState }">
				<input type="hidden" id="belongUnit" name="belongUnit" value="${approveApply.belongUnit }">
				<input type="hidden" id="timeFlag"/>
				<input type="hidden" id="userId" name="userId" value="<%= userId%>">
				<input type="hidden" id="maxBookDays" name="maxBookDays" value="${maxBookDays }">
				<input type="hidden" id="advanceBookDays" name="advanceBookDays" value="${advanceBookDays }">
				<input type="hidden" id="createBy" name="createBy" value="${approveApply.createBy }">
				<input type="hidden" id="applyFlag" name="applyFlag" value="${applyFlag }"/>
				<input type="hidden" id="orgId" name="orgId" value="<%= orgId%>">
				<input type="hidden" id="orderModelType" name="orderModelType" value="${approveApply.ordModelType }">
				<!-- 委托单复制，不显示委托单编号 -->
				<c:if test="${actionType == 'edit' }">
					<span id="ordNoDiv" style="float:left;font-size:12px;margin-bottom:10px;font-weight:bold">委托单编号：${approveApply.ordNo }</span>
				</c:if>
				<div style="float:left;width:100%;" id="apparatusInfo">
					<h3>预约仪器 </h3>
					<div>
						<table id="apparaTable" name="apparaTable" border="0" style="width:100%">
							<tr id="apparaTabletr1" name="apparaTabletr1">
								<c:forEach items="${ apparList}" var="item" varStatus="status">
										<c:choose>
											<c:when test="${status.index==0 }">
												<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1" ><c:out value="${item.apparatusName }"></c:out></td>
												<input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
											</c:when>
											<c:otherwise>
												<td style="width:20px"></td>
												<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1" ><c:out value="${item.apparatusName }"></c:out></td>
												<input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
											</c:otherwise>
										</c:choose>
								</c:forEach>
								<td></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
				<div class="popupBox fl" style="width:850px;" id="timeInfo">
					<h3 style="width:200px">预约时间 </h3>
					<table style="margin-top:-40px" width="100%" border="0" cellspacing="0" cellpadding="0" id="timeTable1">
						<tr>
							<td colspan="6" class="fr">
								<input id="btnClose" type="button" value="预约时间" class="btn_style fr" onclick="timeControl()" />
							</td>
						</tr>
					</table>
					<div id="timeDiv"></div>
				</div>
		</div>
	</div>
	<div class="row">
	<div class="col-xs-12">
		<div class="popupBox fl" style="width:850px;" id="feeDiv">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<h3>费用信息 </h3>
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
				
				<tr>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">单价(元)</td>
					<td class="need w10"></td>
					<td align="left">
						<input type="text" name="quickTestPrice" id="quickTestPrice" value="${itemStandardInfo.testPrice }" readonly = "readonly"/>
					</td>
					<td align="right" style="width: 110px;color: #373942;font-size:12px;">检测费用(元)</td>
					<td class="need w10"></td>
					<td align="left">
						<input  type="text" name="ordActualFee" id="ordActualFee" value="${approveApply.ordActualFee }"/>
						<input  type="hidden" name="ordTestFee" id="ordTestFee" value="${approveApply.ordTestFee }" readonly = "readonly"/>
						<input  type="hidden" name="ordTotalFee" id="ordTotalFee" value="${approveApply.ordTotalFee }" readonly = "readonly"/>
					</td>
				</tr>
			</table>
		</div>
	</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" style="width:850px;" id="otherInfo">
				<form id="otherInfoForm" name="otherInfoForm">
					<div style="float:left;width:100%">
						<h3>承检方信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%">
							<tr>
								<td class="formName w100">承检方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveUnitName" name="ordReceiveUnitName" readonly="readonly" value="${approveApply.ordReceiveUnitName }"/>
									<input type="hidden" class="w140" id="ordReceiveUnit" name="ordReceiveUnit"  value="${approveApply.ordReceiveUnit }"/>
								</td>
								<td class="formName w100">承检研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveGroupName" name="ordReceiveGroupName"  readonly="readonly" value="${approveApply.ordReceiveGroupName }" />
									<input type="hidden" class="w140" id="ordReceiveGroup" name="ordReceiveGroup" value="${approveApply.ordReceiveGroup }" />
								</td>
								<td class="formName w100">承检人</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordReceiveName" name="ordReceiveName"  value="${approveApply.ordReceiveName }"  readonly="readonly" onclick="doSelectPerson()"/>
									<input type="hidden" class="w140" id="ordReceiveBy" name="ordReceiveBy"  value="${approveApply.ordReceiveBy }"/>
								</td>
							</tr>
							<tr>
								<td class="formName w100">电话</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceivePhone" name="ordReceivePhone"  readonly="readonly"  value="${approveApply.ordReceivePhone }"/></td>
								<td class="formName w100">Email</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceiveEmail" name="ordReceiveEmail"  readonly="readonly"  value="${approveApply.ordReceiveEmail }"/></td>
							</tr>
						</table>
					</div>	
					<div style="float:left;width:100%">
						<h3>委托方信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%">
							<tr>
								<td class="formName w100">委托方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignUnitName" name="ordConsignUnitName"  readonly="readonly" value="${approveApply.ordConsignUnitName }"/>
									<input type="hidden" class="w140" id="ordConsignUnit" name="ordConsignUnit" value="${approveApply.ordConsignUnit }"/>
								</td>
								<td class="formName w100">委托研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignGroupName" name="ordConsignGroupName"  readonly="readonly" value="${approveApply.ordConsignGroupName }"/>
									<input type="hidden" class="w140" id="ordConsignGroup" name="ordConsignGroup" value="${approveApply.ordConsignGroup }"/>
								</td>
								<td class="formName w100">付款人</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignName" name="ordConsignName"  readonly="readonly" value="${approveApply.ordConsignName }"/>
									<input type="hidden" class="w140" id="ordConsignBy" name="ordConsignBy" value="${approveApply.ordConsignBy }"/>
									<input type="hidden" class="w140" id="ordConsignPhone" name="ordConsignPhone" value="${approveApply.ordConsignPhone }"/>
									<input type="hidden" class="w140" id="ordConsignEmail" name="ordConsignEmail" value="${approveApply.ordConsignEmail }"/>
								</td>
							</tr>
							<tr>
								<td class="formName w100">联系人</td>
								<td class="need w10">*</td>
								<td>
									<input type="text" class="w140" id="ordApplyBy" name="ordApplyBy" value="${approveApply.ordApplyBy }" maxlength="16"/>
								</td>
								<td class="formName w100">联系电话</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyPhone" name="ordApplyPhone" value="${approveApply.ordApplyPhone }"/></td>
								<td class="formName w100">Email</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyEmail" name="ordApplyEmail" value="${approveApply.ordApplyEmail }"/></td>
							</tr>
						</table>
					</div>	
					<div style="float:left;width:100%">
						<h3>其他信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%" >
							<tr>
								<td class="formName w100">备注</td>
								<td class="need w10"></td>
								<td><textarea rows="3" cols="105"  id="remark" name="remark" >${approveApply.remark }</textarea></td>
							</tr>
							<c:if test="${actionType == 'copy' && approveApply.ordState !='02' && approveApply.ordState !='03'}">
								<tr style="height:50px;"></tr>
							</c:if>
						</table>
					</div>
					<c:if test="${(actionType != 'edit' &&  actionType != 'copy') || approveApply.ordState =='02' || approveApply.ordState =='03' || approveApply.ordState =='07'}">
						<div style="float:left;width:100%">
							<h3>意见及建议</h3>
						</div>
						<table  border="0" style="width:100%" >
							<tr>
								<td class="formName w100">答复</td>
								<td class="need w10"></td>
								<td><textarea rows="3" cols="105" id="ordResponse" name="ordResponse" readonly="readonly" >${approveApply.ordResponse}</textarea></td>
							</tr>
							<c:if test="${actionType == 'copy' }">
								<tr style="height:50px;"></tr>
							</c:if>
						</table>
					</c:if>
					<c:if test="${actionType != 'copy' }">
							<table  border="0" style="width:100%" >
								<tr>
									<td class="formName w505" >打印明细
										<input type="checkBox" id="ordPrintDetail" name="ordPrintDetail" ${approveApply.ordPrintDetail=='1'? 'checked="checked"':''} >
									</td>
									<td class="formName w90">打印回复
										<input type="checkBox" id="ordPrintRespond" name="ordPrintRespond" ${approveApply.ordPrintRespond=='1'? 'checked="checked"':''}>
									</td>
									<td class="formName w70">
										<a href = "javascript:" onclick = "viewFlow()"
										   style = "text-decoration:underline;color:blue">
										         处理过程
										</a>
									</td>
									<td class="need w10"></td>
									<td ></td>
								</tr>
									<tr style="height:50px;"></tr>
							</table>
					</c:if>
				</form>
			</div>
		</div>
	</div>
</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp"%>
</body>
</html>