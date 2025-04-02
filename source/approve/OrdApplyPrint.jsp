<html><head></head><body>&lt;%@ page contentType="text/html;charset=UTF-8"%&gt;
&lt;%@ page import="java.util.*"%&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %&gt;

<title>委托单打印</title>

&lt;%
	// 获得应用上下文
	String webPath = request.getContextPath();
%&gt;
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true">
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true">

	
	<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css">
	<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/ordApplyPrint.js"></script>
	
	<style> 
		@media Print { .Noprn { DISPLAY: none }}
	</style>


<object classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2" height="0" id="wb" name="wb" width="3"></object>
	<div id="content" style="width:720px;padding: 10px;background-color: #FFFFFF;margin: 10px">
		<table width="100%" border="0" cellspacing="0" cellpadding="0" class="Noprn">
			<tbody><tr>
				<td colspan="9" align="right">
					<input id="file_btn" type="button" class="func-button" value="打印" onclick="preview()"> 
				</td>
			</tr>
		</tbody></table>
	<!--startprint-->
		<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px">
			<tbody><tr>
				<td colspan="6" align="center">
					<c:choose>
						<c:when test="${ordState == '09' ||  ordState == '10'}">
							<span style="font-size:18">检验业务结算书</span>
						</c:when>
						<c:otherwise>
							<span style="font-size:18">检验业务委托书</span>
						</c:otherwise>
					</c:choose>
				</td>
			</tr>
		</tbody></table>
		<div style="float: left;">管理编号:${ approveApply.ordManageNo}</div><div style="float: right;">委托书编号:${ approveApply.ordNo}</div>
		<c:if test="${ approveApply.ordPrintRespond == '1'}">
				</c:if><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
			<tbody><tr>
				<td colspan="6">兹请您单位协助完成以下检验任务，提供检验项目的检验记录，请给予协助。</td>
			</tr>
			<tr>
				<td style=" width: 10%">选择仪器：</td>
				<td colspan="5">
					<c:foreach items="${apparList }" var="app" varstatus="status">
						${app.apparatusName}
						<c:if test="${ approveApply.ordModelType == 3 || approveApply.ordModelType == 2}">
							<c:choose>
								<c:when test="${ordState == '09' ||  ordState == '10'}">
									(检测时间：${app.ordTimeList})
								</c:when>
								<c:otherwise>
									(预约时间：${app.ordTimeList})
								</c:otherwise>
							</c:choose>
						</c:if>
						;
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>样品编号：</td>
				<td colspan="2">${ approveApply.ordSampleno}</td>
				<td>样品数量：</td>
				<td colspan="2"> ${ approveApply.ordSamplenum}</td>
			</tr>
			<tr>
				<td>送样时间：</td>
				<td colspan="2">${ approveApply.ordSendsampleTime}</td>
				<td>完成时间：</td>
				<td colspan="2"> ${ approveApply.ordFinishtime}</td>
			</tr>
			<tr>
				<td>样品处理：</td>
				<td colspan="2">
					<c:foreach items="${sampleDisposeMap }" var="sampleDis" varstatus="status">
						<c:if test="${ approveApply.ordTaskSampledispose == sampleDis.key}">
							${sampleDis.value}
						</c:if>
					</c:foreach>
				</td>
				<td>付费情况：</td>
				<td colspan="2">
					<c:foreach items="${ordPayStateMap }" var="payState" varstatus="status">
						<c:if test="${ approveApply.ordPaystate == payState.key}">
							${payState.value}
						</c:if>
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>样品形态：</td>
				<td colspan="5">
					<c:foreach items="${elementShapeMap }" var="form" varstatus="status">
						<c:if test="${ approveApply.ordSampleform == form.key}">
							${form.value}
						</c:if>
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>样品及前处理描述：</td>
				<td colspan="5">${ approveApply.ordSampledescribe}</td>
			</tr>
			<tr>
				<td>前处理方式：</td>
				<td colspan="5" style="height: 80px">
					<c:foreach items="${itemStandardList }" var="item" varstatus="status">
						${item.preStandardName }
						<c:if test="${!empty item.precopeSelfstandard || item.precopeSelfstandard ne null}">
						-${item.precopeSelfstandard }
						</c:if>
						<br>
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>检验项目：</td>
				<td colspan="5" style="height: 80px">
					<c:foreach items="${itemStandardList }" var="item" varstatus="status">
						${item.itemName }
						<br>
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>检验标准：</td>
				<td colspan="5" style="height: 80px">
					<c:foreach items="${itemStandardList }" var="item" varstatus="status">
						${item.standardName }
						<c:if test="${!empty item.selfStandard || item.selfStandard ne null}">
						-${item.selfStandard }
						</c:if>
						<br>
					</c:foreach>
				</td>
			</tr>
			<tr>
				<td>备注：</td>
				<td colspan="5" style="height: 80px">
					${ approveApply.remark}
				</td>
			</tr>
			<tr>
				<td>课题：</td>
				<td colspan="5" style="height: 50px">
				<c:choose>
					<c:when test="${ approveApply.ordSubjectId == '0'}">
						现金
					</c:when>
					<c:otherwise>
						<c:foreach items="${topicList }" var="topics">
						 <c:if test="${ approveApply.ordSubjectId == topics.topicId}">
						 	${topics.topicName }
						 </c:if>
						</c:foreach>
					</c:otherwise>
				</c:choose>
				</td>
			</tr>
			<tr>
				<td rowspan="4">承检单位</td>
				<td style="width: 10%">名称</td>
				<td style="width: 15%">${ approveApply.ordReceiveUnitName}</td>
				<td rowspan="4" style="width: 8%;">委托单位</td>
				<td style="width: 10%">名称</td>
				<td style="width: 15%">${ approveApply.ordConsignUnitName}</td>
			</tr>
			<tr>
				<td>研究组</td>
				<td>${ approveApply.ordReceiveGroupName}</td>
				<td>研究组</td>
				<td>${ approveApply.ordConsignGroupName}</td>
			</tr>
			<tr>
				<td>电话</td>
				<td>${ approveApply.ordReceivePhone}</td>
				<td>电话</td>
				<td>${ approveApply.ordApplyPhone}</td>
			</tr>
			<tr>
				<td>E-mail</td>
				<td>${ approveApply.ordReceiveEmail}</td>
				<td>E-mail</td>
				<td>${ approveApply.ordApplyEmail}</td>
			</tr>
			<tr>
				<td colspan="3"><br>承检单位代表:<br>
				${ approveApply.ordReceiveName}
				<br>
				</td>
				<td colspan="3"><br>委托人员:<br>
				${ approveApply.ordConsignName}/${ approveApply.ordApplyBy}
				<br>
				</td>
			</tr>
			<tr>
				<td colspan="3">审核人:${ approveApply.approveName}</td>
				<td colspan="3">总价:${ approveApply.ordActualFee}</td>
			</tr>
			<tr>
					<td>回复</td>
					<td colspan="5">${ approveApply.ordResponse}</td>
				</tr>
			
		</tbody></table>
		注：1、委托书表本着双方自愿的原则共同签署。
		<br>
		   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、如遇无法抗拒因素或客户提供样品存在问题，导致本单位没有或延迟履行服务承诺，因此造成的损失本单位不承担责任。
		<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、委托方（人）如没有检测委托书，可采用此格式的委托书填写检测委托。
		<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4。委托书一式二份，委托方、检测方各执一份。
	<c:if test="${ approveApply.ordPrintDetail == '1'}">
		<br>
		<br>
		<div style="page-break-before: always;">
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="maremargin-top: 10px">
				<tbody><tr><td colspan="6" align="center"><h3>费用明细</h3></td></tr>
			</tbody></table>
			<span style="font-size:15">检测费用明细 </span>
			<br>
			<c:foreach items="${itemStandardList }" var="aa" varstatus="status">
							</c:foreach><c:choose>
									<c:when test="${ordState == '09' ||  ordState == '10'}">
										</c:when></c:choose><c:otherwise>
										</c:otherwise><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
				<thead>
					<tr align="center">
						<th align="center">仪器名称</th>
						<th align="center">检测项目</th>
						<th align="center">检测标准</th>
						<th align="center" style="width: 8%">样品数</th>
						<th align="center" style="width: 8%">单价(元)</th>
						<th align="center" style="width: 12%">检测费用(元)</th>
					</tr>
				</thead>
				<tbody id="testDetailList">
					<tr>
								<td>${aa.apparatusName }</td>
								<td>${aa.itemName }</td>
								<td>${aa.standardName }</td>
								<td>${approveApply.ordSamplenum }</td>
								<td>${aa.testPrice }</td>
								<td>${aa.ordTotalFactFee }</td>
									
									<td>${aa.testFee }</td>
									
								
							</tr>
					
				</tbody>
			</table>
	
			<br>
			<span style="font-size:15">前处理费用明细</span>
			<br>
			<c:foreach items="${itemStandardList }" var="bb" varstatus="status">
							</c:foreach><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
				<thead>
					<tr align="center">
						<th align="center">仪器名称</th>
						<th align="center">检测项目</th>
						<th align="center">检测标准</th>
						<th align="center" style="width: 10%">前处理标准</th>
						<th align="center" style="width: 10%">前处理时间(时)</th>
						<th align="center" style="width: 8%">前处理样品数</th>
						<th align="center" style="width: 8%">单价(元)</th>
						<th align="center" style="width: 9%">前处理费用(元)</th>
					</tr>
				</thead>
				<tbody id="precopeDetailList">
					<tr>
								<td>${bb.apparatusName }</td>
								<td>${bb.itemName }</td>
								<td>${bb.standardName }</td>
								<td>${bb.preStandardName }</td>
								<td>${bb.precopeDuration }</td>
								<td>${bb.sampleNum }</td>
								<td>${bb.precopePrice }</td>
								<td>${bb.precopeFee }</td>
							</tr>
					
				</tbody>
			</table>
			<br>
			<c:if test="${!empty consuList }">
			<span style="font-size:15">耗材费用明细 </span>
			<br>
			<c:foreach items="${consuList }" var="cc" varstatus="status">
							</c:foreach><table id="consuTable" width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
				<thead>
					<tr align="center">
						<th align="center">仪器名称</th>
						<th align="center">耗材名称</th>
						<th align="center">单价(元)</th>
						<th align="center">单位</th>
						<th align="center">数量</th>
						<th align="center">费用(元)</th>
					</tr>
				</thead>
				<tbody id="consuDetailList">
					<tr>
								<td>${cc.apparatusName }</td>
								<td>${cc.consumablesName }</td>
								<td>${cc.consumablesPrice }</td>
								<td>${cc.consumablesUnit }</td>
								<td>${cc.consumablesNum }</td>
								<td>${cc.consumablesFee }</td>
							</tr>
					
				</tbody>
			</table>
			</c:if>
		</div>
	</c:if>
	
<!--endprint-->
</div>

</jsp:include></jsp:include></body></html>