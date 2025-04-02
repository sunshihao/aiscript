<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/IframeTimeList.js"></script>
<title></title>
</head>
<body>
<ec:table items="OrdTimeList" var="ordTime" retrieveRowsCallback="limit"
	action="${pageContext.request.contextPath}/ordApproveAction.do?method=saveTimeRequest"
	listWidth="100%" resizeColWidth="true" classic="true" toolbarContent="status"
	>
	<ec:row recordKey="${ordTime.apparatusId}">		
		<ec:column style="text-align:center"  width="3%" property="_0" title="编号" value="${GLOBALROWCOUNT}" sortable="false"/>
		<ec:column width='10%' property="apparatusName" title="仪器名称" ellipsis="true"/>
		<ec:column width='12%' property="ordStarttime"  title="预约开始时间" ellipsis="true">
			<input type="text" id="${GLOBALROWCOUNT}_ST" value="${ordTime.ordStarttime}" class="Wdate"
				onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',errDealMode:0,readOnly:true});"
				/>
		</ec:column>	
		<ec:column width='12%' property="ordEndtime" title="预约结束时间" ellipsis="true">
			<input type="text" id="${GLOBALROWCOUNT}_ET" value="${ordTime.ordEndtime}" class="Wdate"
				onfocus="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm',errDealMode:0,readOnly:true});"
				/>
		</ec:column>
		<ec:column width='10%' property="ordDuration" title="预计工时" ellipsis="true">
			<span id="${GLOBALROWCOUNT}_Duration"><c:out value="${ordTime.ordDuration}"/></span>
		</ec:column>
	    <ec:column style="text-align:center;" width="10%" property="_2" title="操作" sortable="false" editable="false" viewsAllowed="html">
	    	<a href="javascript:return void(0);" onclick="window.parent.doTimeCancel('${GLOBALROWCOUNT}')">删除</a>
		</ec:column>
	</ec:row>
</ec:table>

</body>
</html>