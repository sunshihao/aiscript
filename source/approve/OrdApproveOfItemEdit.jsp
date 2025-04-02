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
	String orgId = request.getSession().getAttribute(com.dhc.framework.base.config.CONFIG.LOGON_ORGID).toString();
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
 <script type="text/javascript" src="<%=webPath%>/sams/ord/apply/OrdApplyCommon.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdApproveOfItemEdit.js?v=<%=Math.random()%>"></script>


	<input type="hidden" id="apparIds" name="apparIds" value="${apparIds }">
	<input type="hidden" id="apparName" name="apparName" value="${apparName}">
	<input type="hidden" id="apparStr" name="apparStr" value="${apparStr}">
	<input type="hidden" id="actionType" name="actionType" value="${actionType }">
	<input type="hidden" id="consumList" name="consumList" value="${consumList }">
	<div class="container-fluid ilead-overBut">
		<div class="row ilead-overBut-box">
			<div class="col-xs-12">
				<div class="ilead-overBut-buts">
					<input id="savebtn" type="button" style="display: none" class="ilead-overBut-ok fr" value="保存" onclick="doSave(${flag})">
					<input id="denyBtn" type="button" class="ilead-overBut-no fr" value="否决" onclick="doDeny(${flag})">
					<input id="rejectbtn" type="button" class="ilead-overBut-no fr" value="驳回" onclick="doReject(${flag})">
					<input id="approveBtn" type="button" class="ilead-overBut-ok fr" value="通过" onclick="doApprove(${flag})">
				</div>
			</div>
		</div>
	</div>
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl">
				<input type="hidden" id="ordId" name="ordId" value="${approveApply.ordId }">
				<input type="hidden" id="ordNo" name="ordNo" value="${approveApply.ordNo }">
				<input type="hidden" id="ordState" name="ordState" value="${approveApply.ordState }">
				<input type="hidden" id="belongUnit" name="belongUnit" value="${approveApply.belongUnit }">
				<input type="hidden" id="createBy" name="createBy" value="${approveApply.createBy }">
				<input type="hidden" id="applyFlag" name="applyFlag" value="${applyFlag }">
				<input type="hidden" id="orgId" name="orgId" value="<%= orgId%>">
				<!-- 委托单复制，不显示委托单编号 -->
				<c:if test="${actionType == 'edit' }">
					<span id="ordNoDiv" style="float:left;font-size:12px;margin-bottom:10px;font-weight:bold">委托单编号：${approveApply.ordNo }</span>
				</c:if>
				<div style="float:left;width:100%;" id="apparatusInfo">
					<h3 style="width:200px">预约仪器 </h3>
					<div>
						<table style="margin-top:-40px" width="100%" border="0" cellspacing="0" cellpadding="0">
							<tbody><tr>
								<td colspan="6" class="fr">
									<input id="btnClose" type="button" value="添加仪器" class="btn_style fr" onclick="doOpenAddAppar()">
								</td>
							</tr>
						</tbody></table>
					
						<c:foreach items="${ apparList}" var="item" varstatus="status">
										<c:choose>
											<c:when test="${status.index==0 }">
												</c:when></c:choose></c:foreach><c:otherwise>
												</c:otherwise><table id="apparaTable" name="apparaTable" border="0" style="width:100%">
							<tbody><tr id="apparaTabletr1" name="apparaTabletr1">
								<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1">
													<c:out value="${item.apparatusName }"></c:out>
													 <font color="red" onclick="doDeleAppar(this,'${item.apparatusId }','${item.apparatusName }')">x</font>
													 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
												</td>
											
											<td style="width:20px"></td>
												<td class="tab_start" style="width:300px " id="apparaTabletd1" name="apparaTabletd1">
													<c:out value="${item.apparatusName }"></c:out>
													 <font color="red" onclick="doDeleAppar(this,'${item.apparatusId }','${item.apparatusName }')">x</font>
													 <input type="hidden" id="apparatusId" name="apparatusId" value="${item.apparatusId }">
												</td>
											
										
								
								
								<td></td>
							</tr>
						</tbody></table>
					</div>
				</div>	
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" id="sampleInfo">
					<form id="ordApplyForm" name="ordApplyForm" method="post">
					<h3>样品信息 </h3>
					<div>
						<c:if test="${approveApply.predictFlow !=null &amp;&amp; approveApply.predictFlow !='' }">
								</c:if><c:if test="${ordTestTypeState == '1' }">
								</c:if><table border="0" style="width:100%">
							<tbody><tr>
								<td class="formName w110">用户样品编号</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordSampleno" name="ordSampleno" value="${approveApply.ordSampleno }"></td>
								<td class="formName w110">样品数量</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordSamplenum" name="ordSamplenum" value="${approveApply.ordSamplenum }" onchange="testSamplenumChange(this)"></td>
								<td class="formName w110">样品处理</td>
								<td class="need w10"></td>
								<td>
									<select class="w140" id="ordTaskSampledispose" name="ordTaskSampledispose">
										
											
												<option value="${sampleDis.key }" selected="selected">${sampleDis.value }</option>
											
											
												<option value="${sampleDis.key }">${sampleDis.value }</option>
											
										
									</select>
								</td>
							</tr>
							<tr>
								<td class="formName w110">送样时间</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordSendsampleTime" name="ordSendsampleTime" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});" value="${approveApply.ordSendsampleTime }"></td>
								<td class="formName w110">完成时间</td>
								<td class="need w10">*</td>
								<td><input type="text" class="w140" id="ordFinishtime" name="ordFinishtime" readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});" value="${approveApply.ordFinishtime }"></td>
								<td class="formName w110">付费情况</td>
								<td class="need w10"></td>
								<td>
									<select class="w140" id="ordPaystate" name="ordPaystate">
										
											
												<option value="${ordPay.key }" selected="selected">${ordPay.value }</option>
											
											
												<option value="${ordPay.key }">${ordPay.value }</option>
											
										
									</select>
								</td>
							</tr>
							<tr>
								<td class="formName w110">样品分类</td>
								<td class="need w10"></td>
								<td>
									<select class="w140" id="ordSampleform" name="ordSampleform">
										
											
												<option value="${sam.key }" selected="selected">${sam.value }</option>
											
											
												<option value="${sam.key }">${sam.value }</option>
											
										
									</select>
								</td>
							<td class="formName w110">预计数据量</td>
								<td class="need w10"></td>
								<td><input type="text" class="w140" id="predictFlow" name="predictFlow" value="${approveApply.predictFlow }"></td>
							
							<td class="formName w110">测试分类</td>
								<td class="need w10">*</td>
								<td>
									<select class="w140" id="ordTestType" name="ordTestType" onchange="changeTestType()">
										<option value=""></option>
										
										
											<option value="${sam.key }" selected="selected">${sam.value }</option>
										
										
											<option value="${sam.key }">${sam.value }</option>
										
										
									</select>
								</td>
							
							</tr>
							<tr id="ordTestTypeRemarkTr" style="display: none;">
								<td class="formName w110">课程名称</td>
								<td class="need w10">*</td>
								<td colspan="4"><input type="text" class="w390" id="ordTestTypeRemark" name="ordTestTypeRemark" value="${approveApply.ordTestTypeRemark }"></td>
							</tr>
							<tr>
								<td class="formName w110">样品及前处理描述</td>
								<td class="need w10"></td>
								<td colspan="4"><input type="text" class="w390" id="ordSampledescribe" name="ordSampledescribe" value="${approveApply.ordSampledescribe }"></td>
							</tr>
						</tbody></table>
					</div>
					</form>
				</div>
			</div>
		</div>
