var api = frameElement.api;
//预览并打印
function preview()
{
	if (!!window.ActiveXObject || "ActiveXObject" in window){
		wb.execwb(7,1);
	} else {
		bdhtml=$jQuery("#content").html();
	    sprnstr="<!--startprint-->";
	    eprnstr="<!--endprint-->";
	    prnhtml=bdhtml.substr(bdhtml.indexOf(sprnstr)+17);
	    prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));
	    window.print();
	} 
}
