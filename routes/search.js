var express = require('express');
var router = express.Router();

// Get query
router.get('/', function(req, res, next) {
	var query = req.query['q'];
	res.status(200).send(query);
	
	//searches listings to match query
	Listing.find({ $text: {$search: query}}, function (err, listings){
		if (err){
			console.log("Error in finding listing: router.get('/search')");
			return -1;
		}
	});
});

module.exports = router;

