<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/struts-logic.tld" prefix="logic"%>
<%@page import="java.util.List"%>
<html>
<title>项目预约</title>
<head>
<base target='_self' />
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
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
 <script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OldItemApply.js?v=<%=Math.random()%>"></script>
 <script type="text/javascript">
 	var consumList = "<%=request.getAttribute("consumList")%>";
 </script>
</head>
<body  class="ilead-body">

	<c:if test="${viewType == '1' }">
		<div class="container-fluid ilead-overBut">
			<div class="row ilead-overBut-box">
				<div class="col-xs-12">
					<div class="ilead-overBut-buts">
						<input id="finish_btn" type="button" class="ilead-overBut-ok fr" value="完成" onclick="doFinish('${approveApply.ordId }','${approveApply.ordNo }')"/>  
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
	<input type="hidden" id="belongUnit" name="belongUnit" value="${approveApply.belongUnit }">
	<input type="hidden" id="ordState" name="ordState" value="${approveApply.ordState }">
	<span id="ordNoDiv" style="float:left;font-size:12px;margin-bottom:10px;font-weight:bold">委托单编号：${approveApply.ordNo }</span>
	

	<div class="row">
	
		<div class="col-xs-12">
			
			<div class="popupBox fl" id="apparatusInfo">
				<h3>预约仪器 </h3>
				<div>
				<table id="apparaTable" name="apparaTable" border="0" style="width:100%">
					<tr id="apparaTabletr1" name="apparaTabletr1">
						<c:forEach items="${ apparList}" var="item" varStatus="status">
								<c:choose>
									<c:when test="${status.index==0 }">
										<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1" >
											<c:out value="${item.apparatusName }"></c:out>
											 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
										</td>
									</c:when>
									<c:otherwise>
										<td style="width:20px"></td>
										<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1" >
											<c:out value="${item.apparatusName }"></c:out>
											 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
										</td>
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
<div class="row">
	<div class="col-xs-12">
		<div class="popupBox fl" id="sampleInfo">
			<h3>样品信息 </h3>
			<div>
				<table  border="0" style="width:100%">
					<tr>
						<td class="formName w110">用户样品编号</td>
						<td class="need w10">*</td>
						<td><input type="text" class="w140" id="ordSampleno" name="ordSampleno" value="${approveApply.ordSampleno }"/></td>
						<td class="formName w110">样品数量</td>
						<td class="need w10">*</td>
						<td><input type="text" class="w140" id="ordSamplenum" name="ordSamplenum" value="${approveApply.ordSamplenum }" onchange="doUpdateSamplenumFee(this)"/></td>
						<td class="formName w110">样品处理</td>
						<td class="need w10"></td>
						<td>
							<select  class="w140"  id="ordTaskSampledispose" name="ordTaskSampledispose" >
								<c:forEach items="${sampleDisposeMap }" var="sampleDis">
									<c:if test="${approveApply.ordTaskSampledispose == sampleDis.key }">
										<option value="${sampleDis.key }" selected="selected">${sampleDis.value }</option>
									</c:if>
									<c:if test="${approveApply.ordTaskSampledispose != sampleDis.key }">
										<option value="${sampleDis.key }">${sampleDis.value }</option>
									</c:if>
								</c:forEach>
							</select>
						</td>
					</tr>
					<tr>
						<td class="formName w110">送样时间</td>
						<td class="need w10"></td>
						<td><input type="text" class="w140" id="ordSendsampleTime" name="ordSendsampleTime" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});" value="${approveApply.ordSendsampleTime }"/></td>
						<td class="formName w110">完成时间</td>
						<td class="need w10"></td>
						<td><input type="text" class="w140" id="ordFinishtime" name="ordFinishtime" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});" value="${approveApply.ordFinishtime }"/></td>
						<td class="formName w110">付费情况</td>
						<td class="need w10"></td>
						<td>
							<select  class="w140"  id="ordPaystate" name="ordPaystate" >
								<c:forEach items="${ordPayStateMap }" var="ordPay">
									<c:if test="${approveApply.ordPaystate == ordPay.key }">
										<option value="${ordPay.key }" selected="selected">${ordPay.value }</option>
									</c:if>
									<c:if test="${approveApply.ordPaystate != ordPay.key }">
										<option value="${ordPay.key }">${ordPay.value }</option>
									</c:if>
								</c:forEach>
							</select>
						</td>
					</tr>
					<tr>
						<td class="formName w110">样品分类</td>
						<td class="need w10"></td>
						<td>
							<select  class="w140"  id="ordSampleform" name="ordSampleform">
								<option value="">-请选择-</option>
								<c:forEach items="${elementShapeMap }" var="sam">
									<c:if test="${approveApply.ordSampleform == sam.key }">
										<option value="${sam.key }" selected="selected">${sam.value }</option>
									</c:if>
									<c:if test="${approveApply.ordSampleform != sam.key }">
										<option value="${sam.key }">${sam.value }</option>
									</c:if>
								</c:forEach>
							</select>
						</td>
					<c:if test="${approveApply.predictFlow !='' &&  approveApply.predictFlow != null}">
					
						<td class="formName w110">预计数据量</td>
						<td class="need w10"></td>
						<td><input type="text" class="w140" id="predictFlow" name="predictFlow"  value="${approveApply.predictFlow }"/></td>
					</c:if>
							<c:if test="${ordTestTypeState == '1' }">
								<td class="formName w110">测试分类</td>
								<td class="need w10">*</td>
								<td>
									<select class="w140" id="ordTestType" name="ordTestType" onchange="changeTestType()">
										<option value=""></option>
										<c:forEach items="${testTypeMap }" var="sam">
										<c:if test="${approveApply.ordTestType == sam.key }">
											<option value="${sam.key }" selected="selected">${sam.value }</option>
										</c:if>
										<c:if test="${approveApply.ordTestType != sam.key }">
											<option value="${sam.key }">${sam.value }</option>
										</c:if>
										</c:forEach>
									</select>
								</td>
							</c:if>
							</tr>
							<tr id="ordTestTypeRemarkTr" style="display: none;">
								<td class="formName w110">课程名称</td>
								<td class="need w10">*</td>
								<td colspan="4"><input type="text" class="w390" id="ordTestTypeRemark" name="ordTestTypeRemark" value="${approveApply.ordTestTypeRemark }" /></td>
							</tr>
					<tr>
						<td class="formName w110">样品及前处理描述</td>
						<td class="need w10"></td>
						<td  colspan="4"><input type="text" class="w390" id="ordSampledescribe" name="ordSampledescribe" value="${approveApply.ordSampledescribe }"/></td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</div>
