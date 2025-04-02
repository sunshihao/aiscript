<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>仪器预约</title>
<head>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true"/>
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>

    <script type="text/javascript" src="<%=webPath%>/sams/ord/apply/OrdApparatusList.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>

    <script type="text/javascript">
        var orgId = "<%=request.getAttribute("orgId")%>";
        var attention = "<%=request.getAttribute("attention")%>";
        var sampleTypeMap = "<%=request.getAttribute("elementShapeMap")%>";
        var belongUnitMap = "<%=request.getAttribute("belongUnitMap")%>";
    </script>
</head>
<body>
<div >
    <div >仪器预约</div>
    <form  method="post" action="/ordApplyAction.do?method=init" id="ordApplyForm">

        <div class="searchTool">
            <div >
                <table >
                    <tr>
                        <td>
                            <span class="name">仪器范围:</span>
                            <select id="apparatusRange" name="apparatusRange">
                                <ec:options items="apparatusRangeMap"></ec:options>
                                <option value="allRange">所有仪器</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">样品分类:</span>
                            <select id="ordSampleform" name="ordSampleform">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">项目名称:</span>
                            <input type="text" id="elementName" name="elementName" placeholder="请输入"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="name">功能:</span>
                            <input type="text" id="mainFunction" name="mainFunction" placeholder="请输入"/>
                        </td>
                        <td>
                            <span class="name">仪器名称:</span>
                            <input type="text" id="apparatusName" name="apparatusName" placeholder="请输入"/>
                        </td>
                        <td>
                            <span class="name">仪器型号:</span>
                            <input type="text" id="apparatusModel" name="apparatusModel" placeholder="请输入"/>
                        </td>
                    </tr>
                    <tr id="hiddenTr1">
                        <td>
                            <span class="name">所属中心:</span>
                            <select id="belongCenter" name="belongCenter" onchange="belongCenterChange()">
                                <option value="">请选择</option>
                                <ec:options items="getUserCenterMap"></ec:options>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属单位:</span>
                            <select id="belongUnit" name="belongUnit" class="belongUnit js-states">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">预约类型:</span>
                            <select id="bookType" name="bookType">
                                <option value="">请选择</option>
                                <ec:options items="bookTypeMap"></ec:options>
                            </select>
                        </td>
                    </tr>
                    <tr id="hiddenTr2">
                        <td>
                            <span class="name">审核人:</span>
                            <input type="text" id="approveBy" name="approveBy" placeholder="请输入"/></td>
                        <td>
                            <span class="name">是否为加工类:</span>
                            <div >
                                <input type="radio" id="isMachining" name="isMachining" value="1"/><span>是</span>
                                <input type="radio" id="isMachining" name="isMachining" value="0"
                                       checked="checked"/><span>否</span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div >
                    <input type="button" class="btn_style" value="重置" onclick="doReset()"/>
                    <input type="button" class="btn_style" value="查询" onclick="doQuery()"/>
                    <a href="javascript:" style="margin-left: 8px" onclick="getMoreCondition(this)">
                        更多<span class="glyphicon glyphicon-menu-down"></span>
                    </a>
                </div>
            </div>
        </div>
    </form>
    <%--	操作区--%>
    <div >
        <input type="button" class="btn_style" value="预约" onclick="doReset()"/>
    </div>
    <!-- 内容信息 -->
    <div class="panel panel-default fl">
        <div class="panel-body padding-0" id="MainArea">
            <ec:table items="recordList" var="record" retrieveRowsCallback="limit"
                      action="${pageContext.request.contextPath}/ordApplyAction.do?method=getApparatusInfo" title=""
                      xlsFileName="仪器信息列表.xls"
                      csvFileName="仪器信息列表.csv"
                      listWidth="100%"
                      resizeColWidth="true"
                      queryForm="ordApplyForm"
                      pageSizeList="10,20,50"
                      rowsDisplayed="10"
                      classic="true">
                <ec:row recordKey="${record.apparatusId}">
                    <ec:column style="text-align:center;" width="3%" headerCell="checkbox" alias="checkboxID"
                               property="_1" viewsAllowed="html">
                        <c:if test="${record.isAvailable == '1' && record.bookStartHHFlag == '1'}">
                            <input type="checkbox" readonly="readonly" name="checkboxID" class="checkbox"
                                   value="${record.apparatusId}"/>
                        </c:if>
                    </ec:column>
                    <ec:column width="18%" property="apparatusName" title="仪器名称" ellipsis="true">
                        <a href="javascript:" onclick="doPrint('${record.apparatusId}')">${record.apparatusName}</a>
                    </ec:column>
                    <ec:column width="10%" property="elementName" title="项目" ellipsis="true"/>
                    <ec:column width="7%" property="orgName" title="所属单位" ellipsis="true"/>
                    <ec:column width="5%" property="userName" title="联系人" ellipsis="true"/>
                    <ec:column width="7%" property="userPhone" title="联系电话" ellipsis="true"/>
                    <ec:column width="5%" property="bookType" title="预约类型" mappingItem="bookTypeMap"/>
                    <ec:column width="3%" property="apparatusState" title="状态" mappingItem="apparatusStateMap"/>
                    <ec:column width="5%" property="bookStartDate" title="预约开始"/>
                    <ec:column width="4%" property="_2" title="操作" viewsAllowed="html">
                        <c:choose>
                            <c:when test="${record.isAvailable == '1' && record.bookStartHHFlag == '1' }">
                                <a class="theIcon" title="预约" href="javascript:;"
                                   onclick="doApply('${record.apparatusId}','','','${record.bookForm}')"><span
                                        class="glyphicon glyphicon-time"></span></a>丨
                            </c:when>
                            <c:otherwise>
                                <font title="预约" style="color:gray;"><span
                                        class="glyphicon glyphicon-time"></span></font>丨
                            </c:otherwise>
                        </c:choose>

                        <c:choose>
                            <c:when test="${record.attenFlag == '0' }">
                                <a class="theIcon" title="关注" href="javascript:;"
                                   onclick="doPayAttention(${record.apparatusId})"><span
                                        class="glyphicon glyphicon-eye-open"></span></a>
                            </c:when>
                            <c:otherwise>
                                <a class="theIcon" title="取消关注" href="javascript:;"
                                   onclick="doCancelAttention(${record.apparatusId})"><span
                                        class="glyphicon glyphicon-eye-close"></span></a>
                            </c:otherwise>
                        </c:choose>
                    </ec:column>
                </ec:row>
            </ec:table>
        </div>

    </div>
