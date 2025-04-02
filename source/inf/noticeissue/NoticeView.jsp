<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c"%>
<html>
<title>查看通知</title>
<head>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
<link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">

<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
<script type="text/javascript" src="<%=webPath%>/sams/inf/noticeissue/NoticeView.js"></script>
<script type="text/javascript" src="<%=webPath%>/resource/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common_extend.css" type="text/css"/>
<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>

</head>
<body class="ilead-body">
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl">
				<form id="apparatusInfoForm" name="apparatusInfoForm" action="apparatusInfoAction.do?method=doSave" method="post" >
					<input id="noticeContent" type="hidden" value="${notice.noticeContent}">
					<table>
				        <tr>
							<td class="formName w110">标题</td>
							<td class="need w10"></td>
							<td>
								<input type="text" class="w260" name="noticeTitle" id="noticeTitle" value="${notice.noticeTitle}" />
							</td>
							<td class="formName w110">发布人</td>
							<td class="need w10"></td>
							<td>
								<input type="text" class="w260" name="createName" id="createName" value="${notice.createName}" />
							</td>
						</tr>
						 <tr>
							<td class="formName w110">开始日期</td>
							<td class="need w10"></td>
							<td>
								<input type="text" class="w260" name="noticeStartDate" id="noticeStartDate" value="${notice.noticeStartDate}" />
							</td>
							<td class="formName w110">结束日期</td>
							<td class="need w10"></td>
							<td>
								<input type="text" class="w260" name="noticeEndDate" id="noticeEndDate" value="${notice.noticeEndDate}" />
							</td>
						</tr>
						 <tr>
							<td class="w110 formName">通知范围</td>
							<td class="need w10"></td>
							<td>
								<select class="w260" id="noticeRange" name="noticeRange">
									<option value="">-请选择-</option>
									<ec:options items="noticeRangeMap" defaultKey="${notice.noticeRange}"></ec:options>
								</select>
							</td>
							<td class="formName w110">优先级</td>
			            	<td class="need w10"></td>
			            	<td>
			            		<select class="w140" id="priorityLevel" name="priorityLevel">
			            			<ec:options items="priorityLevelMap" defaultKey="${notice.priorityLevel}"></ec:options>
								</select>
			            	</td>
						</tr>
						<tr>
							<td class="formName w110">内容</td>
							<td class="need w10"></td>
							<td colspan="4">
								<textarea id="ckEditor" name="ckEditor"></textarea>
							</td>
						</tr>
					</table>
				</form>
			</div>
		</div>
	</div>		
</div>
</body>
</html>