</form>
<div class="row">
	<div class="col-xs-12">
		<div class="ilead-table-box fl" id="itemInfo">
		<h3>检测项目及标准 </h3>
			<div >
			<ec:table items="resultItemList" var="resultPara" retrieveRowsCallback="limit" tableId="ectable" 
				listWidth="100%" resizeColWidth="true" classic="true" 
				toolbarContent="extend"
				rowsDisplayed="50"
				>
				<ec:row recordKey="${resultPara.ordItemstandardId}">		
					<ec:column style="text-align:center;" width='12%' property="apparatusName" title="仪器名称<label style='color:red'>*</label>" ellipsis="true" />
					<ec:column style="text-align:center;" width='12%' property="itemName"  title="检测项目<label style='color:red'>*</label>" ellipsis="true" />	
					<ec:column style="text-align:center;" width='10%' property="standardName" title="检测标准<label style='color:red'>*</label>" ellipsis="true"/>
					<ec:column style="text-align:center;" width='10%' property="preStandardName" title="前处理标准<label style='color:red'>*</label>" ellipsis="true" />
					<ec:column style="text-align:center;" width='15%' property="selfStandard" title="前处理标准描述" ellipsis="true" />
					<ec:column style="text-align:center;" width='15%' property="precopeByConsign" title="由承检方前处理" ellipsis="true">
						<c:choose>
							<c:when test="${resultPara.precopeByConsign == '1'}">
								是
							</c:when>
							<c:otherwise>
								否
							</c:otherwise>
						</c:choose>
					</ec:column>
					<ec:column style="text-align:center;" width='10%' property="precopeDuration" title="前处理时长" ellipsis="true" />
					<ec:column style="text-align:center;" width='10%' property="sampleNum" title="前处理样品数" ellipsis="true" />
					<ec:column property="testPrice" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="analysisStandardType" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="testFee" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="ordItemstandardId" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="oldTime" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="totalTime" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="ordTotalFactFee" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="precopePrice" headerStyle="display:none;" style="display:none;"/>
					<ec:column property="precopeFee" headerStyle="display:none;" style="display:none;"/>
				</ec:row>
			</ec:table>
		</div>	
	</div>
	</div>
