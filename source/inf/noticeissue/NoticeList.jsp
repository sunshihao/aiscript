<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<head>
    <title>通知发布</title>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true"/>
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath%>/sams/inf/noticeissue/NoticeList.js"></script>
    <script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
</head>
<body>
<div class="z-page-home">
    <div class="z-page-title">通知浏览</div>
    <form class="z-page-search" method="post" action="/noticeIssueAction.do?method=getViewList" id="noticeIssueForm">
        <div class="searchTool">
            <div class="z-page-search-form">
                <table class="z-page-search-componets">
                    <tr>
                        <td>
                            <span class="name">通知类型:</span>
                            <select id="noticeRange" name="noticeRange">
                                <option value="">请选择</option>
                                <ec:options items="noticeRangeMap"></ec:options>
                            </select>
                        </td>
                        <td>
                            <span class="name">发布日期起:</span>
                            <input type="text" name="createStartDate" id="createStartDate" class="Wdate"
                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});">
                        </td>
                        <td>
                            <span class="name">发布日期止:</span>
                            <input type="text" name="createEndDate" id="createEndDate" class="Wdate"
                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});">
                        </td>
                    </tr>
                </table>
                <div class="z-page-search-fold">
                    <input type="reset" class="btn_style" value="重置"/>
                    <input type="button" class="btn_style  z-btn-primary" value="查询" onclick="doQuery()"/>
                </div>
            </div>
        </div>
    </form>
    <!-- 内容信息 -->
    <div class="panel panel-default fl">
        <div class="listBox" id="MainArea">
            <ec:table items="recordList" var="record" retrieveRowsCallback="limit"
                      action="${pageContext.request.contextPath}/noticeIssueAction.do?method=getViewList" title=""
                      listWidth="100%"
                      resizeColWidth="true"
                      queryForm="noticeIssueForm"
                      pageSizeList="10,20,50"
                      rowsDisplayed="10"
                      classic="true">
                <ec:row recordKey="${record.noticeId}">
                    <ec:column style="text-align:center" width="4%" property="_0" title="序号" value="${GLOBALROWCOUNT}"
                               sortable="false"/>
                    <ec:column width="30%" property="_1" title="标题" ellipsis="true">
                        <a href="javascript:void();" onclick="doView('${record.noticeId}')">${record.noticeTitle}</a>
                    </ec:column>
                    <ec:column width="16%" property="createName" title="发布人" ellipsis="true"/>
                    <ec:column width="25%" property="noticeStartDate" title="开始日期" cell="date" parse="yyyy-MM-dd"
                               ellipsis="true"/>
                    <ec:column width="25%" property="noticeEndDate" title="结束日期" cell="date" parse="yyyy-MM-dd"
                               ellipsis="true"/>
                </ec:row>
            </ec:table>
        </div>
    </div>
</body>
</html>