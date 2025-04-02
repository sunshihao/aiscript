<%@ page contentType="text/html;charset=UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="/WEB-INF/tlds/c.tld" prefix="c" %>
<%@ taglib uri="/WEB-INF/tlds/ecside.tld" prefix="ec"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>仪器信息浏览</title>
<%
	// 获得应用上下文
	String webPath = request.getContextPath();
%>
<script type="text/javascript">
	var elementId='<%=request.getParameter("elementId") %>';
	var orgId = '<%=request.getAttribute("orgId")%>'; 
	var type = '<%=request.getAttribute("type")%>'; 
	var flg = '<%=request.getAttribute("flg")%>'; 
	var sampleType = '<%=request.getAttribute("sampleType")%>'; 
	var sampleTypeMap='';
	var belongUnitMap='';
	var attention = '1'; 
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
<jsp:include page="/framework/resource/bootstrap/CommonHeader.jsp" flush="true" />
<script src="<%=webPath%>/framework/ui3/js/lhg/lhgdialog.js?skin=iblue" type="text/javascript"></script>
<script src="<%=webPath%>/framework/ui3/js/ui3-common.js" type="text/javascript"></script> 
<script type="text/javascript" src="<%=webPath%>/framework/ui3/js/form-util.js"></script>  
<script type="text/javascript" src="<%=webPath%>/sams/inf/apparatusinfo/ApparatusInfo.js?ver=20181225001"></script>
<script type="text/javascript" src="<%=webPath%>/sams/ord/apply/OrdApparatusList.js"></script>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/base.css" type="text/css"/>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/common.css" type="text/css"/>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/blue_theme.css" type="text/css"/>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/page_list.css" type="text/css"/>

