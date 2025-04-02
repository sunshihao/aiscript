<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>委托单信息</title>
<head>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	
	<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">
	<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=webPath%>/sams/inf/apparatusonline/ApplyInfoList.js"></script>
</head>
<body >
<div class="panel panel-default fl">
	<div class="panel-body padding-0" id="MainArea">
	<!-- 内容信息 -->
	    <ec:table items="recordList" var="record" retrieveRowsCallback="limit" 
	    	useAjax="true" action="${pageContext.request.contextPath}/apparatusOnlineAction.do?method=getapplyInfo"
			xlsFileName="委托单信息.xls"  csvFileName="委托单信息.csv"
			listWidth="100%" resizeColWidth="true" pageSizeList="10,20,50,100" classic="true">
			<ec:row recordKey="${record.ordId}">	
		    	<ec:column style="text-align:left"  width="10%"  property="ordNo"  title="委托单编号"  ellipsis="true"/>
		    	<ec:column style="text-align:left"  width="10%"  property="ordApplyName"  title="委托人"  ellipsis="true"/>
		    	<ec:column style="text-align:left"  width="25%"  property="itemName"  title="分析项目"  ellipsis="true"/>
		    	<ec:column style="text-align:left"  width="35%"  property="ordTime"  title="仪器预约时间段"  ellipsis="true"/>
		    	<ec:column style="text-center"  width="6%"  property="ordState"  title="委托单状态" mappingItem="ordStateMap" />
		    	<ec:column property="_8"  width="9%" sortable="false" title="操作" viewsAllowed="html">
		    		<a href="javascript:return void(0)" onclick="doPrint('${record.ordId}','${record.ordState}','${record.ordReceiveUnit}')">查看详细信息</a>
				</ec:column> 
			</ec:row>
		</ec:table>   
	</div>
</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp"%>

</body>
</html>