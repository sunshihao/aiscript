<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<html>
<title>回复</title>
<head>
<base target='_self' />
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
	String flag = request.getParameter("flag");
%>
<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css"/>
 <script type="text/javascript" src="<%=webPath%>/sams/common/js/validate_method.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/OrdApproveRespond.js"></script>
</head>
<body>
<div class="popupBox fl" style="width:500px;padding: 10px">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td colspan="6" class="fr">
				<input id="savebtn" type="button"  class="btn_style fr" value="确定"  onclick="doConfirm(<%=flag %>)" />
			</td>
		</tr>
	</table>
	<div style="float:left;width:100%">
		<h3>意见及建议</h3>
	</div>
	<br/>
	<div>
		<table  border="0" style="width:100%" >
			<tr>
				<td class="formName w100">答复</td>
				<td class="need w10">*</td>
				<td>
					<textarea rows="5" cols="60" id="respondRemark" name="respondRemark"></textarea>
				</td>
			</tr>
		</table>
	</div>
</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp"%>
</body>
</html>