<link rel="stylesheet" href="<%=webPath%>/framework/resource/select2/css/select2.css"/>
<script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/select2.js"></script> 
<script type="text/javascript" src="<%=webPath%>/framework/resource/select2/js/i18n/zh-CN.js"></script>
<link rel="stylesheet" href="<%=webPath%>/framework/ui3/css/select2.ilead.css"/>
</head>
<body >
<div class="wrapper">
	<form method="post" action="apparatusInfoAction.do?method=doInit" id="apparatusInfoForm" name="apparatusInfoForm">
	<input id="belongCenterHidden" type="hidden" value="<%=request.getParameter("belongCenter")==null?"":request.getParameter("belongCenter") %>"/>
	<input id="belongUnitHidden" type="hidden" value="<%=request.getParameter("belongUnit")==null?"":request.getParameter("belongUnit") %>"/>
	<input id="belongGroupHidden" type="hidden" value="<%=request.getParameter("belongGroup")==null?"":request.getParameter("belongGroup") %>"/>
	<input id="sampleTypeHidden" type="hidden" value="<%=request.getParameter("sampleType")==null?"":request.getParameter("sampleType") %>"/>
	<input id="elementNameHidden" type="hidden" value="<%=request.getParameter("elementName")==null?"":request.getParameter("elementName") %>"/>
	<input id="elementId" type="hidden" value="<%=request.getParameter("elementId")==null?"":request.getParameter("elementId") %>"/>
	<input id="isSwingCardHidden" type="hidden" value="<%=request.getParameter("isSwingCard")==null?"":request.getParameter("isSwingCard") %>"/>
	<div class="panel panel-default searchTool fl">
		<div class="panel-body">
			<table>
				<tr>
					<td><span class="w110 name">所属中心</span></td>
					<td>
						<select name="belongCenter" id="belongCenter" class="w140" onchange="changeBelongCenter()">
							<option value="">-请选择-</option>
							<c:forEach items="${belongCenterList }" var="item">
								<option value="${item.code }">${item.name }</option>
							</c:forEach>
							<%-- <ec:options items="belongCenterMap"></ec:options> --%>
						</select>
					</td>
					<td><span class="w110 name">所属单位</span></td>
					<td>
						<select name="belongUnit" id="belongUnit" class="w140" onchange="changeBelongUnit()">
							<option value="">-请选择-</option>
							<%-- <c:forEach items="${belongUnitList }" var="item">
								<option value="${item.code }">${item.name }</option>
							</c:forEach> --%>
							<%-- <ec:options items="belongunitmap"></ec:options> --%>
						</select>
					</td>
					<td><span class="w110 name">所属研究组</span></td>
					<td>
						<select name="belongGroup" id="belongGroup" class="w140">
							<option value="">-请选择-</option>
						</select>
					</td>
					<td class="w100 name" id="moreBtn">
						<a href="javascript:" onclick="getMoreCondition(this)">更多条件</a>
					</td>
				</tr>
				<tr>
		            <td><span class="w110 name">仪器名称</span></td>
					<td>
		                <input class="w140" type="text" id="apparatusName" name="apparatusName" />
		            </td>
		            <td><span class="w110 name">项目名称</span></td>
					<td>
						<input class="w140" type="text" id="elementName" name="elementName" />
					</td>
					<td><span class="w110 name">仪器范围</span></td>
					<td>
						<select name="apparatusState" id="apparatusState" class="w140">
							<option value="-1">-请选择-</option>
							<ec:options items="apparatusStateMap"></ec:options>
						</select>
					</td>
				</tr>
				<tr id="hiddenTr1">
					<td><span class="w110 name">预约类型</span></td>
					<td>
						<select name="bookType" id="bookType" class="w140">
							<option value="">-请选择-</option>
							<ec:options items="bookTypeMap"></ec:options>
						</select>
					</td>
					<td><span class="w110 name">预约方式</span></td>
			        <td>
				        <select name="bookForm" id="bookForm" class="w140">
							<option value="">-请选择-</option>
							<ec:options items="bookFormMap"></ec:options>
						</select>
			        </td>
					<%-- <td><span class="w110 name">是否刷卡</span></td>
					<td>
						<select name="isSwingCard" id="isSwingCard" class="w140">
							<option value="">-请选择-</option>
							<ec:options items="isSwingCardMap"></ec:options>
						</select>
					</td> --%>
					<td><span class="w110 name">仪器大类</span></td>
					<td>
						<select name="categoryHigh" id="categoryHigh" class="w140" onchange="changeCategoryHigh()">
							<option value="">-请选择-</option>
							<ec:options items="categoryHighMap"></ec:options>
						</select>
					</td>
				</tr>
				<tr id="hiddenTr2">
					<td><span class="w110 name">仪器中类</span></td>
					<td>
						<select name="categoryMiddle" id="categoryMiddle" class="w140" onchange="changeCategoryMiddle()">
							<option value="">-请选择-</option>
						</select>
					</td>
					<td><span class="w110 name">仪器小类</span></td>
					<td>
						<select name="categorySmall" id="categorySmall" class="w140">
							<option value="">-请选择-</option>
						</select>
					</td>
				</tr>
				<tr>
					<td height="10px"></td>
				</tr>
				<tr>
					<td class="w110">&nbsp;</td>
					<td class="w140" >&nbsp;</td>
					<td class="w110">&nbsp;</td>
					<td class="w140">&nbsp;</td>
					<c:if test="${empty type}">
						<td colspan="2" style="margin-left: 100px">
							<input type="button" class="btn_style" value="查询" onclick="doQueryInfo()" />
							<input type="reset" class="btn_style" value="重置"  onclick="doReset1()"/>	
						</td>
					</c:if>
					<c:if test="${!empty type}">
						<td colspan="2" style="margin-left: 20px">
							<input type="button" class="btn_style" value="查询" onclick="doQueryInfo()" />
							<input type="reset" class="btn_style" value="重置"  onclick="doReset1()"/>	
							<input type="button" class="btn_style" value="返回" onclick="doBack()" />
						</td>
					</c:if>
					<td class="w100">&nbsp;</td>
				</tr>
			</table>
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
		        		    <div class="col-xs-6 text-left" >
		        			仪器名称与型号：<a href="javascript:" onclick="doView(this)"><span id="apparatusId" style="display:none"></span><span id="apparatusName"></span><span id="apparatusModel"></span></a>
				        	</div>
				        	<div class="col-xs-3">
				        		预约类型：<span id="bookType"></span>
				        	</div> 
				        	<div class="col-xs-3">
				        		预约方式：<span id="bookForm"></span>
				        	</div>
				        	<div class="container-fluid">
				        	<div class="row">
				        	    <div class="col-xs-6">
				        	    </div>
					        	<div class="col-xs-3">
					        		仪器管理员：<span id="apparatusAdmin"></span>
					        	</div>
					        	<div class="col-xs-3">
					        		联系电话：<span id="telPhone"></span>
					        	</div>
				        	</div>
				        	</div>
		        		</div>
		        	</div>           
		        </div>
		        
			    <div class="panel-body">
			        <div class="container-fluid">
			            <div class="row">
			                <div class="col-xs-12">
					            <h4>分析项目</h4>
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
