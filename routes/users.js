var express = require('express');
var router = express.Router();

// TODO: Implement add/edit/remove APIs as discussed in meeting
function addUser(email, password) {
	var id = stats.regCount;
	return id;
}

function editUser(id, name, picture, location) {
	return;
}

function toggleAdmin(id) {
	return;
}

function removeUser(id) {
	// return true if successful
	return true;
}


/* GET users listing. */
router.get('/', function(req, res, next) {
	// not sure if we need a listing for all users, so will probably kill this
	// block
	res.send('respond with a resource');
});

// Get specific user profile
router.get('/:id', function(req, res, next) {
	res.render('profile', {title: 'Express', id: req.params.id});
});

module.exports = router;
