var express = require('express');
var formidable = require('formidable');
var fs = require('fs-extra');
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

function editUser(id, name, picture, location, description) {
	// Edit a user by id
	User.findOne({id: id}, function (err, user) {
		// Assume that avatar has already been saved on server
		user.name = name;
		user.description = description;
		user.location = location;
		if(picture) {
			user.picture = picture;
		}
		
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

// reads listing ID's from a user.listings, grabs all of the actual listings from the database
var getUserListings = function(req, res, next) {
	var id = req.params.id;
	
	Listing.find({poster: id}, function (err, listings){
		if(err){
			console.log("Error in finding user and returning their listings");
			return -1;
		}
		
		res.locals.userListings = listings;
		next();
	});

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
router.get('/:id', getUserListings, function(req, res, next) {
	var id = req.params.id;
	var name = "";
	
	var success = "";
	var error = "";
	
	if(req.query.editSuccess == "true") {
		success = 'Profile successfully updated.';
	} else if (req.query.editSuccess == "false") {
		error = 'Permission denied.';
	} else if (req.query.pwdChangeSuccess == "true") {
		success = 'Password successfully updated.';
	} else if (req.query.pwdChangeSuccess == "error1") {
		error = 'Permission denied.';
	} else if (req.query.pwdChangeSuccess == "error2") {
		error = 'Current password incorrect.';
	} else if (req.query.pwdChangeSuccess == "error3") {
		error = "Passwords don't match.";
	} else if (req.query.pwdChangeSuccess == "error4") {
		error = "A server error has occurred";
	}
	
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
		
		res.render('profile', {title: 'Users - ' + name + ' - KiBay', success: success, error: error});
	});
});

// Edit profile
router.post('/:id', function(req, res, next) {
	if(!req.user || req.user.id != req.params.id) {
		res.redirect('/users/' + req.params.id + '?editSuccess=false');
		return;
	}
	
	var name;
	var picture = "";
	var fileType;
	var location;
	var description;
	
	// Copy/paste avatar spaghetti code from A4
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		name = fields.name;
		location = fields.location;
		description = fields.description;
		fileType = files.picture.type.split('/')[0];
	});
	
	form.on("end", function(fields, files) {
		var temp_path;
		var file_extension;
		var new_location = "./public/images/";
		if(fileType == "image") {
			temp_path = this.openedFiles[0].path;
			name_split = this.openedFiles[0].name.split('.');
			file_extension = name_split[name_split.length - 1];
			
			// Attempt to save picture if given.
			var file_name = "avatar-" + req.params.id + "." + file_extension;
			if(file_extension) {
				fs.copy(temp_path, new_location + file_name, function(err) {  
					if (err) {
						console.log("Avatar could not be saved: " + err);
						return;
					}
				});
				picture = "images/" + file_name;
			}
		}
		
		editUser(req.params.id, name, picture, location, description);
		res.redirect('/users/' + req.params.id + '?editSuccess=true');
	});
});

// Change password
router.post('/:id/changePwd', function(req, res, next) {
	if(!req.user || req.user.id != req.params.id) {
		res.redirect('/users/' + req.params.id + '?pwdChangeSuccess=error1');
		return;
	}
	
	var current = req.body.curPwd;
	var newPass = req.body.newPwd;
	var confirm = req.body.confirmPwd;
	
	if(newPass != confirm) {
		res.redirect('/users/' + req.params.id + '?pwdChangeSuccess=error3');
		return;
	}
	
	User.findOne({id: req.params.id}, function (err, user) {
		if(!user) {
			res.redirect('/users/' + req.params.id + '?pwdChangeSuccess=error4');
			return;
		}	
		if(current != user.password) {
			res.redirect('/users/' + req.params.id + '?pwdChangeSuccess=error2');
			return;
		}
		
		// If we passed all those checks, then change the password
		user.password = newPass;
		user.save(function (err) {
			if(err) {
				console.log("Updating password failed.");
				return;
			}
		});
		
		res.redirect('/users/' + req.params.id + '?pwdChangeSuccess=true');
		console.log(user.email + "'s password updated.");
	});	
});

// Make admin
router.get('/:id/toggleAdmin', function(req, res, next) {
	if(!req.user || !req.user.admin) {
		res.redirect('/users/' + req.params.id + '?editSuccess=false');
		return;
	}
	
	toggleAdmin(req.params.id);
	res.redirect('/users/' + req.params.id + '?editSuccess=true');
});

// Delete profile
router.get('/:id/delete', function(req, res, next) {
	if(!req.user || !req.user.admin) {
		res.redirect('/users/' + req.params.id + '?editSuccess=false');
		return;
	}
	
	removeUser(req.params.id);
	res.redirect('/');
});

module.exports = router;