</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp" %>
</body>
</html><%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<html>
<title>仪器预约</title>
<head>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <link rel="stylesheet" type="text/css" href="<%=webPath %>/framework/ui4/css/bootstrap/bootstrap.min.css">

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <jsp:include page="/framework/ui3/jsp/CommonHeader.jsp" flush="true"/>
    <jsp:include page="/framework/common/jsp/EcHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath %>/framework/ui4/js/bootstrap/bootstrap.min.js"></script>

    <script type="text/javascript" src="<%=webPath%>/sams/ord/apply/OrdApparatusList.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>

    <script type="text/javascript">
        var orgId = "<%=request.getAttribute("orgId")%>";
        var attention = "<%=request.getAttribute("attention")%>";
        var sampleTypeMap = "<%=request.getAttribute("elementShapeMap")%>";
        var belongUnitMap = "<%=request.getAttribute("belongUnitMap")%>";
    </script>
</head>
<body>
<div >
    <div >仪器预约</div>
    <form  method="post" action="/ordApplyAction.do?method=init" id="ordApplyForm">

        <div class="searchTool">
            <div >
                <table >
                    <tr>
                        <td>
                            <span class="name">仪器范围:</span>
                            <select id="apparatusRange" name="apparatusRange">
                                <ec:options items="apparatusRangeMap"></ec:options>
                                <option value="allRange">所有仪器</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">样品分类:</span>
                            <select id="ordSampleform" name="ordSampleform">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">项目名称:</span>
                            <input type="text" id="elementName" name="elementName" placeholder="请输入"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="name">功能:</span>
                            <input type="text" id="mainFunction" name="mainFunction" placeholder="请输入"/>
                        </td>
                        <td>
                            <span class="name">仪器名称:</span>
                            <input type="text" id="apparatusName" name="apparatusName" placeholder="请输入"/>
                        </td>
                        <td>
                            <span class="name">仪器型号:</span>
                            <input type="text" id="apparatusModel" name="apparatusModel" placeholder="请输入"/>
                        </td>
                    </tr>
                    <tr id="hiddenTr1">
                        <td>
                            <span class="name">所属中心:</span>
                            <select id="belongCenter" name="belongCenter" onchange="belongCenterChange()">
                                <option value="">请选择</option>
                                <ec:options items="getUserCenterMap"></ec:options>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属单位:</span>
                            <select id="belongUnit" name="belongUnit" class="belongUnit js-states">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">预约类型:</span>
                            <select id="bookType" name="bookType">
                                <option value="">请选择</option>
                                <ec:options items="bookTypeMap"></ec:options>
                            </select>
                        </td>
                    </tr>
                    <tr id="hiddenTr2">
                        <td>
                            <span class="name">审核人:</span>
                            <input type="text" id="approveBy" name="approveBy" placeholder="请输入"/></td>
                        <td>
                            <span class="name">是否为加工类:</span>
                            <div >
                                <input type="radio" id="isMachining" name="isMachining" value="1"/><span>是</span>
                                <input type="radio" id="isMachining" name="isMachining" value="0"
                                       checked="checked"/><span>否</span>
                            </div>
                        </td>
                    </tr>
                </table>
                <div >
                    <input type="button" class="btn_style" value="重置" onclick="doReset()"/>
                    <input type="button" class="btn_style" value="查询" onclick="doQuery()"/>
                    <a href="javascript:" style="margin-left: 8px" onclick="getMoreCondition(this)">
                        更多<span class="glyphicon glyphicon-menu-down"></span>
                    </a>
                </div>
            </div>
        </div>
    </form>
    <%--	操作区--%>
    <div >
        <input type="button" class="btn_style" value="预约" onclick="doReset()"/>
    </div>
    <!-- 内容信息 -->
    <div class="panel panel-default fl">
        <div class="panel-body padding-0" id="MainArea">
            <ec:table items="recordList" var="record" retrieveRowsCallback="limit"
                      action="${pageContext.request.contextPath}/ordApplyAction.do?method=getApparatusInfo" title=""
                      xlsFileName="仪器信息列表.xls"
                      csvFileName="仪器信息列表.csv"
                      listWidth="100%"
                      resizeColWidth="true"
                      queryForm="ordApplyForm"
                      pageSizeList="10,20,50"
                      rowsDisplayed="10"
                      classic="true">
                <ec:row recordKey="${record.apparatusId}">
                    <ec:column style="text-align:center;" width="3%" headerCell="checkbox" alias="checkboxID"
                               property="_1" viewsAllowed="html">
                        <c:if test="${record.isAvailable == '1' && record.bookStartHHFlag == '1'}">
                            <input type="checkbox" readonly="readonly" name="checkboxID" class="checkbox"
                                   value="${record.apparatusId}"/>
                        </c:if>
                    </ec:column>
                    <ec:column width="18%" property="apparatusName" title="仪器名称" ellipsis="true">
                        <a href="javascript:" onclick="doPrint('${record.apparatusId}')">${record.apparatusName}</a>
                    </ec:column>
                    <ec:column width="10%" property="elementName" title="项目" ellipsis="true"/>
                    <ec:column width="7%" property="orgName" title="所属单位" ellipsis="true"/>
                    <ec:column width="5%" property="userName" title="联系人" ellipsis="true"/>
                    <ec:column width="7%" property="userPhone" title="联系电话" ellipsis="true"/>
                    <ec:column width="5%" property="bookType" title="预约类型" mappingItem="bookTypeMap"/>
                    <ec:column width="3%" property="apparatusState" title="状态" mappingItem="apparatusStateMap"/>
                    <ec:column width="5%" property="bookStartDate" title="预约开始"/>
                    <ec:column width="4%" property="_2" title="操作" viewsAllowed="html">
                        <c:choose>
                            <c:when test="${record.isAvailable == '1' && record.bookStartHHFlag == '1' }">
                                <a class="theIcon" title="预约" href="javascript:;"
                                   onclick="doApply('${record.apparatusId}','','','${record.bookForm}')"><span
                                        class="glyphicon glyphicon-time"></span></a>丨
                            </c:when>
                            <c:otherwise>
                                <font title="预约" style="color:gray;"><span
                                        class="glyphicon glyphicon-time"></span></font>丨
                            </c:otherwise>
                        </c:choose>

                        <c:choose>
                            <c:when test="${record.attenFlag == '0' }">
                                <a class="theIcon" title="关注" href="javascript:;"
                                   onclick="doPayAttention(${record.apparatusId})"><span
                                        class="glyphicon glyphicon-eye-open"></span></a>
                            </c:when>
                            <c:otherwise>
                                <a class="theIcon" title="取消关注" href="javascript:;"
                                   onclick="doCancelAttention(${record.apparatusId})"><span
                                        class="glyphicon glyphicon-eye-close"></span></a>
                            </c:otherwise>
                        </c:choose>
                    </ec:column>
                </ec:row>
            </ec:table>
        </div>

    </div>
</div>
<%@ include file="/framework/ui3/jsp/PostInit.jsp" %>
</body>
</html>