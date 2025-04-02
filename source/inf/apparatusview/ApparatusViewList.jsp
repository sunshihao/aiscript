<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<head>
    <title>仪器概况</title>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true"/>
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath%>/resource/datepicker/WdatePicker.js"></script>
    <script type="text/javascript" src="<%=webPath%>/sams/inf/apparatusview/ApparatusViewList.js"></script>
    <script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">
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
    <div class="z-page-title">仪器概况</div>
    <form class="z-page-search" method="post" action="/apparatusViewAction.do?method=doQuery" id="apparatusViewForm"
          name="apparatusViewForm">
        <input class="w140" type="hidden" id="endPurchaseDateHidden" name="endPurchaseDateHidden"
               value="${endPurchaseDate }"/>
        <div class="searchTool">
            <div class="z-page-search-form">
                <table class="z-page-search-componets">
                    <tr>
                        <td>
                            <span class="name">所属中心:</span>
                            <select class="w140" id="belongCenter" name="belongCenter" onchange="changeBelongCenter()">
                                <option value="">请选择</option>
                                <c:forEach items="${belongCenterList }" var="item">
                                    <option value="${item.code }">${item.name }</option>
                                </c:forEach>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属单位:</span>
                            <select class="w140" id="belongUnit" name="belongUnit">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">仪器名称:</span>
                            <input class="w140" type="text" id="apparatusName" name="apparatusName"/>
                        </td>
                        <td class="w100 name fr" id="moreBtn">
                            <a href="javascript:" onclick="getMoreCondition(this)">更多条件</a>
                    </tr>
                    <tr>
                        <td>
                            <span class="name">预约类型:</span>
                            <select class="w140" id="bookType" name="bookType">
                                <option value="">请选择</option>
                                <ec:options items="bookTypeMap"></ec:options>
                            </select>
                        </td>
                        <td>
                            <span class="name">预约方式:</span>
                            <select class="w140" id="bookForm" name="bookForm">
                                <option value="">请选择</option>
                                <ec:options items="bookFormMap"></ec:options>
                            </select>
                        </td>
                        <td>
                            <span class="name">仪器状态:</span>
                            <select class="w140" id="apparatusState" name="apparatusState">
                                <option value="">请选择</option>
                                <ec:options items="apparatusStateMap"></ec:options>
                            </select>
                        </td>
                    </tr>
                    <tr id="hiddenTr1">
                        <td>
                            <span class="name">购置日期起:</span>
                            <input class="w140 Wdate" type="text" id="startPurchaseDate" name="startPurchaseDate"
                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});" value="1900-01-01"/>
                        </td>
                        <td>
                            <span class="name">购置日期截止:</span>
                            <input class="w140 Wdate" type="text" id="endPurchaseDate" name="endPurchaseDate"
                                   onclick="WdatePicker({dateFmt:'yyyy-MM-dd',errDealMode:0});"
                                   value="${endPurchaseDate}"/>
                        </td>
                        <td>
                            <span class="name">共享状态:</span>
                            <select class="w140" id="shareState" name="shareState">
                                <option value="">请选择</option>
                                <ec:options items="shareStateMap" defaultKey="1"></ec:options>
                            </select>
                        </td>
                    </tr>
                    <%-- <tr id="hiddenTr2">
                        <td>
                                <span class="name">刷卡安装:</span>
                                <select class="w140" id="isSwingCard" name="isSwingCard">
                                <option value="">请选择</option>
                                <ec:options items="isSwingcardMap"></ec:options>
                            </select>
                            </td>
                        <td>
                                <span class="name">数据来源:</span>
                                <select class="w140" id="dataSource" name="dataSource">
                                <option value="">请选择</option>
                                <ec:options items="dataSourceMap"></ec:options>
                            </select>
                            </td>
                    </tr> --%>
                    <tr>
                        <td height="10px"></td>
                    </tr>

                </table>
                <div class="z-page-search-fold"><input type="reset" class="btn_style fr" value="重置"
                                                       onclick="doReset()"/>
                    <input type="button" class="btn_style fr" value="查询" onclick="doQuery()"/></div>
            </div>
        </div>
    </form>
    <div class="z-page-action z-btn-define"></div>
    <div class="panel panel-default fl">
        <div class="z-page-search-form" id="MainArea">
            <ec:table items="recordList" var="record" retrieveRowsCallback="limit" useAjax="true"
                      action="${pageContext.request.contextPath}/apparatusViewAction.do?method=doQuery"
                      xlsFileName="仪器信息列表.xls" csvFileName="仪器信息列表.csv"
                      listWidth="100%" resizeColWidth="true" pageSizeList="10,20,50,100" classic="true">
                <ec:row recordKey="${record.apparatusId}">
                    <ec:column style="text-align:center" width="4%" property="_0" title="序号" value="${GLOBALROWCOUNT}"
                               sortable="false"/>
                    <ec:column width="14%" property="deptName" title="所属区域中心" ellipsis="true"/>
                    <ec:column width="14%" property="orgName" title="单位名称" ellipsis="true"/>
                    <ec:column width="10%" property="apparatusName" title="仪器名称" ellipsis="true"/>
                    <ec:column width="10%" property="apparatusModel" title="仪器型号" ellipsis="true"/>
                    <ec:column style="text-align:right" width="10%" property="totalMoney" title="仪器价值（万元）"/>
                    <ec:column width="10%" property="userName" title="操作人员" ellipsis="true"/>
                    <ec:column width="10%" property="telPhone" title="联系电话" ellipsis="true"/>
                    <ec:column style="text-align:center" width="6%" property="bookType" title="预约类型"
                               mappingItem="bookTypeMap"/>
                    <ec:column style="text-align:center" width="6%" property="bookForm" title="预约方式"
                               mappingItem="bookFormMap"/>
                    <%--                 <ec:column style="text-align:center" width="6%" property="isSwingCard" title="刷卡安装" mappingItem="isSwingCardMap"/> --%>
                </ec:row>
            </ec:table>
        </div>
    </div>
</body>
</html>