var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/* Other general routes */

// Login
router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Express' });
});

// Register
router.get('/register', function(req, res, next) {
	res.render('signup', { title: 'Express' });
});

module.exports = router;
