var express = require('express');
var formidable = require('formidable');
var fs = require('fs-extra');
var router = express.Router();

function addListing(poster, title, description, price, picture, tags) {
	var id = stats.listCount;
	var date = new Date();
	
	// Create a new listing
	var newListing = new Listing({
		id: id,
		poster: poster,
		title: title,
		description: description,
		price: price,
		picture: "",
		comments: [],
		date: date,
		hits: 0,
		tags: []
	});
	
	newListing.save(function (err) {
		if(err) {
			console.log("Error occurred when creating listing");
			return -1;
		}
		
		console.log("Listing creation successful");
		stats.listCount++;
		stats.save(function (err) {
			if(err) {
				console.log("Updating server stats failed.");
				return -1;
			}
		});
	});
	return id
}

function editListing(id, title, description, price, picture, tags) {
// Edit a listing by id
	Listing.findOne({id: id}, function (err, listing) {
		// Assume that avatar has already been saved on server
		listing.title = title;
		listing.description = description;
		listing.price = price;
		listing.picture = picture;
		listing.tags = tags;
		
		listing.save(function (err) {
			if(err) {
				console.log("Updating listing failed.");
				return;
			}
		});
		
		console.log(listing.name + ". Listing updated.");
	});

	return;
}

function removeListing(id) {
	Listing.findOne({id: id}, function (err, listing) {
		var title = listing.title;
		Listing.remove({id: id}, function (err) {
			if(err) {
				return false;
			}
			
			console.log("Listing " + id + " - " + title + " has been deleted.");
		});
	});
	
	// return true if successful
	return true;
}

var processForm = function(req, res, next) {
	req.form = {};
	req.form.id = stats.listCount;
	req.form.picture = "";
	var fileType;
	
	// Copy/paste avatar spaghetti code from A4
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		req.form.title = fields.title;
		req.form.posterID = fields.poster;
		req.form.price = Number(fields.price);
		req.form.description = fields.description;
		req.form.tags = fields.tags.split(' ');
		fileType = files.picture.type.split('/')[0];
		
		console.log(fields);
		if(!req.user || req.user.id != req.form.posterID) {
			req.error = "Permission denied."
			next();
		}
		if(!req.form.title) {
			req.error = "Title cannot be empty."
			next();
		} else if(!req.form.description) {
			req.error = "Description cannot be empty."
			next();
		}
	});
	
	form.on("end", function(fields, files) {
		var temp_path;
		var file_extension;
		var new_location = "./public/images/";
		if(fileType == "image") {
			temp_path = this.openedFiles[0].path;
			name_split = this.openedFiles[0].name.split('.');
			file_extension = name_split[name_split.length - 1];
			
			// Attempt to save picture if given.
			var file_name = "listing-" + id + "." + file_extension;
			if(file_extension) {
				fs.copy(temp_path, new_location + file_name, function(err) {  
					if (err) {
						console.log("Listing picture could not be saved: " + err);
						return;
					}
				});
				req.form.picture = "images/" + file_name;
			}
		}
		
		next();
	});
}


/* GET all listings. */
router.get('/', function(req, res, next) {
	res.render('search', {title: "Search - KiBay"});
});

// Serve page to create a new listing
router.get('/create', function(req, res, next) {
	if(!req.user) {
		res.redirect('/register');
	}
	
	// Create a new empty listing, and then pass it to jade
	listing = new Listing({
		id: -1,
		poster: req.user.id,
		title: "",
		description: "",
		price: 0,
		picture: "", 
		comments: [],
		date: new Date(),
		hits: 0,
		tags: []
	});
	
	res.locals.listing = listing;
	res.render('listings-edit', {title: "Create a listing - KiBay", action: "create", error: req.query.error});
});

// Create the new listing
router.post('/create', processForm, function(req, res, next) {
	// Use middleware shared by the edit listings route to process the form
	if(req.error) {
		res.redirect('/listings/create?error='+req.error);
		return;
	}
	
	id = addListing(req.form.posterID, req.form.title, req.form.description, req.form.price, req.form.picture, req.form.tags);
	if(id == -1) {
		res.redirect("/listings/create?error=Something went wrong at the server.");
		return;
	}
	
	res.redirect('/listings/' + id);
});

// Get specific listing by id
router.get('/:id', function(req, res, next) {
	res.render('listings', {title: 'Express', id: req.params.id});
});

module.exports = router;
