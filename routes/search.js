var express = require('express');
var router = express.Router();

/*
function searchMain(query){
	Listing.find({ $text: {$search: query}});
}
*/

// Get query (how does the link change?)
router.get('/search?q=/:query', function(req, res) {
	//searches listings to match query
	Listing.find({ $text: {$search: query}}, function (err, listings){
		if (err){
			console.log("Error in finding listing: router.get('/search?q=???')");
			return -1;
		}
	res.send(listings);
	});
});


