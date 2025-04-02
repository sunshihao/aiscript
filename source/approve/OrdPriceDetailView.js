var api = frameElement.api;
jQuery().ready(function(){

	var ordSamplenum = api.data.ordSamplenum;
	jQuery('#testDetailList tr').each(function () {                
		jQuery(this).children('td').eq(4).text(ordSamplenum);
    });
})