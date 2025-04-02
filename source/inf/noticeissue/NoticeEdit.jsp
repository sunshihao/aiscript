<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>编辑通知</title>
<head>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
	<link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">
	
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	<script type="text/javascript" src="<%=webPath%>/resource/ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
	<script type="text/javascript" src="<%=webPath%>/sams/inf/noticeissue/NoticeEdit.js"></script>
	<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common_extend.css" type="text/css"/>
	<script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    
    <script type="text/javascript" src="<%=webPath%>/sams/common/js/validate_method.js"></script>
    <script type="text/javascript">	CKEDITOR.config.removePlugins='elementspath'; </script>
</head>
<body class="ilead-body">
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<div class="popupBox fl">
				<form id="noticeEditForm" name="noticeEditForm" action="noticeIssueAction.do?method=doSave" method="post" >
					<input type="hidden" id="noticeId" name="noticeId" />
					<table>
						<tr>
			                <td colspan="6" class="fr">
			                	<input id="close_btn" type="button" class="btn_style fr" value="保存" onclick="doSave()"/>  
							</td>
			            </tr>
			            <tr>
			            	<td class="formName w110">标题</td>
			            	<td class="need w10">*</td>
			            	<td>
			            		<input type="text" name="noticeTitle" id="noticeTitle" class="w140"/>
			            	</td>
						</tr>
			            <tr>
							<td class="w110 formName">通知范围</td>
							<td class="need w10">*</td>
							<td>
								<select class="w140 mt8" id="noticeRange" name="noticeRange">
									<option value="">-请选择-</option>
									<ec:options items="noticeRangeMap"></ec:options>
								</select>
							</td>
							<td class="formName w110">优先级</td>
			            	<td class="need w10">*</td>
			            	<td>
			            		<select class="w140" id="priorityLevel" name="priorityLevel">
			            			<option value="">-请选择-</option>
			            			<ec:options items="priorityLevelMap"></ec:options>
								</select>
			            	</td>
						</tr>
			            <tr>
							<td class="formName w110">开始日期</td>
			                <td class="need w10">*</td>
							<td>
								<input type="text" name="noticeStartDate" id="noticeStartDate" class="w140 Wdate"  onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});" readonly="readonly"/>
							</td>
							<td class="formName w110">结束日期</td>
			                <td class="need w10">*</td>
							<td>
								<input type="text" name="noticeEndDate" id="noticeEndDate" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});" class="w140 Wdate" readonly="readonly"/>
							</td>
						</tr>
			            <tr>
			            	<td class="formName w110">内容</td>
			            	<td class="need w10">*</td>
			            	<td colspan="4">
			            	    <textarea id="ckEditor" name="ckEditor">
							    </textarea>
								<input type="hidden" id="noticeContent" name="noticeContent" />
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