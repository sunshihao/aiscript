<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>审核分析</title>
<head>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
	<link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">
	
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    
	<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdApproveList.js?20220304"></script>
	
	<link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
	<script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script> 
	<script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>
    <script type="text/javascript">
    	var belongUnitMap = "<%=request.getAttribute("belongUnitMap")%>";
    </script>
	<style type="text/css">
    	.darkBlue .tableRegion td {
    		line-height: 20px;
    	}
    </style>
</head>
<body >
<form method="post" action="/ordApplyAction.do?method=init" id="ordApproveForm">
<!-- 条件信息 -->
<div class="panel panel-default searchTool fl">
	<div class="panel-body">
		<table cellpadding="0" cellspacing="0">
			<tr>
				<td><span class="w110 name">委托单编号</span></td>
				<td>
					<input type="text" id="ordNo" name="ordNo"  class="w140 mt8">
				</td>
				<td><span class="w110 name">仪器名称</span></td>
				<td><input type="text" id="apparatusName" name="apparatusName"  class="w140"/></td>
				<td><span class="w110 name">状态</span></td>
				<td>
					<select class="w140 mt8" id="ordState" name="ordState">
						<option value="normal">运行状态</option>
						<ec:options items="ordStateMap"></ec:options>
					</select>
				</td>
				<td class="w110 name fr" id="moreBtn">
					<a href="javascript:" onclick="getMoreCondition(this)">
						更多条件<span class="glyphicon glyphicon-menu-down"></span>
					</a>
				</td>
			</tr>
			<tr>
				<td><span class="w110 name">联系人</span></td>
				<td><input type="text" id="ordApplyBy" name="ordApplyBy" class="w140"/></td>
				<td><span class="w110 name">委托时间</span></td>
				<td colspan="3">
					<input type="text" id="startTime" name="startTime" class="w140 Wdate"  readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});"/>
					<span>~</span>
					<input type="text" id="endTime" name="endTime" class="w140 Wdate"  readonly="readonly" onfocus="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0,readOnly:true});"/>
				</td>
			</tr>
			<tr id="hiddenTr1">
				<td><span class="w110 name">委托单位</span></td>
				<td>
					<select class="ordConsignUnit js-states w140" id="ordConsignUnit" name="ordConsignUnit" onchange="getGroup(this)">
						<option value="">-请选择-</option>
						<!-- <ec:options items="belongUnitMap"></ec:options> -->
					</select>
				</td>
				<td><span class="w110 name">委托研究组</span></td>
				<td>
					<select class="ordConsignGroup js-states w140" id="ordConsignGroup" name="ordConsignGroup">
						<option value="">-请选择-</option>
					</select>
				</td>
				<td><span class="w110 name">付款状态</span></td>
				<td>
					<select class="w140 mt8" id="ordPaystate" name="ordPaystate">
						<option value="">-请选择-</option>
						<ec:options items="ordPayStateMap"></ec:options>
					</select>
				</td>
			</tr>
			
			
			<tr id="hiddenTr1">
				<td><span class="w110 name">承检人</span></td>
				<td>
					<input type="text" id="ordReceiveName" name="ordReceiveName" class="w140"/>
				</td>
				
			</tr>
			<tr>
				<td colspan="6" class="fr">		
					<input type="button" class="btn_style fr" value="重置" onclick="doReset()" />
					<input type="button" class="btn_style fr" value="查询" onclick="doQuery()" />
					<input type="button" class="btn_style fr" value="批量审核通过" onclick="doApproveBatchPass()" />
				</td>
			</tr>
		</table>
	</div>
</div>
</form>

