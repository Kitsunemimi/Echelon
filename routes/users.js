var express = require('express');
var router = express.Router();

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