<div class="row">
	<div class="col-xs-12">
		<div class="ilead-table-box fl" id="itemInfo">
			<h3>检测项目及标准 </h3>
			<div>
				<ec:table items="resultItemList" var="resultPara" retrieverowscallback="limit" tableid="ectable" editable="true" useajax="true" action="${pageContext.request.contextPath}/standardAction.do?method=doEdit" listwidth="100%" resizecolwidth="true" classic="true" toolbarcontent="add extend" rowsdisplayed="50">
					<ec:row recordkey="${resultPara.ordItemstandardId}">
						
						<ec:column width="10%" property="apparatusId" title="仪器名称<label style='color:red'>*</label>" edittemplate="ecs_t_apparatusName">
							<select name="apparatusId" style="width:100%;" onblur="updateEditCell(this);" onchange="apparChange(this,'itemId','edit')">
								<option value="">-请选择-</option>
								
									
										
											<option value="${appar.key}" selected="selected">${appar.value }</option>
										
										
											<option value="${appar.key}">${appar.value }</option>
										
									
									
								
							</select>
							<input type="hidden" id="apparatusName" name="apparatusName" value="${resultPara.apparatusName}">
						</ec:column>
						<ec:column width="10%" property="itemId" title="检测项目<label style='color:red'>*</label>" edittemplate="ecs_t_elementName">
							<select name="itemId" style="width:100%;" onblur="updateEditCell(this);" onchange="apparChange(this,'standardId','edit')">
								<option value="">-请选择-</option>
								
									
										<option value="${item.key}" selected="selected">${item.value }</option>
									
									
										<option value="${item.key}">${item.value }</option>
									
								
							</select>
							<input type="hidden" id="itemName" name="itemName" value="${resultPara.itemName}">
						</ec:column>	
						<ec:column width="12%" property="standardId" title="检测标准<label style='color:red'>*</label>" edittemplate="ecs_t_standardId">
							<select name="standardId" style="width:100%;" onblur="updateEditCell(this);" onchange="apparChange(this,'precopeId','edit')">
								<option value="">-请选择-</option>
								
									
										
											<option value="${standard.key}" selected="selected">${standard.value }</option>
										
										
											<option value="${standard.key}">${standard.value }</option>
										
									
								
							</select>
							<input type="hidden" id="standardName" name="standardName" value="${resultPara.standardName}">
							<input type="hidden" id="testPrice" name="testPrice" value="${resultPara.testPrice}">
							<input type="hidden" id="testFee" name="testFee" value="${resultPara.testFee}">
							<input type="hidden" id="analysisStandardType" name="analysisStandardType" value="${resultPara.analysisStandardType}">
						</ec:column>
						<ec:column width="10%" property="precopeId" title="前处理标准<label style='color:red'>*</label>" edittemplate="ecs_t_precopeId">
							<select name="precopeId" style="width:100%;" onblur="updateEditCell(this);" onchange="doChangePrecope(this,&quot;edit&quot;)">
								<option value="">-请选择-</option>
								
									
										
											<option value="${preStandard.key}" selected="selected">${preStandard.value }</option>
										
										
											<option value="${preStandard.key}">${preStandard.value }</option>
										
									
								
							</select>
							<input type="hidden" id="preStandardName" name="preStandardName" value="${resultPara.preStandardName}">
							<input type="hidden" id="precopePrice" name="precopePrice" value="${resultPara.precopePrice}">
							<input type="hidden" id="precopeFee" name="precopeFee" value="${resultPara.precopeFee}">
							<input type="hidden" id="precopeStandardType" name="precopeStandardType" value="${resultPara.precopeStandardType}">
						</ec:column>
						<ec:column width="10%" property="selfStandard" title="检测标准描述" edittemplate="ecs_t_selfStandard">
							<input type="text" style="width:100%;" name="selfStandard" id="selfStandard" value="${resultPara.selfStandard}" onblur="updateEditCell(this);">
						</ec:column>
						<ec:column width="10%" property="precopeByConsign" title="由承检方前处理" edittemplate="ecs_t_precopeByConsign">
							<c:choose>
								<c:when test="${resultPara.precopeByConsign =='1'}">
									<input type="checkBox" style="width:100%;" checked="checked" name="precopeByConsignBox" id="precopeByConsignBox" onblur="updateEditCell(this);" onclick="changePreCope(this,'edit')">
									<input type="hidden" class="inputtext" style="width:100%;" name="precopeByConsign" id="precopeByConsign" value="1">
								</c:when>
								<c:otherwise>
									<input type="checkBox" style="width:100%;" name="precopeByConsignBox" id="precopeByConsignBox" onblur="updateEditCell(this);" onclick="changePreCope(this,'edit')">
									<input type="hidden" class="inputtext" style="width:100%;" name="precopeByConsign" id="precopeByConsign" value="1"> 
								</c:otherwise>
							</c:choose>
						</ec:column>
						
						<ec:column width="10%" property="precopeDuration" title="前处理时长" edittemplate="ecs_t_precopeDuration">
							<c:choose>
							  <c:when test="${resultPara.precopeByConsign =='1'}">
							    <input type="text" class="inputtext" style="width:100%;" name="precopeDuration" id="precopeDuration" value="${resultPara.precopeDuration }" onblur="updateEditCell(this);" onchange="doChangeItemFee(this,'edit')">
							  </c:when>
							  <c:otherwise>
							    <input type="text" class="inputtext" style="width:100%;" name="precopeDuration" id="precopeDuration" value="${resultPara.precopeDuration }" onblur="updateEditCell(this);" onchange="doChangeItemFee(this,'edit')" disabled="disabled">
							  </c:otherwise>
							</c:choose>
							
						</ec:column>
						<ec:column width="10%" property="sampleNum" title="前处理样品数" edittemplate="ecs_t_sampleNum">
						    <c:choose>
						      <c:when test="${resultPara.precopeByConsign =='1'}">
						        <input type="text" class="inputtext" style="width:100%;" name="sampleNum" id="sampleNum" value="${resultPara.sampleNum }" onblur="updateEditCell(this);" onchange="doChangeItemFee(this,'edit')">
						      </c:when>
						      <c:otherwise>
						        <input type="text" class="inputtext" style="width:100%;" name="sampleNum" id="sampleNum" value="${resultPara.sampleNum }" onblur="updateEditCell(this);" onchange="doChangeItemFee(this,'edit')" disabled="disabled">
						      </c:otherwise>
						    </c:choose>
						</ec:column>
					    <ec:column style="text-align:center;" width="10%" property="_2" title="操作" sortable="false" editable="false" viewsallowed="html">
							<a style="color:black" href="javascript:return void(0)" onclick="deleItemStan(this,'edit','${resultPara.ordItemstandardId}')">删除</a>
						</ec:column>
					</ec:row>
				</ec:table>
				
				<!-- 新建记录所用模板 -->
				<textarea id="add_template" rows="" cols="" style="display:none">					&lt;select class="inputtext"  style="width:100%;" name="apparatusId" id="apparatusId" onchange="apparChange(this,'itemId','add')"&gt;
					&lt;/select&gt;
					&lt;input type="hidden" id="apparatusName" name="apparatusName"&gt;
					&lt;tpsp /&gt;
					&lt;select class="inputtext"  style="width:100%;" name="itemId" id="itemId" onchange="apparChange(this,'standardId','add')"&gt;&lt;/select&gt;
					&lt;input type="hidden" id="itemName" name="itemName"&gt;
					&lt;tpsp /&gt;
					&lt;select class="inputtext"  style="width:100%;" name="standardId" id="standardId" onchange="apparChange(this,'precopeId','add')"&gt;
						
					&lt;/select&gt;
					&lt;input type="hidden" id="standardName" name="standardName"&gt;
					&lt;input type="hidden" id="testPrice" name="testPrice"&gt;
					&lt;input type="hidden" id="testFee" name="testFee"&gt;
					&lt;input type="hidden" id="analysisStandardType" name="analysisStandardType"&gt;
					&lt;tpsp /&gt;
					&lt;select class="inputtext"  style="width:100%;" name="precopeId" id="precopeId" onchange="doChangePrecope(this,'add')"&gt;
						
					&lt;/select&gt;
					&lt;input type="hidden" id="preStandardName" name="preStandardName"&gt;
					&lt;input type="hidden" id="precopePrice" name="precopePrice"&gt;
					&lt;input type="hidden" id="precopeFee" name="precopeFee"&gt;
					&lt;input type="hidden" id="precopeStandardType" name="precopeStandardType"&gt;
					&lt;tpsp /&gt;
					&lt;input type="text" class="inputtext"  style="width:100%;" name="selfStandard" id="selfStandard" value=""/&gt;
					&lt;tpsp /&gt;
					&lt;input type="checkBox" class="inputtext"  style="width:100%;" name="precopeByConsignBox" id="precopeByConsignBox" value="" onclick="changePreCope(this,'add')"/&gt;
					&lt;input type="hidden" class="inputtext"  style="width:100%;" name="precopeByConsign" id="precopeByConsign" value="0"/&gt;
					&lt;tpsp /&gt;
					
					&lt;input type="text" class="inputtext"  style="width:100%;" name="precopeDuration" id="precopeDuration" value="" onchange="doChangeItemFee(this,'add')" disabled = "disabled"/&gt;
					&lt;tpsp /&gt;
					&lt;input type="text" class="inputtext"  style="width:100%;" name="sampleNum" id="sampleNum" value="" onchange="doChangeItemFee(this,'add')" disabled = "disabled"/&gt;
					&lt;tpsp /&gt;
						&lt;a style="color:black" href="javascript:" onclick="deleItemStan(this,'add','${resultPara.ordItemstandardId}')"&gt;删除&lt;/a&gt;
					&lt;tpsp /&gt;				  	
				</textarea>
			</div>	
		</div>
	</div>
	</div>
	
	<div class="row" id="consumListDiv">
		<div class="col-xs-12">
			<div class="ilead-table-box fl" style="display:none " id="consumablesInfo">
				<h3>耗材信息 </h3>
				<div>
					<ec:table items="consumList" var="resultcon" retrieverowscallback="limit" tableid="ectableConsu" editable="true" useajax="true" action="${pageContext.request.contextPath}/standardAction.do?method=doEdit" listwidth="100%" resizecolwidth="true" classic="true" toolbarcontent="extend">
						<ec:row recordkey="${resultcon.materialCostId}">		
							<ec:column width="20%" property="apparatusId" title="仪器名称" ellipsis="true" edittemplate="ecs_t_apparatusName">
								<input type="text" class="inputtext" style="width:100%;" name="apparatusName" readonly="readonly" id="apparatusName" value="${resultcon.apparatusName}">
								<input type="text" class="hidden" style="width:100%;" name="apparatusId" id="apparatusId" value="${resultcon.apparatusId}">
							</ec:column>
							<ec:column width="20%" property="consumablesId" title="耗材名称" ellipsis="true" edittemplate="ecs_t_consumablesName">
								<input type="text" class="inputtext" style="width:100%;" name="consumablesName" readonly="readonly" id="consumablesName" value="${resultcon.consumablesName }">
								<input type="hidden" class="inputtext" style="width:100%;" name="consumablesId" id="consumablesId" value="${resultcon.consumablesId }">
							</ec:column>	
							<ec:column width="10%" property="consumablesPrice" title="单价" ellipsis="true" edittemplate="ecs_t_consumablesPrice">
								<input type="text" class="inputtext" style="width:100%;" name="consumablesPrice" id="consumablesPrice" readonly="readonly" value="${resultcon.consumablesPrice }">
							</ec:column>
							<ec:column width="10%" property="consumablesUnit" title="单位" ellipsis="true" edittemplate="ecs_t_consumablesUnit">
								<input type="text" class="inputtext" style="width:100%;" name="consumablesUnit" id="consumablesUnit" readonly="readonly" value="${resultcon.consumablesUnit }">
							</ec:column>
							<ec:column width="10%" property="consumablesNum" title="数量<label style='color:red'>*</label>" ellipsis="true" edittemplate="ecs_t_consumablesNum">
								<input type="text" class="inputtext" style="width:100%;" name="consumablesNum" id="consumablesNum" value="${resultcon.consumablesNum }" onchange="doCalculateConsuFee(this,'edit')">
							</ec:column>
							<ec:column width="10%" property="consumablesFee" title="费用" ellipsis="true" edittemplate="ecs_t_consumablesFee">
								<input type="text" class="inputtext" style="width:100%;" name="consumablesFee" id="consumablesFee" readonly="readonly" value="${resultcon.consumablesFee }">
							</ec:column>
						</ec:row>
					</ec:table>
				
				<!-- 新建记录所用模板 -->
					<textarea id="add_template_con" rows="" cols="" style="display:none">						&lt;input type="text" class="inputtext"  style="width:100%;"  name="apparatusName" readonly="readonly" id="targetGrade" value=""/&gt;
						&lt;input type="text" class="hidden"  style="width:100%;" name="apparatusId" id="apparatusId" value=""/&gt;
						&lt;tpsp /&gt;
						&lt;input type="text" class="inputtext"  style="width:100%;"  name="consumablesName" readonly="readonly" id="consumablesName" value=""/&gt;
						&lt;input type="hidden" class="inputtext"  style="width:100%;"  name="consumablesId" id="consumablesId" value=""/&gt;
						&lt;tpsp /&gt;
						&lt;input type="text" class="inputtext"  style="width:100%;"  name="consumablesPrice" readonly="readonly" id="consumablesPrice" value=""/&gt;
						&lt;tpsp /&gt;
						&lt;input type="text" class="inputtext"  style="width:100%;"  name="consumablesUnit" readonly="readonly" id="consumablesUnit" value=""/&gt;
						&lt;tpsp /&gt;
							&lt;input type="text" class="inputtext"  style="width:100%;" name="consumablesNum" id="consumablesNum" value="" onchange="doCalculateConsuFee(this)"/&gt;
						&lt;tpsp /&gt;	
						  	&lt;input type="text" class="inputtext"  style="width:100%;"  name="consumablesFee" readonly="readonly" id="consumablesFee" value=""/&gt;
						 &lt;tpsp /&gt; 	
					</textarea>
					<!-- 编辑记录所用模板 -->
					<textarea id="ecs_t_consumablesNum" rows="" cols="" style="display:none">						&lt;input type="text" class="inputtext" onblur="ECSideUtil.updateEditCell(this);"  style="width:100%;" name="consumablesNum"  onchange="doUpdateConsuFee(this)" value="" /&gt;
					</textarea>
				</div>
				</div>
			</div>
		</div>
	
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl" id="feeDiv">
				<table border="0" cellspacing="0" cellpadding="0">
					<tbody><tr>
						<td><h3>费用信息 </h3></td>
						<td style="width: 240px"></td>
						<td align="right" style="width: 60px;color: #373942;font-size:12px;">总费用</td>
						<td class="need w10"></td>
						<td width="150px">
							<input style="width:140px" type="text" name="ordActualFee" id="ordActualFee" value="${approveApply.ordActualFee }">
							<input type="hidden" name="ordTotalFee" id="ordTotalFee" value="${approveApply.ordTotalFee }">
							<input type="hidden" name="ordTestFee" id="ordTestFee" value="${approveApply.ordTestFee }">
							<input type="hidden" name="ordPrecopeFee" id="ordPrecopeFee" value="${approveApply.ordPrecopeFee }">
							<input type="hidden" name="ordConsumablesFee" id="ordConsumablesFee" value="${approveApply.ordConsumablesFee }"> 
						</td>
						<td width="100px">
							<input id="btnClose" class="btn btn-default" type="button" value="明细" onclick="viewPriceDetail()">
						</td>
					</tr>
				</tbody></table>
			</div>
		</div>
	</div>