<!-- 内容信息 -->
<div class="panel panel-default fl">
	<div class="panel-body padding-0" id="MainArea">
		<ec:table items="recordList" var="record" retrieveRowsCallback="limit"
			action="${pageContext.request.contextPath}/ordApproveAction.do?method=getApplyList" title="" 
			xlsFileName="委托单信息列表.xls" 
			csvFileName="委托单信息列表.csv"
			listWidth="100%"  
			resizeColWidth="true" 
			queryForm="ordApproveForm"
			pageSizeList="10,20,50"
			rowsDisplayed="10"
			classic="true">
			<ec:row recordKey="${record.ordId}">
				<ec:column style="text-align:center;" width="25px" cell="checkbox"  headerCell="checkbox" alias="checkboxID" property="ordId"
							value="${record.ordId}!${record.ordReceiveUnit}!${record.ordNo}!${record.ordApplyEmail}!${record.ordState}"  viewsAllowed="html" />
				<ec:column width="125px" property="ordNo" title="委托单编号" ellipsis="true">
					<a href="javascript:" onclick="doPrint('${record.ordId}','${record.ordState}','${record.ordReceiveUnit}')">${record.ordNo }</a>
				</ec:column>
				<ec:column width="30%" property="itemName" title="检测项目" ellipsis="true"/>
				<ec:column width="70%" property="ordTime" title="预约仪器及时间段" style="text-align:left;white-space:normal"/>
				<%-- <ec:column width="8%" property="ordModelType" title="预约类型" mappingItem="ordModelTypeMap"/> --%>
				
				<ec:column width="95px" property="_3" title="联系人" ellipsis="true">
					<c:if test="${ record.userName == record.ordApplyBy}">
						${record.ordApplyBy}<br/>${record.ordApplyPhone}
					</c:if>
					<c:if test="${ record.userName != record.ordApplyBy}">
						${record.ordApplyBy}/${record.userName}<br/>${record.ordApplyPhone}
					</c:if>
				</ec:column>
				
				<ec:column width="50px" property="ordState" title="状态" mappingItem="ordStateMap" ellipsis="true"/>
				<%-- <ec:column width="10%" property="ordApplyPhone" title="联系电话" ellipsis="true"/> --%>
				<ec:column width="40px" property="ordPaystate" title="付款" mappingItem="ordPayStateMap"/>
				<ec:column width="50px" property="_1" title="任务单">
					<c:if test="${record.ordModelType !='1' && record.ordModelType !='2' && record.ordState !='00' && record.ordState !='09' && record.ordState !='01' && record.ordState !='10' && record.ordState !='07' && record.ordState !='08'}">
						<a href="javascript:" onclick="doDispatchTask('${record.ordId}','${record.ordReceiveUnit}')">编辑</a>
					</c:if>
				</ec:column>
				<ec:column width="150px" property="_2" title="操作" viewsAllowed="html">
					<c:if test="${ record.ordState =='09' || record.ordState =='10'}">
						<a title="查看" href="javascript:" onclick="getHisApply('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-sunglasses"></span></a>
						<c:if test="${record.ordModelType != '1' }">
							丨
						</c:if>
					</c:if>
					<c:choose>
						<c:when test="${record.ordModelType == '1'}">
							<c:if test="${record.ordState =='03'}">
								<a title="编辑" href="javascript:" onclick="doEdit('${record.ordId}','${record.ordModelType}','edit','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-edit"></span></a>丨
								<a title="完成" href="javascript:" onclick="doComplete('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-ok"></span></a>丨
								<a title="原始记录" href="javascript:" onclick="getOldApply('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-th"></span></a>
							</c:if>
							<c:if test="${record.ordState =='00'}">
								<a title="审核" href="javascript:" onclick="doApprove('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-ok-circle"></span></a>
							</c:if>
							<c:if test="${record.ordState =='07'}">
								<a title="撤销" href="javascript:" onclick="doCancleDlg('${record.ordId}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-remove-circle"></span></a>
							</c:if>
							
						</c:when>
						<c:otherwise>
							<c:if test="${record.ordState !='00' && record.ordState !='08'&& record.ordState !='02' && record.ordState !='09' && record.ordState !='01' && record.ordState !='10'}">
								<a title="编辑" href="javascript:" onclick="doEdit('${record.ordId}','${record.ordModelType}','edit','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-edit"></span></a>丨
							</c:if>
							<c:if test="${record.ordState !='00' && record.ordState !='01'}">
								<a title="检测记录" href="javascript:" onclick="doEditTestRecord('${record.ordId}','${record.ordNo}','${record.ordReceiveUnit}','${record.ordState}')"><span class="glyphicon glyphicon-list-alt"></span></a>丨
							</c:if>
							<c:if test="${record.ordState !='00' && record.ordState !='02' && record.ordState !='01' && (record.ordOrigin =='0' || record.ordOrigin =='2') }">
								<a title="原始记录" href="javascript:" onclick="getOldApply('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-th"></span></a>丨
							</c:if>
							<c:if test="${record.ordState =='00'}">
								<a title="审核" href="javascript:" onclick="doApprove('${record.ordId}','${record.ordModelType}','${record.ordReceiveUnit}')"><span class="glyphicon glyphicon-ok-circle"></span></a>丨
							</c:if>
							<c:if test="${record.ordState !='01'}">
								<a title="付款" href="javascript:" onclick="doPayForApply('${record.ordId}','${record.ordPaystate}','${record.ordReceiveUnit}','${record.ordState}')"><span class="glyphicon glyphicon-yen"></span></a>
							</c:if>
							<c:if test="${record.ordState =='07' || record.ordState =='03'}">丨</c:if>
							<c:if test="${record.ordState =='07' || record.ordState =='03'}">
								<a title="撤销" href="javascript:" onclick="doCancleDlg('${record.ordId}','${record.ordReceiveUnit}','${record.ordState}',this)"><span class="glyphicon glyphicon-remove-circle"></span></a>
							</c:if>
							
						</c:otherwise>
					</c:choose>
					<input type = "hidden" id = "ordResponse" name = "ordResponse" value = "${record.ordResponse}"/>
				</ec:column>
			</ec:row>
		</ec:table>
	</div>
</div>
</body>
</html>