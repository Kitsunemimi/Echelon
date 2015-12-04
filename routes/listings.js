var express = require('express');
var router = express.Router();

// TODO: Implement add/edit/remove APIs as discussed in meeting
function addListing(poster, title, description, price, picture, tags) {
	// Create a new listing
	var newListing = new Listing({
		id: stats.listCount,
		poster: poster,
		title: title,
		description: "",
		price: price,
		picture: "",
		tags: []
	});
	
	newlisting.save(function (err) {
		if(err) {
			console.log("Error occurred when creating lsiting");
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
		listing.remove({id: id}, function (err) {
			if(err) {
				return false;
			}
			
			console.log("listing" + title + "has been deleted.");
		});
	});
	
	// return true if successful
	return true;
}


/* GET all listings. */
router.get('/', function(req, res, next) {
	res.render('listings-all', { title: 'Express' });
});

// Get specific listing by id
router.get('/:id', function(req, res, next) {
	res.render('listings-view', {title: 'Express', id: req.params.id});
});

module.exports = router;
