
function changeDuration(id){
	var startTime = jQuery("#" + id + "_ST").val();
	var endTime = jQuery("#" + id + "_ET").val();
	var d1 = new Date(Date.parse((startTime + ":00").replace(/-/g, "/"))); 
	var d2 = new Date(Date.parse((endTime + ":00").replace(/-/g, "/"))); 
	var ordDuration = Number((d2 - d1) / 60000 / 60);
	jQuery("#" + id + "_Duration").text(ordDuration.toFixed(1));
}
