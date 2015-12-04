$(document).ready(function () {
	if($("#logged-in h2").html().length > 9){
		$("#guest").hide();
		$("#logged-in").css("display", "flex");
	}
});
