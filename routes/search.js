var express = require('express');
var router = express.Router();

// Get query
router.get('/', function(req, res, next) {
	var query = req.query.q.split(' ');
	var matches = [];
	var userID = -1;

	User.findOne({email: query}, function(err, user){
		if(err){
			console.log("Error occurred in search (User find).");
			return;
		}
		if(user){
			userID = user.id;
			return userID;
		}
		
	});
		
	Listing.find({}, function(err, listings) {
		if(err) {
			console.log("Error occurred in search (Listing find).");
			return;
		}
		
		for(i = 0; i < listings.length; i++) {
			// iterate through all listings
			var titleWords = listings[i].title.split(' ');
			var tagWords = listings[i].tags;
			for(j = 0; j < query.length; j++) {
				// iterate through each query word
				var found = false;
				
				for(k = 0; k < titleWords.length; k++) {
					// Check against each title word
					if(query[j].toLowerCase() == titleWords[k].toLowerCase()) {
						// Found a match
						matches.push(listings[i]);
						found = true;
						break;
					}
				}
				if(found) {
					continue;
				}
				
				for(k = 0; k < tagWords.length; k++) {
					// Check against each tag word
					if(query[j].toLowerCase() == tagWords[k].toLowerCase()) {
						// Found a match
						matches.push(listings[i]);
						found = true;
						break;
					}
				}
			}
			
			if(listings[i].poster == userID){
				matches.push(listings[i]);
			}
		}


		res.locals.listings = matches;
		res.render('search', {title: "Search - KiBay", query: query.join(' ')});
		
	});
});

module.exports = router;

