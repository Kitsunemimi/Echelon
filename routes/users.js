var express = require('express');
var router = express.Router();

// TODO: Implement add/edit/remove APIs as discussed in meeting
function addUser(email, password) {
	// Create a new user
	var newUser = new User({
		id: stats.regCount,
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
