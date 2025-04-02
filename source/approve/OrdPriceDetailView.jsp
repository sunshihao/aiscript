<html><head></head><body>&lt;%@ page contentType="text/html;charset=UTF-8"%&gt;
&lt;%@ page import="java.util.*"%&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %&gt;

<title>委托单费用明细</title>

<base target="_self">
&lt;%
	// 获得应用上下文
	String webPath = request.getContextPath();
%&gt;
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true">
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true">
	<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css">
	<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdPriceDetailView.js"></script>


<div style="width:750px;padding: 10px">
	<h3>检测费用明细 </h3><c:if test="${viewType == '1' }">
					</c:if><c:if test="${viewType == '1' }">
					</c:if><c:foreach items="${itemStandardList }" var="aa" varstatus="status">
					</c:foreach><c:if test="${viewType == '1' }">
							</c:if><c:if test="${viewType == '1' }">
							</c:if><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
		
		<thead>
			<tr align="center">
				<th align="center">仪器名称</th>
				<th align="center">检测项目</th>
				<th align="center" style="width: 8%">检测标准</th>
				<th align="center" style="width: 8%">检测时长</th>		
				<th align="center" style="width: 7%">样品数</th>
				<th align="center" style="width: 8%">单价(元)</th>
				<th align="center" style="width: 8%">预计工时</th>
				
				<th align="center" style="width: 8%">检测费用(元)</th>
				<th align="center" style="width: 8%">实际检测时长</th>
					<th align="center" style="width: 8%">实际检测费用(元)</th>
				
			</tr>
		</thead>
		<tbody id="testDetailList">
			<tr>
						<td>${aa.apparatusName }</td>
						<td>${aa.itemName }</td>
						<td>${aa.standardName }</td>
						<td>${aa.oldTime }</td>
						<td>
						</td>
						<td>${aa.testPrice }</td>
						<td>${aa.oldTime }</td>
						
						<td>${aa.testFee }</td>
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
						
					</tr>
			
		</tbody>
	</table>
	<br>
	<h3>前处理费用明细 </h3><c:foreach items="${itemStandardList }" var="bb" varstatus="status">
					</c:foreach><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
		
		<thead>
			<tr align="center">
				<th align="center">仪器名称</th>
				<th align="center">检测项目</th>
				<th align="center" style="width: 8%">检测标准</th>
				<th align="center" style="width: 10%">前处理标准</th>
				<th align="center" style="width: 14%">前处理时间(时)</th>
				<th align="center" style="width: 7%">样品数</th>
				<th align="center" style="width: 8%">单价(元)</th>
				<th align="center" style="width: 14%">前处理费用(元)</th>
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
	<c:if test="${consuList !=null &amp;&amp; consuList !='[]'}">
		<h3>耗材费用明细 </h3><c:foreach items="${consuList }" var="cc" varstatus="status">
						</c:foreach><table width="100%" border="1" cellspacing="0" cellpadding="0" class="table_detail">
			
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
	
	<c:if test="${viewType == '1' }">
		<br>
		<h3>预计费用</h3>
		<table width="100%" border="0" style="margin-top:-10px">
			<tbody><tr>
				<td class="formName w100">分析费用<span id="ordTestFee">${ordModel.ordTestFee }</span>(元)</td>
				<td class="formName w100">前处理费用<span id="ordPrecopeFee">${ordModel.ordPrecopeFee }</span>(元)</td>
				<td class="formName w100">耗材费用<span id="ordConsumablesFee">${ordModel.ordConsumablesFee }</span>(元)</td>
				<td class="formName w100">总费用<span id="ordTotalFee">${ordModel.ordTotalFee }</span>(元)</td>
			</tr>
		</tbody></table>
		<br>
		<h3>实际费用</h3>
		<table width="100%" border="0" style="margin-top:-10px">
			<tbody><tr>
				<td class="formName w100">实际分析费用<span id="ordTestFee">${ordModel.ordFactFee }</span>(元)</td>
				<td class="formName w100">前处理费用<span id="ordPrecopeFee">${ordModel.ordPrecopeFee }</span>(元)</td>
				<td class="formName w100">耗材费用<span id="ordConsumablesFee">${ordModel.ordConsumablesFee }</span>(元)</td>
				<td class="formName w100">实际总费用<span id="ordTotalFee">${ordModel.ordTotalFactFee }</span>(元)</td>
			</tr>
		</tbody></table>
	</c:if>

	
	
</div>

</jsp:include></jsp:include></body></html>