</div>
	<c:if test="${consumList!=null && consumList!='[]' && consumList!='' }">
	<div class="row">
		<div class="col-xs-12">
			<div class="ilead-table-box fl" id="consumablesInfo">
				<h3>耗材信息 </h3>
				<div>
					<ec:table items="consumList" var="resultcon" retrieveRowsCallback="limit" tableId="ectableConsu" 
						editable="true" 
						useAjax="true"
						action="${pageContext.request.contextPath}/standardAction.do?method=doEdit"
						listWidth="100%" resizeColWidth="true" classic="true" 
						toolbarContent="extend"
						>
						<ec:row recordKey="${resultcon.materialCostId}">		
							<ec:column width='20%' property="apparatusId" title="仪器名称" ellipsis="true" editTemplate="ecs_t_apparatusName">
								<c:out value="${resultcon.apparatusName}"></c:out>
							</ec:column>
							<ec:column property="apparatusName" headerStyle="display:none;" style="display:none;" ellipsis="true"/>
							<ec:column width='20%' property="consumablesId"  title="耗材名称" ellipsis="true" editTemplate="ecs_t_consumablesName">
								<c:out value="${resultcon.consumablesName}"></c:out>
							</ec:column>
							<ec:column property="consumablesName" headerStyle="display:none;"  style="display:none;" ellipsis="true"/>	
							<ec:column width='10%' property="consumablesPrice" title="单价" ellipsis="true"  editTemplate="ecs_t_consumablesPrice"/>
							<ec:column width='10%' property="consumablesUnit" title="单位" ellipsis="true" editTemplate="ecs_t_consumablesUnit"/>
							<ec:column width='10%' property="consumablesNum" title="数量" ellipsis="true" editTemplate="ecs_t_consumablesNum"/>
							<ec:column width='10%' property="consumablesFee" title="费用" ellipsis="true" editTemplate="ecs_t_consumablesFee"/>
						</ec:row>
					</ec:table>
				
					<!-- 编辑记录所用模板 -->
					<textarea id="ecs_t_consumablesNum" rows="" cols="" style="display:none">
						<input type="text" class="inputtext" onblur="ECSideUtil.updateEditCell(this);"  style="width:100%;" name="consumablesNum"  onchange="doUpdateConsuFee(this)" value="" />
					</textarea>
				</div>
			</div>
		</div>
	</div>
	</c:if>
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" id="feeDiv">
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<h3>费用信息 </h3>
					<tr>
						<td align="right" style="width: 110px;color: #373942;font-size:12px;">费用</td>
						<td class="need w10"></td>
						<td align="left">
							<c:choose>
								<c:when test="${approveApply.ordState == '09' || approveApply.ordState == '10' || viewType == '1' || viewType == '2'}">
									<input  type="text" name="ordActualFee" class="w100" id="ordActualFee" disabled="disabled"  value="${approveApply.ordTotalFee }"/>
								</c:when>
								<c:otherwise>
									<input  type="text" name="ordActualFee" class="w100" id="ordActualFee" disabled="disabled"  value="${approveApply.ordActualFee }"/>
								</c:otherwise>
							</c:choose>
						</td>
						<c:if test="${viewType == '1' || viewType == '2' }">
							<td align="right" style="width: 110px;color: #373942;font-size:12px;">实际费用</td>
							<td class="need w10"></td>
							<td align="left">
								<input type="text" name="ordTotalFactFee" class="w100" id="ordTotalFactFee"  value="${ordModel.ordTotalFactFee }"/>
								<%-- <c:choose>
									<c:when test="${!empty approveApply.ordActualFee}">
										<input type="text" name="ordTotalFactFee" class="w100" id="ordTotalFactFee"  value="${approveApply.ordActualFee }"/>
									</c:when>
									<c:otherwise>
										<input type="text" name="ordTotalFactFee" class="w100" id="ordTotalFactFee"  value="${ordModel.ordTotalFactFee }"/>
									</c:otherwise>
								</c:choose> --%>
							</td>
						</c:if>
						<input type="hidden" name="ordConsumablesFee" id="ordConsumablesFee"  value="${ordModel.ordConsumablesFee }"/>
						<input type="hidden" name="ordTestFee" id="ordTestFee"  value="${ordModel.ordTestFee }"/>
						<td class="w140" align="left">
							<input id="btnClose" type="button" value="明细" onclick="viewPriceDetail(${approveApply.ordId })" />
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl m-b-60" id="otherInfo">
				<form id="otherInfoForm" name="otherInfoForm">
					<div style="float:left;width:100%">
						<h3>承检方信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%">
							<tr>
								<td class="formName w110">承检方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveUnitName" name="ordReceiveUnitName"  value="${approveApply.ordReceiveUnitName }" />
									<input type="hidden" class="w140" id="ordReceiveUnit" name="ordReceiveUnit"  value="${approveApply.ordReceiveUnit }"/>
								</td>
								<td class="formName w110">承检研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordReceiveGroupName" name="ordReceiveGroupName"   value="${approveApply.ordReceiveGroupName }" />
									<input type="hidden" class="w140" id="ordReceiveGroup" name="ordReceiveGroup" value="${approveApply.ordReceiveGroup }" />
								</td>
								<td class="formName w110">承检人</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordReceiveName" name="ordReceiveName"  value="${approveApply.ordReceiveName }" />
									<input type="hidden" class="w140" id="ordReceiveBy" name="ordReceiveBy"  value="${approveApply.ordReceiveBy }"/>
								</td>
							</tr>
							<tr>
								<td class="formName w110">电话</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceivePhone" name="ordReceivePhone"    value="${approveApply.ordReceivePhone }" /></td>
								<td class="formName w110">Email</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="ordReceiveEmail" name="ordReceiveEmail"    value="${approveApply.ordReceiveEmail }" /></td>
							</tr>
						</table>
					</div>	
					<div style="float:left;width:100%">
						<h3>委托方信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%">
							<tr>
								<td class="formName w110">委托方名称</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignUnitName" name="ordConsignUnitName"   value="${approveApply.ordConsignUnitName }" />
									<input type="hidden" class="w140" id="ordConsignUnit" name="ordConsignUnit" value="${approveApply.ordConsignUnit }"/>
								</td>
								<td class="formName w110">委托研究组</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignGroupName" name="ordConsignGroupName"   value="${approveApply.ordConsignGroupName }" />
									<input type="hidden" class="w140" id="ordConsignGroup" name="ordConsignGroup" value="${approveApply.ordConsignGroup }"/>
								</td>
								<td class="formName w110">付款人</td>
								<td class="need w10"></td>
								<td>
									<input type="text" class="w140" id="ordConsignName" name="ordConsignName"   value="${approveApply.ordConsignName }" />
									<input type="hidden" class="w140" id="ordConsignBy" name="ordConsignBy" value="${approveApply.ordConsignBy }"/>
								</td>
							</tr>
							<tr>
								<td class="formName w110">联系人</td>
								<td class="need w10">*</td>
								<td>
									<input type="text" class="w140" id="ordApplyBy" name="ordApplyBy" value="${approveApply.ordApplyBy }"/>
								</td>
								<td class="formName w110">联系电话</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyPhone" name="ordApplyPhone" value="${approveApply.ordApplyPhone }" /></td>
								<td class="formName w110">Email</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordApplyEmail" name="ordApplyEmail" value="${approveApply.ordApplyEmail }" /></td>
							</tr>
							<tr>
								<td class="formName w110">课题</td>
								<td class="need w10">*</td>
								<td>
									<select id="ordSubjectId" name="ordSubjectId" class="w140" >
										<c:if test="${ordTopicMap=='' || ordTopicMap=='{}' }">
													<option value="${topic.key }" selected="selected">现金</option>
										</c:if>
										<c:forEach items="${ordTopicMap }" var="topic">
												<c:if test="${approveApply.ordSubjectId == '0' }">
													<option value="${topic.key }" selected="selected">现金</option>
												</c:if>
												<c:if test="${approveApply.ordSubjectId == topic.key }">
													<option value="${topic.key }" selected="selected">${topic.value }</option>
												</c:if>
												<c:if test="${approveApply.ordSubjectId != topic.key }">
													<option value="${topic.key }">${topic.value }</option>
												</c:if>
										</c:forEach>
									</select>
								</td>
							</tr>
						</table>
					</div>	
					<div style="float:left;width:100%">
						<h3>其他信息</h3>
					</div>
					<div>
						<table  border="0" style="width:100%" >
							<tr>
								<td class="formName w110">备注</td>
								<td class="need w10"></td>
								<td><textarea rows="3" cols="105"  id="remark" name="remark" >${approveApply.remark }</textarea></td>
							</tr>
						</table>
					</div>
					<c:if test="${approveApply.ordResponse != null && approveApply.ordResponse != ''}">
						<div style="float:left;width:100%">
							<h3>意见及建议</h3>
						</div>
						<div>
							<table  border="0" style="width:100%" >
								<tr>
									<td class="formName w110">答复</td>
									<td class="need w10"></td>
									<td>
										<textarea rows="3" cols="105" id="ordResponse" name="ordResponse" readonly="readonly" >${approveApply.ordResponse}</textarea>
									</td>
								</tr>
							</table>
						</div>
					</c:if>
					
					<table  border="0" style="width:100%" >
						<tr>
							<td class="formName w600" >
							</td>
							<td class="formName w90">
							</td>
							<td class="formName w80">
								<a href = "javascript:" onclick = "viewFlow()"
								   style = "text-decoration:underline;color:blue">
								          处理过程
								</a>
							</td>
							<td class="need w10"></td>
							<td ></td>
						</tr>
					</table>
					</form>
				</div>
			</div>
		</div>
	</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp"%>
</body>
</html>