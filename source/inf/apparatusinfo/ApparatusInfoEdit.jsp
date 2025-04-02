<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%
	//防跨站脚本编制
	String webpath = request.getContextPath();
	
%>
<html>
<title>仪器信息查看</title>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	
	<base target='_self' />
	<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
	<jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
	<script type="text/javascript" src="<%=webpath%>/sams/inf/apparatusinfo/ApparatusInfoEdit.js"></script>
</head>
<body >
<div class="popupBox fl" style="width:400px">
	<form id="apparatusInfoForm" name="apparatusInfoForm" action="apparatusInfoAction.do?method=doSave" method="post"  class="registerform" style="width:380px">
		<table>
	        <tr>
				<td class="formName w100">所属单位</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="belongUnit" id="belongUnit" value="${apparatusInfo.belongUnit }" />
				</td>
			</tr>      
			<tr>
				<td class="formName w100">仪器名称</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="apparatusName" id="apparatusName" value="${apparatusInfo.apparatusName }" />
				</td>
			</tr>
			<tr>
				<td class="formName w100">仪器型号</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="apparatusModel" id="apparatusModel" value="${apparatusInfo.apparatusModel }" />
				</td>
			</tr>
			<tr>
				<td class="formName w100">预约类型</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="bookType" id="bookType" value="${apparatusInfo.bookType }" />
				</td>
			</tr>     
			<tr>
				<td class="formName w100">管理员</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="apparatusAdmin" id="apparatusAdmin" value="${apparatusInfo.apparatusAdmin }" />
				</td>
			</tr> 
			<tr>
				<td class="formName w100">联系电话</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="telPhone" id="telPhone" value="${apparatusInfo.telPhone }" />
				</td>
			</tr> 
			<tr>
				<td class="formName w100">电子邮件</td>
				<td class="need w10"></td>
				<td>
					<input type="text" class="w260" name="email" id="email" value="${apparatusInfo.email }" />
				</td>
			</tr> 
			<tr>
				<td class="formName w100">主要功能及描述</td>
				<td class="need w10"></td>
				<td>
		      		<textarea  id="apparatusDescription" name="apparatusDescription" style="height:50px;width:260px;resize:none;" rows="5">${apparatusInfo.apparatusDescription }</textarea>
				</td>
			</tr>
		</table>
	</form>
</div>

<%@ include file="/framework/ui3/jsp/PostInit.jsp"%>

</body>
</html>