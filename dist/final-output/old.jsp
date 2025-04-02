<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>

<html>
<head>
<title>单位概况</title>
<%
    // 获得应用上下文
    String webPath = request.getContextPath();
%>
    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true" />
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true" />
    <script type="text/javascript" src="<%=webPath%>/sams/inf/unitview/UnitViewList.js"></script>
    <script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="<%=webPath%>/framework/ui4/css/bootstrap/bootstrap.min.css">

    <link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script> 
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>
    <script type="text/javascript">
        var orgId = "<%=request.getAttribute("orgId")%>"; 
        var belongUnitList= [];
        <%
            List<Map<String,String>> list = (List<Map<String, String>>)request.getAttribute("belongUnitList");
             for(int i=0;i<list.size();i++){

        %>    
            var array = {}
            array.id='<%=list.get(i).get("code")%>';
            array.text='<%=list.get(i).get("name")%>';
            belongUnitList.push(array);
        <%       
            }
         %>
    </script>
</head>
<body>
<div class="z-page-home">
    <div class="z-page-title">单位概况</div>
<form class="z-page-search" method="post" action="/unitViewAction.do?method=doQuery" id="unitViewForm">
    <div class="searchTool">
        <div class="z-page-search-form">
            <table class="z-page-search-componets">
                <tr>
                    <td>
                            <span class="name">所属中心:</span>
                            <select class="" id="belongCenter" name="belongCenter" onChange="changeBelongCenter()">
                            <option value="">请选择</option>
                            <c:forEach items="${belongCenterList }" var="item">
                                <option value="${item.code }">${item.name }</option>
                            </c:forEach>
                        </select>
                        </td>
                    <td>
                            <span class="name">所属单位:</span>
                            <select class="" id="belongUnit" name="belongUnit">
                            <option value="">请选择</option>
                        </select>
                        </td>
                    <td>
                            <span class="name">仪器状态:</span>
                            <select class="" id="apparatusState" name="apparatusState">
                            <option value="">请选择</option>
                            <ec:options items="apparatusStateMap"></ec:options>
                        </select>
                        </td>
                </tr>
                <tr>
                    <td>
                            <span class="name">共享状态:</span>
                            <select class="" id="shareState" name="shareState">
                            <option value="">请选择</option>
                            <ec:options items="shareStateMap" defaultKey="1"></ec:options>
                        </select>
                        </td>
                    <%-- <td>
                            <span class="name">刷卡安装:</span>
                            <select class="" id="isSwingCard" name="isSwingCard">
                            <option value="">请选择</option>
                            <ec:options items="isSwingCardMap"></ec:options>
                        </select>
                        </td> --%>
                </tr>

            </table>
<div class="z-page-search-fold"><input type="button" class="btn_style fr z-btn-primary" value="查询" onclick="doQuery();" /><input type="reset" class="btn_style fr" value="重置" onclick="doReset()"/>
                        </div>
        </div>
    </div>
</form>
<div id="acationArea" class="z-page-action z-btn-define"></div>
<!-- 内容信息 -->
<div class="panel panel-default fl">
    <div class="panel-body padding-0" id="MainArea">
        <ec:table items="recordList" var="record" retrieveRowsCallback="limit"
            action="${pageContext.request.contextPath}/unitViewAction.do?method=doQuery" title="" 
            xlsFileName="单位信息列表.xls" 
            csvFileName="单位信息列表.csv"
            listWidth="100%"  
            resizeColWidth="true" 
            queryForm="UnitViewForm"
            pageSizeList="10,20,50"
            rowsDisplayed="10"
            classic="true">
            <ec:row recordKey="${record.belongUnit}">
                <ec:column style="text-align:center"  width="4%" property="_0" title="序号" value="${GLOBALROWCOUNT}" sortable="false"/>
                <c:if test="${record.belongCenter=='0' or empty record.belongCenter}">
                    <ec:column width="14%" property="belongCenter" title="所属区域中心" ellipsis="true">
                        <span>无</span>
                    </ec:column>
                </c:if>
                <c:if test="${record.belongCenter!='0' and !empty record.belongCenter}">
                    <ec:column width="14%" property="belongCenter" title="所属区域中心" mappingItem="belongCenterMap" ellipsis="true"/>
                </c:if>
                <ec:column width="14%" property="orgName" title="单位名称" ellipsis="true"/>
                <ec:column style="text-align:right" width="10%" property="appNuCount" title="仪器总量"/>
                <ec:column style="text-align:right" width="10%" property="moneyCount" title="仪器总值（万元）"/>
                <ec:column style="text-align:right" width="10%" property="userNuCount" title="仪器操作人员数"/>
                <ec:column width="10%" property="userName" title="联系人姓名" ellipsis="true"/>
                <ec:column width="10%" property="telPhone" title="联系电话" ellipsis="true"/>
                <ec:column width="10%" property="email" title="Email地址" ellipsis="true"/>
            </ec:row>
        </ec:table>
    </div>
    <div class="panel-body padding-0" id="userInfo">
        <table style="background: #eef0f3;width: 100%;height: 30px;margin-top: 10px">
            <tr>
                <td width="25%" align="center" style="font-size: 13px"><span class="name">合计</span></td>
                <td width="25%" align="center" style="font-size: 13px">仪器数量：<input style="border:0px;background: #eef0f3;text-align: center" type="text" id="totalApp" name="totalApp" disabled="disabled" value="${totalApp}" />台套</td>
                <td width="25%" align="center" style="font-size: 13px">总价值：<input style="border:0px;background: #eef0f3;text-align: center" type="text" id="totalMoney" name="totalMoney" disabled="disabled" value="${totalMoney}"/>万元</td>
                <td width="25%" align="center" style="font-size: 13px">仪器操作人数：<input style="border:0px;background: #eef0f3;text-align: center" type="text" id="totalUsers" name="totalUsers" disabled="disabled" value="${totalUsers}"/>人</td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>