<div class="row">
	<div class="col-xs-12">
		<div class="popupBox fl m-b-60" id="otherInfo">
			<form id="otherInfoForm" name="otherInfoForm">
			<h3>承检方信息</h3>
			<div>
				<table border="0" style="width:100%">
					<tbody><tr>
						<td class="formName w110">承检方名称</td>
						<td class="need w10"></td>
						<td>
							<input type="text" class="w140" id="ordReceiveUnitName" name="ordReceiveUnitName" readonly="readonly" value="${approveApply.ordReceiveUnitName }">
							<input type="hidden" class="w140" id="ordReceiveUnit" name="ordReceiveUnit" value="${approveApply.ordReceiveUnit }">
						</td>
						<td class="formName w110">承检研究组</td>
						<td class="need w10"></td>
						<td>
							<input type="text" class="w140" id="ordReceiveGroupName" name="ordReceiveGroupName" readonly="readonly" value="${approveApply.ordReceiveGroupName }">
							<input type="hidden" class="w140" id="ordReceiveGroup" name="ordReceiveGroup" value="${approveApply.ordReceiveGroup }">
						</td>
						<td class="formName w110">承检人</td>
						<td class="need w10">*</td>
						<td><input type="text" class="w140" id="ordReceiveName" name="ordReceiveName" value="${approveApply.ordReceiveName }" readonly="readonly" onclick="doSelectPerson()">
							<input type="hidden" class="w140" id="ordReceiveBy" name="ordReceiveBy" value="${approveApply.ordReceiveBy }">
						</td>
					</tr>
					<tr>
						<td class="formName w110">电话</td>
						<td class="need w10"></td>
						<td><input type="text" class="w140" id="ordReceivePhone" name="ordReceivePhone" readonly="readonly" value="${approveApply.ordReceivePhone }"></td>
						<td class="formName w110">Email</td>
						<td class="need w10"></td>
						<td><input type="text" class="w140" id="ordReceiveEmail" name="ordReceiveEmail" readonly="readonly" value="${approveApply.ordReceiveEmail }"></td>
					</tr>
				</tbody></table>
			</div>	
			<div class="fl" style="width:100%">
				<h3>委托方信息</h3>
			</div>
			<div>
				<table border="0" style="width:100%">
					<tbody><tr>
						<td class="formName w110">委托方名称</td>
						<td class="need w10"></td>
						<td>
							<input type="text" class="w140" id="ordConsignUnitName" name="ordConsignUnitName" readonly="readonly" value="${approveApply.ordConsignUnitName }">
							<input type="hidden" class="w140" id="ordConsignUnit" name="ordConsignUnit" value="${approveApply.ordConsignUnit }">
						</td>
						<td class="formName w110">委托研究组</td>
						<td class="need w10"></td>
						<td>
							<input type="text" class="w140" id="ordConsignGroupName" name="ordConsignGroupName" readonly="readonly" value="${approveApply.ordConsignGroupName }">
							<input type="hidden" class="w140" id="ordConsignGroup" name="ordConsignGroup" value="${approveApply.ordConsignGroup }">
						</td>
						<td class="formName w110">付款人</td>
						<td class="need w10"></td>
						<td>
							<input type="text" class="w140" id="ordConsignName" name="ordConsignName" readonly="readonly" value="${approveApply.ordConsignName }">
							<input type="hidden" class="w140" id="ordConsignBy" name="ordConsignBy" value="${approveApply.ordConsignBy }">
							<input type="hidden" class="w140" id="ordConsignPhone" name="ordConsignPhone" value="${approveApply.ordConsignPhone }">
							<input type="hidden" class="w140" id="ordConsignEmail" name="ordConsignEmail" value="${approveApply.ordConsignEmail }">
						</td>
					</tr>
					<tr>
						<td class="formName w110">联系人</td>
						<td class="need w10">*</td>
						<td>
							<input type="text" class="w140" id="ordApplyBy" name="ordApplyBy" value="${approveApply.ordApplyBy }" maxlength="16">
						</td>
						<td class="formName w110">联系电话</td>
						<td class="need w10">*</td>
						<td><input type="text" class="w140" id="ordApplyPhone" name="ordApplyPhone" value="${approveApply.ordApplyPhone }"></td>
						<td class="formName w110">Email</td>
						<td class="need w10">*</td>
						<td><input type="text" class="w140" id="ordApplyEmail" name="ordApplyEmail" value="${approveApply.ordApplyEmail }"></td>
					</tr>
					<tr>
						<td class="formName w110">课题</td>
						<td class="need w10">*</td>
						<td>
							<select id="ordSubjectId" name="ordSubjectId" class="w140">
								
										
											<option value="0" selected="selected">现金</option>
										
										
											<option value="0">现金</option>
										
								
								
								
										
											<option value="${topic.key }" selected="selected">${topic.value }</option>
										
										
											<option value="${topic.key }">${topic.value }</option>
										
								
								
							</select>
						</td>
					</tr>
				</tbody></table>
			</div>	
			<div class="fl" style="width:100%">
				<h3>其他信息</h3>
			</div>
			<div class="fl">
				<table border="0" style="width:100%">
					<tbody><tr>
						<td class="formName w110">备注</td>
						<td class="need w10"></td>
						<td>
							<textarea rows="3" cols="105" id="remark" name="remark">${approveApply.remark }</textarea>
						</td>
					</tr>
				</tbody></table>
			</div>
		<c:if test="${actionType != 'edit' &amp;&amp;  actionType != 'copy' || approveApply.ordState =='02' || approveApply.ordState =='03' || approveApply.ordState =='07'}">
			<div class="fl" style="width:100%">
				<h3>意见及建议</h3>
			</div>
			<div class="fl">
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
		<c:if test="${actionType != 'copy' }">
				<table border="0" style="width:100%">
					<tbody><tr>
						<td class="formName" style="width:560px">打印明细
							<input type="checkBox" id="ordPrintDetail" name="ordPrintDetail" ${approveapply.ordprintdetail="='1'?" 'checked="checked" ':''}="">
						</td>
						<td class="formName w110">打印回复
							<input type="checkBox" id="ordPrintRespond" name="ordPrintRespond" ${approveapply.ordprintrespond="='1'?" 'checked="checked" ':''}="">
						</td>
						<td class="formName w90">
							<a href="javascript:" onclick="viewFlow()" style="text-decoration:underline;color:blue">
							         处理过程
							</a>
						</td>
						<td class="need w10"></td>
						<td></td>
					</tr>
				</tbody></table>
		</c:if>
	</form>
</div>
</div>
</div>
</div>
&lt;%@ include file="/framework/ui3/jsp/PostInit.jsp"%&gt;

</jsp:include></jsp:include></body></html>