var express = require('express');
var router = express.Router();

// TODO: Implement add/edit/remove APIs as discussed in meeting
function addListing(poster, title, description, picture, tags) {
	var id = stats.listCount;
	return id;
}

function editListing(id, title, description, picture, tags) {
	return;
}

function removeListing(id) {
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
