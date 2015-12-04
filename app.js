var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('client-sessions');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');
var search = require('./routes/search');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Mongoose setup
mongoose.connect('mongodb://localhost/Echelon', {
	user: '',
	pass: ''
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('Connected to MongoDB');
});

// TODO: Implement Schemas as described in meeting
var UserSchema = mongoose.Schema({
	id: Number,
	email: String,
	password: String,
	name: String,
	description: String,
	picture: String, 
	location: String,
	listings: Array,
	admin: Boolean	
});
var ListingSchema = mongoose.Schema({
	id: Number,
	poster: String,
	title: String,
	description: String,
	price: Number,
	picture: String, 
	comments: [{poster: String, date: Date, text: String}],
	date: {type: Date, default: Date.now},
	hits: Number,
	tags: Array
});
var StatsSchema = mongoose.Schema({
	regCount: Number,
	listCount: Number
});

var User = mongoose.model('User', UserSchema);
var Listing = mongoose.model('Listing', ListingSchema);
var ServerStats = mongoose.model('Stats', StatsSchema);
var stats;
// Initialize server stats if neccessary
ServerStats.find(function (err, results) {
	if(!results.length) {
		console.log("Tracking fresh server stats");
		var newStats = new ServerStats({
			regCount: 0,
			listCount: 0
		});
		
		newStats.save(function (err) {
			if(err) {
				console.log("Error occurred when creating server stats!");
				process.exit(1);
			}
		});
		stats = newStats;
	} else {
		// By default, use first entry found
		stats = results[0];
	}
	console.log("Server registration count: " + stats.regCount);
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	cookieName: 'session',
	secret: 'himitsu',
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 24 * 60 * 60 * 1000,
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/listings', listings);
app.use('/search', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
