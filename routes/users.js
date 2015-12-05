var express = require('express');
var router = express.Router();

function addUser(email, password) {
	var id = stats.regCount;
	
	// Create a new user
	var newUser = new User({
		id: id,
		email: email,
		password: password,
		name: "",
		picture: "",
		description: "",
		location: "",
		listings: [],
		admin: false
	});
	
	newUser.save(function (err) {
		if(err) {
			console.log("Error occurred when creating user");
			return -1;
		}
		
		console.log("User creation successful");
		stats.regCount++;
		stats.save(function (err) {
			if(err) {
				console.log("Updating server stats failed.");
				return -1;
			}
		});
	});
	return id;
}

function editUser(id, name, picture, location) {
	// Edit a user by id
	User.findOne({id: id}, function (err, user) {
		// Assume that avatar has already been saved on server
		user.name = name;
		user.avatar = picture;
		user.description = description;
		user.location = location;
		
		user.save(function (err) {
			if(err) {
				console.log("Updating user profile failed.");
				return;
			}
		});
		
		console.log(user.email + "'s profile updated.");
	});

	return;
}

function toggleAdmin(id) {
	User.findOne({id: id}, function (err, user) {
		if(!user.admin) {
			user.admin = true;
		} else {
			user.admin = false;
		}
		
		user.save(function (err) {
			if(err) {
				console.log("Updating user admin priveleges failed.");
				return;
			}
		});
		
		console.log(user.email + "'s admin priveleges updated.");
	});
	
	return;
}

function removeUser(id) {
	User.findOne({id: id}, function (err, user) {
		var email = user.email;
		User.remove({id: id}, function (err) {
			if(err) {
				return false;
			}
			
			console.log("User " + email + " has been deleted.");
		});
	});
	
	// return true if successful
	return true;
}

/**************** Routes ****************/
// Create a new user
router.get('/new', function(req, res, next) {
	var email = req.query.email;
	var password = req.query.password;
	
	// Attempt to create the user
	id = addUser(email, password);
	console.log("ID: " + id);

	if(id == -1) {
		res.render('signup', {title: "Sign up - KiBay", error: "Something went wrong at the server."});
		return;
	} else if(id == 0) {
		toggleAdmin(id);
	}

	res.redirect('/login?regSuccess=true');
});

// Get specific user profile
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	var name = ""
	
	// Find the user by id
	User.findOne({id: id}, function (err, user) {
		if(!user) {
			// 404 not found
			res.redirect("/404");
			return;
		}
		
		res.locals.profileUser = user;
		if(user.name) {
			name = user.name;
		} else {
			name = user.email;
		}
		res.render('profile', {title: name + ' - KiBay'});
		
	});
});

module.exports = router;
