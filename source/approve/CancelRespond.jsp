<html><head></head><body>&lt;%@ page contentType="text/html;charset=UTF-8" %&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %&gt;
&lt;%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%&gt;

<title>是否同意撤销？</title>

<base target="_self">
&lt;%
	// 获得应用上下文
	String webPath = request.getContextPath();
	String flag = request.getParameter("flag");
%&gt;
<jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true">
<link rel="stylesheet" href="<%=webPath%>/sams/common/css/style.css" type="text/css">
 <script type="text/javascript" src="<%=webPath%>/sams/common/js/validate_method.js"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/approve/CancelRespond.js"></script>


<div class="popupBox fl" style="width:380px;padding: 10px">
	
	<div>
		<table style="width:100%;table-layout:fixed" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr id="infoTr">
				<td id="allResponseInfo" title="" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis"><span id="beforeResponseInfo"></span></td>
			</tr>
			<tr>
				<td>
					<textarea rows="5" cols="60" id="respondRemark" name="respondRemark"></textarea>
				</td>
			</tr>
		</tbody></table>
	</div>
	<table style="width:100%" border="0" cellspacing="0" cellpadding="0">
		<tbody><tr>
			<td class="fr">
				<input id="savebtn" type="button" class="btn_style fr" style="margin-right:0px" value="暂不处理" onclick="closeWin()">
				<input id="noSavebtn" type="button" class="btn_style fr" value="否决撤销" onclick="doCancleReject()">
				<input id="savebtn" type="button" class="btn_style fr" value="同意撤销" onclick="doCancelConfirm()">
			</td>
		</tr>
	</tbody></table>
</div>
&lt;%@ include file="/framework/ui3/jsp/PostInit.jsp"%&gt;

</jsp:include></body></html>