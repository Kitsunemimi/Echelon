var express = require('express');
var router = express.Router();

/* Looks at all listings & returns the one with highest hits*/
function getTopListing() {
	
	Listing.find().sort({hits: -1}).limit(1).exec(function(err,listings){
		if(err){
			console.log("Error in finding highest hits");
			return -1;
		}
	return listing;
	});
}

/* Looks at all listings & returns 8 most recent listings by date*/
function getRecentListings() {
	
	//find all listings, sorts (-1 sorts descending) & returns most recent date
	Listing.find().sort({date: -1}).limit(8).exec(function(err,listings){
		if(err){
			console.log("Error in finding highest hits");
			return -1;
		}
		return listings;
	});
}

/**************** Routes ****************/
/* GET home page. */
router.get('/', function(req, res, next) {
	var name = ""
	if(req.user) {
		if(req.user.name) {
			name = req.user.name;
		} else {
			name = req.user.email;
		}
	}
	res.render('index', {title: "KiBay"});
});

/* Other general routes */

// Login page
router.get('/login', function(req, res, next) {
	if(req.query.regSuccess == "true") {
		// Redirected from registration
		res.render('login', {title: "Log in - KiBay", success: "Successfully registered. Log in to continue."});
	} else {
		res.render('login', {title: "Log in - KiBay"});
	}
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
	var error = "";
	console.log("Login: Email = " + email + ", Password = " + password);
	
	// Validation
	parts = email.split('@');
	if(!email || parts.length < 2 || parts[1].split('.').length < 2){
		error = "Please enter a valid email address.";
	}
	if(!password) {
		error = "Please enter a password.";
	}
	
	if(error) {
		res.render('login', {title: "Log in - KiBay", error: error});
		return;
	}
	
	User.findOne({'email': email}, function (err, user) {
		if(err) {
			// Something went wrong
			console.log("Error occurred during login");
			res.render('login', {title: "Log in - KiBay", error: "Something went wrong at the server."});
			return;
		}
		
		if(!user) {
			console.log("User not found!");
			res.render('login', {title: "Log in - KiBay", error: "Username or password incorrect."});
			return;
		} else if(user.password != password) {
			console.log("Password incorrect");
			res.render('login', {title: "Log in - KiBay", error: "Username or password incorrect."});
			return;
		} else {
			// Log in the user
			req.session.user = user;
			res.redirect('/');
		}
	});
});
// Logout function
router.get('/logout', function (req, res) {
	req.session.reset();
	res.redirect('/');
});

// Register page
router.get('/register', function(req, res, next) {
	res.render('signup', {title: "Sign up - KiBay"});
});
// Registration query handler
router.post('/register', function(req, res, next) {
	// Need to do the following validation:
	// Check empty fields for all fields
	// Check if email is valid
	// Check if email is already taken
	// Check if password matches
	var email = req.body.email;
	var password = req.body.password;
	var confirm = req.body.confirm;
	var matching = password == confirm;
	var error = ""
	console.log("Registration: Email = " + email + ", Password = " + password);
	
	// Perform validation
	parts = email.split('@');
	if(!email || parts.length < 2 || parts[1].split('.').length < 2){
		error = "Please enter a valid email address.";
	}
	if(!password || !confirm) {
		error = "Please fill out the password fields.";
	}
	if(!matching) {
		error = "Passwords don't match.";
	}
	
	if(error) {
		res.render('signup', {title: "Sign up - KiBay", error: error});
		return;
	}
	
	// Attempt to create the user
	User.findOne({'email': email}, function (err, user) {
		if(err) {
			// Something went wrong
			console.log("Error occurred during registration");
			res.render('signup', {title: "Sign up - KiBay", error: "Something went wrong at the server."});
			return;
		}
		
		if(user) {
			console.log("User already exists!");
			res.render('signup', {title: "Sign up - KiBay", error: "That email has already been taken!"});
			return;
		} else {
			// Redirect to user creation
			res.redirect('/users/new?email=' + email + '&password=' + password);
		}
	});
});

// 404 route
router.get('/404', function(req, res, next) {
	// res.render('404', title: "404 - KiBay");
	res.status(404).send("Content not found!");
	return;
});

module.exports = router;
