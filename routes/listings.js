var express = require('express');
var router = express.Router();

/* GET all listings. */
router.get('/', function(req, res, next) {
	res.render('listings-all', { title: 'Express' });
});

// Get specific listing by id
router.get('/:id', function(req, res, next) {
	res.render('listings-view', {title: 'Express', id: req.params.id});
});

module.exports = router;
