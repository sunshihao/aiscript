<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>

<html>
<head>
<title>通知发布</title>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
	<link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">
	
 	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=webPath%>/sams/inf/noticeissue/NoticeIssueList.js"></script>
	<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    
	
</head>
<body>
<form method="post" action="/noticeIssueAction.do?method=doQuery" id="noticeIssueForm">
	<div class="panel panel-default searchTool fl">
		<div class="panel-body">
			<table>
				<tr>
					<td><span class="w110 name">通知类型</span></td>
					<td>
						<select class="w140 mt8" id="noticeRange" name="noticeRange">
							<option value="">-请选择-</option>
							<ec:options items="noticeRangeMap"></ec:options>
						</select>
					</td>
					<td><span class="w110 name">发布日期起</span></td>
					<td><input type="text" name="createStartDate" id="createStartDate" class="w140 Wdate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});"></td>
					<td><span class="w110 name">发布日期止</span></td>
					<td><input type="text" name="createEndDate" id="createEndDate" class="w140 Wdate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});"></td>
				</tr>
				<tr>
					<td height="10px"></td>
				</tr>
				<tr>
					<td colspan="6" class="fr">		
						<input type="reset" class="btn_style fr" value="重置"  />
						<input type="button" class="btn_style fr" value="查询" onclick="doQuery()" />
						<input type="button" class="btn_style fr" value="新建" onclick="doAdd()" />
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
			action="${pageContext.request.contextPath}/noticeIssueAction.do?method=doQuery" title="" 
			listWidth="100%"  
			resizeColWidth="true" 
			queryForm="noticeIssueForm"
			pageSizeList="10,20,50"
			rowsDisplayed="10"
			classic="true">
			<ec:row recordKey="${record.noticeId}">
				<ec:column style="text-align:center"  width="4%" property="_0" title="序号" value="${GLOBALROWCOUNT}" sortable="false"/>
				<ec:column width="15%" property="noticeTitle" title="标题" ellipsis="true" />
				<ec:column width="15%" property="noticeStartDate" title="开始日期" cell="date" parse="yyyy-MM-dd" ellipsis="true"/>
				<ec:column width="10%" property="noticeEndDate" title="结束日期" cell="date" parse="yyyy-MM-dd" ellipsis="true"/>
				<ec:column width="8%" property="createName" title="发布人" ellipsis="true"/>
				<ec:column width="10%" property="createDate" title="发布日期" cell="date" parse="yyyy-MM-dd" ellipsis="true"/>
				<ec:column width="10%" property="noticeRangeName" title="通知范围" style="text-align:center;" ellipsis="true"/>
				<ec:column width="10%" property="_2" title="操作" viewsAllowed="html">
					<a href="javascript:void();" onclick="doEdit('${record.noticeId}')">编辑</a>
					<a href="javascript:void();" onclick="doView('${record.noticeId}')">查看</a>
					<c:choose>
						<c:when test="${instituteFlag == 1}">
							<a href="javascript:void();" onclick="doDelete('${record.noticeId}')">删除</a>
						</c:when>
						<c:otherwise>
							<c:if test="${userId == record.createBy}">
								<a href="javascript:void();" onclick="doDelete('${record.noticeId}')">删除</a>
							</c:if>
						</c:otherwise>
					</c:choose>
				</ec:column>
			</ec:row>
		</ec:table>
	</div>
</div>
</body>
</html>