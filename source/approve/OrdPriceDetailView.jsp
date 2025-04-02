<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>委托单费用明细</title>
<head>
<base target='_self' />
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css"/>
	<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdPriceDetailView.js"></script>
</head>
<body>
<div style="width:750px;padding: 10px">
	<table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail" >
		<h3>检测费用明细 </h3>
		<thead>
			<tr align="center">
				<th align="center">仪器名称</th>
				<th align="center">检测项目</th>
				<th align="center" style = "width: 8%">检测标准</th>
				<th align="center" style = "width: 8%">检测时长</th>		
				<th align="center" style = "width: 7%">样品数</th>
				<th align="center" style = "width: 8%">单价(元)</th>
				<c:if test="${viewType == '1' }">
					<th align="center" style = "width: 8%">预计工时</th>
				</c:if>
				<th align="center" style = "width: 8%">检测费用(元)</th>
				<c:if test="${viewType == '1' }">
					<th align="center" style = "width: 8%">实际检测时长</th>
					<th align="center" style = "width: 8%">实际检测费用(元)</th>
				</c:if>
			</tr>
		</thead>
		<tbody id="testDetailList">
			<c:forEach items="${itemStandardList }" var="aa" varStatus="status" >
					<tr>
						<td>${aa.apparatusName }</td>
						<td>${aa.itemName }</td>
						<td>${aa.standardName }</td>
						<td>${aa.oldTime }</td>
						<td>
						</td>
						<td>${aa.testPrice }</td>
						<c:if test="${viewType == '1' }">
							<td>${aa.oldTime }</td>
						</c:if>
						<td>${aa.testFee }</td>
						<c:if test="${viewType == '1' }">
							<td>
								${aa.totalTime }
							</td>
							<td>
								<c:if test="${aa.analysisStandardType == '0' }">
									${aa.ordTotalFactFee }
								</c:if>
								<c:if test="${aa.analysisStandardType == '1' }">
									${aa.testFee }
								</c:if>
							</td>
						</c:if>
					</tr>
			</c:forEach>
		</tbody>
	</table>
	<br/>
	<table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
		<h3>前处理费用明细 </h3>
		<thead>
			<tr align="center">
				<th align="center">仪器名称</th>
				<th align="center">检测项目</th>
				<th align="center" style = "width: 8%">检测标准</th>
				<th align="center" style="width: 10%">前处理标准</th>
				<th align="center" style="width: 14%">前处理时间(时)</th>
				<th align="center" style="width: 7%">样品数</th>
				<th align="center" style="width: 8%">单价(元)</th>
				<th align="center" style="width: 14%">前处理费用(元)</th>
			</tr>
		</thead>
		<tbody id="precopeDetailList">
			<c:forEach items="${itemStandardList }" var="bb" varStatus="status" >
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
			</c:forEach>
		</tbody>
	</table>
	<br/>
	<c:if test="${consuList !=null && consuList !='[]'}">
		<table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail" >
			<h3>耗材费用明细 </h3>
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
				<c:forEach items="${consuList }" var="cc" varStatus="status" >
						<tr>
							<td>${cc.apparatusName }</td>
							<td>${cc.consumablesName }</td>
							<td>${cc.consumablesPrice }</td>
							<td>${cc.consumablesUnit }</td>
							<td>${cc.consumablesNum }</td>
							<td>${cc.consumablesFee }</td>
						</tr>
				</c:forEach>
			</tbody>
		</table>
	</c:if>
	
	<c:if test="${viewType == '1' }">
		<br/>
		<h3>预计费用</h3>
		<table  width="100%" border="0" style="margin-top:-10px" >
			<tr>
				<td class="formName w100">分析费用<span id="ordTestFee">${ordModel.ordTestFee }</span>(元)</td>
				<td class="formName w100">前处理费用<span id="ordPrecopeFee">${ordModel.ordPrecopeFee }</span>(元)</td>
				<td class="formName w100">耗材费用<span id="ordConsumablesFee">${ordModel.ordConsumablesFee }</span>(元)</td>
				<td class="formName w100">总费用<span id="ordTotalFee">${ordModel.ordTotalFee }</span>(元)</td>
			</tr>
		</table>
		<br/>
		<h3>实际费用</h3>
		<table  width="100%" border="0" style="margin-top:-10px" >
			<tr>
				<td class="formName w100">实际分析费用<span id="ordTestFee">${ordModel.ordFactFee }</span>(元)</td>
				<td class="formName w100">前处理费用<span id="ordPrecopeFee">${ordModel.ordPrecopeFee }</span>(元)</td>
				<td class="formName w100">耗材费用<span id="ordConsumablesFee">${ordModel.ordConsumablesFee }</span>(元)</td>
				<td class="formName w100">实际总费用<span id="ordTotalFee">${ordModel.ordTotalFactFee }</span>(元)</td>
			</tr>
		</table>
	</c:if>

	
	
</div>
</body>
</html>