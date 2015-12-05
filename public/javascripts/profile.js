function toggleEdit(){
	$("#shade").fadeToggle("fast");
	$("#editor").fadeToggle("fast");
}

// File inputs, found at http://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3/
$(document).on('change', '.btn-file :file', function() {
	var input = $(this),
		numFiles = input.get(0).files ? input.get(0).files.length : 1,
		label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
	input.trigger('fileselect', [numFiles, label]);
});

$(document).on('fileselect', '.btn-file :file', function(event, numFiles, label) {
	var input = $(this).parents('.input-group').find(':text'),
		log = numFiles > 1 ? numFiles + ' files selected' : label;
	
	if( input.length ) {
		input.val(log);
	} else {
		if( log ) alert(log);
	}
	
});
