var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Kijiji' });
});

/* Other general routes */

// Login page
router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Log in - placeholder' });
});
// Login query handler
router.post('/login', function(req, res, next) {
	// Need to do the following validation:
	// Check empty fields for both email and password (I lost marks for not
	// doing this last time because I had it in the client)
	// Check if user exists
	// Check if password is correct
	var email = req.body.email;
	var password = req.body.password;
	//res.status(200).send("Email: " + email + "<br/>Password: " + password);
	res.redirect('/profile');
});

// Register page
router.get('/register', function(req, res, next) {
	res.render('signup', { title: 'Sign up - placeholder' });
});
// Registration query handler
router.post('/register', function(req, res, next) {
	// Need to do the following validation:
	// Check empty fields for all fields
	// Check if email is valid (NOT SURE if we're going to use emails or
	// usernames)
	// Check if email is already taken
	// Check if password matches
	var email = req.body.email;
	var password = req.body.password;
	var confirm = req.body.confirm;
	var matching = password == confirm;
	//res.status(200).send("Email: " + email + "<br/>Password: " + password + "<br/>Matching: " + matching);
	res.redirect('/profile');
});

router.get('/profile',function(req, res, next){
	res.render('profile', {id: 'Hello'});
});

module.exports = router;
