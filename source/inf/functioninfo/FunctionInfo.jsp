<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.*" %>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>功能信息浏览</title>
    <%
        // 获得应用上下文
        String webPath = request.getContextPath();
    %>
    <jsp:include page="/framework/resource/bootstrap/CommonHeader.jsp" flush="true"/>
    <script type="text/javascript" src="<%=webPath%>/framework/ui3/js/form-util.js"></script>
    <script type="text/javascript" src="<%=webPath%>/sams/inf/functioninfo/FunctionInfo.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/base.css" type="text/css"/>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common.css" type="text/css"/>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/blue_theme.css" type="text/css"/>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/page_list.css" type="text/css"/>
    <link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script>
    <script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
    <link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>
    <script type="text/javascript">
        var belongCenter = '<%=request.getParameter("belongCenter")==null?"":request.getParameter("belongCenter") %>';
        var belongUnit = '<%=request.getParameter("belongUnit")==null?"":request.getParameter("belongUnit") %>';
        var belongGroup = '<%=request.getParameter("belongGroup")==null?"":request.getParameter("belongGroup") %>';
        var sampleType = '<%=request.getParameter("sampleType")==null?"":request.getParameter("sampleType") %>';
        var elementName = '<%=request.getParameter("elementName")==null?"":request.getParameter("elementName") %>';
        var isSwingCard = '<%=request.getParameter("isSwingCard")==null?"":request.getParameter("isSwingCard") %>';
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
        var sampleTypeList = [];
        <%
            List<Map<String,String>> list1 = (List<Map<String, String>>)request.getAttribute("sampleTypeList");
             for(int i=0;i<list1.size();i++){
        %>
        var array1 = {}
        array1.id = '<%=list1.get(i).get("code")%>';
        array1.text = '<%=list1.get(i).get("name")%>';
        sampleTypeList.push(array1);
        <%
            }
         %>
    </script>
</head>
<body>
<div class="wrapper">
    <form class="z-page-search" method="post" action="functionInfoAction.do?method=doInit" id="functionInfoForm"
          name="functionInfoForm">
        <div class="searchTool">
            <div class="z-page-search-form">
                <table class="z-page-search-componets">
                    <tr>
                        <td>
                            <span class="name">所属中心:</span>
                            <select name="belongCenter" id="belongCenter" class="w140" onchange="changeBelongCenter()">
                                <option value="">请选择</option>
                                <c:forEach items="${belongCenterList }" var="item">
                                    <option value="${item.code }">${item.name }</option>
                                </c:forEach>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属单位:</span>
                            <select name="belongUnit" id="belongUnit" class="w140" onchange="changeBelongUnit()">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">所属研究组:</span>
                            <select name="belongGroup" id="belongGroup" class="w140">
                                <option value="">请选择</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="name">样品分类:</span>
                            <select name="sampleType" id="sampleType" class="w140">
                                <option value="">请选择</option>
                            </select>
                        </td>
                        <td>
                            <span class="name">项目名称:</span>
                            <input class="w140" type="text" id="elementName" name="elementName"/>
                        </td>
                        <%-- <td>
                            <span class="name">是否刷卡:</span>
                            <select name="isSwingCard" id="isSwingCard" class="w140">
                                <option value="">请选择</option>
                                <ec:options items="isSwingCardMap"></ec:options>
                            </select>
                        </td> --%>
                    </tr>
                </table>
                <div class="z-page-search-fold"><input type="reset" class="btn_style fr" value="重置"
                                                       onclick="doReset()"/>
                    <input type="button" class="btn_style z-btn-primary" value="查询" onclick="doQueryInfo()"/></div>
            </div>
        </div>
    </form>
    <div class="container-fluid p-lr-30">
        <div id="mainBody" class="row p-top-20">
        </div>
    </div>
    <!-- 分页  -->
    <div id="pager" class="container-fluid" style="margin-bottom: 30px; margin-left: 30%">
    </div>
    <!-- 模板 -->
    <div id="template">
        <div id="hiddenMain" class="panel panel-default" style="display:none">
            <div id="heading" class="panel-heading">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xs-6 text-left">
                            样品分类：<span id="sampleTypeName"></span>
                        </div>
                        <div class="col-xs-6">
                            所属单位：<span id="belongUnit"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="z-page-search-form">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>分析项目:</h4>
                        </div>
                    </div>
                    <br/>
                    <div id="detail" class="row">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
