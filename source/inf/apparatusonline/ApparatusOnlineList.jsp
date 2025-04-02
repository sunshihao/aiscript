<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<head>
    <title>仪器在线状况</title>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true"/>
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath%>/sams/inf/apparatusonline/ApparatusOnlineList.js"></script>
    <script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>
    <script type="text/javascript">
        var orgId = "<%=request.getAttribute("orgId")%>";
        var belongUnitList = [];
        <%
            List<Map<String,String>> list = (List<Map<String, String>>)request.getAttribute("belongUnitList");
             for(int i=0;i<list.size();i++){
        %>
        var array = {}
        array.id = '<%=list.get(i).get("code")%>';
        array.text = '<%=list.get(i).get("name")%>';
        belongUnitList.push(array);
        <%       
            }
         %>
    </script>
</head>
<body>
<div class="z-page-home">
    <div class="z-page-title">仪器在线状况</div>
    <form class="z-page-search" method="post"
          action="${pageContext.request.contextPath}/apparatusOnlineAction.do?method=doQuery" id="apparatusOnlineForm"
          name="apparatusOnlineForm">
        <div class="searchTool">
            <div class="z-page-search-form">
                <table class="z-page-search-componets">
                    <tr>
                        <td>
                            <span class="name">所属中心:</span>
                            <select class="w140" id="center" name="center" onclick="changeBelongCenter('${role}')">
                                <option value="">请选择</option>
                                <c:forEach items="${belongCenterList }" var="item">
                                    <option value="${item.code }">${item.name }</option>
                                </c:forEach>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属单位:</span>
                            <select class="w140" id="orgId" name="orgId">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">仪器名称:</span>
                            <input class="w140" type="text" id="apparatusName" name="apparatusName"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="name">在线状况:</span>
                            <select class="w140" id="state" name="state">
                                <option value="">请选择</option>
                                <option value="0">全部</option>
                                <option value="1">全部可用</option>
                                <option value="2">正常</option>
                                <option value="3">正常使用中</option>
                                <option value="7">故障可使用</option>
                                <option value="8">故障不可使用</option>
                                <option value="9">故障使用中</option>
                                <option value="4">维修可使用</option>
                                <option value="5">维修不可使用</option>
                                <option value="6">维修使用中</option>
                            </select>
                        </td>
                    </tr>
                </table>
                <div class="z-page-search-fold"><input type="reset" class="btn_style fr" value="重置"
                                                       onclick="doReset()"/>
                    <input type="button" class="btn_style  z-btn-primary" value="查询" onclick="doQuery()"/></div>
            </div>
        </div>
    </form>
    <!-- 内容信息 -->
    <div class="panel panel-default fl">
        <div class="z-page-search-form" id="MainArea">
            <ec:table items="recordList" var="record" retrieveRowsCallback="limit"
                      action="${pageContext.request.contextPath}/apparatusOnlineAction.do?method=doQuery" title=""
                      xlsFileName="仪器信息列表.xls"
                      csvFileName="仪器信息列表.csv"
                      listWidth="100%"
                      resizeColWidth="true"
                      queryForm="ApparatusOnlineForm"
                      pageSizeList="10,20,50"
                      rowsDisplayed="10"
                      classic="true">
                <ec:row recordKey="${record.apparatusId}">
                    <ec:column width="9%" property="_1" title="在线状况">
                        <c:choose>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='0' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/0.gif">&nbsp;正常
                            </c:when>
                            <c:when test="${record.isOnline=='1' and record.apparatusState=='0' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/1.gif">&nbsp;正常使用中
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='1' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/2.gif">&nbsp;维修可用
                            </c:when>
                            <c:when test="${record.isOnline=='1' and record.apparatusState=='1' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/3.gif">&nbsp;维修使用中
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='1' and record.isAvailable=='0'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/4.gif">&nbsp;维修不可用
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='2' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/5.gif">&nbsp;故障可用
                            </c:when>
                            <c:when test="${record.isOnline=='1' and record.apparatusState=='2' and record.isAvailable=='1'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/6.gif">&nbsp;故障使用中
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='2' and record.isAvailable=='0'}">
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/7.gif">&nbsp;故障不可用
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='5' and record.isAvailable=='1'}">
                                离线可用
                            </c:when>
                            <c:when test="${record.isOnline=='0' and record.apparatusState=='5' and record.isAvailable=='0'}">
                                离线不可用
                            </c:when>
                            <c:otherwise>
                                <img width="20px" height="20px" src="<%=webPath %>/sams/inf/apparatusonline/pic/0.gif">&nbsp;正常
                            </c:otherwise>
                        </c:choose>
                    </ec:column>
                    <ec:column width="10%" property="apparatusName" title="仪器名称" ellipsis="true"/>
                    <ec:column width="10%" property="apparatusModel" title="仪器型号" ellipsis="true"/>
                    <ec:column width="9%" property="ordNo" title="委托单编号" ellipsis="true"/>
                    <ec:column width="5%" property="ordConsignBy" title="委托人" ellipsis="true"/>
                    <ec:column width="6%" property="useMan" title="仪器操作人" ellipsis="true"/>
                    <ec:column width="8%" property="testingStartTime" title="运行开始时间" ellipsis="true"/>
                    <ec:column width="8%" property="ordStarttime" title="预约开始时间" ellipsis="true"/>
                    <ec:column width="8%" property="ordEndtime" title="预约结束时间" ellipsis="true"/>
                    <ec:column width="8%" property="usecarddate" title="最近刷卡日期"/>
                    <ec:column width="10%" property="_2" title="操作" viewsAllowed="html">
                        <a href="javascript:return void(0)"
                           onclick="getOrdApplyList('${record.apparatusId}')">查看预约信息</a>
                    </ec:column>
                </ec:row>
            </ec:table>
        </div>
    </div>
</body>
</html>