var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

const { updateLadders, updateDailyStandings } = require('./updateLadders');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var laddersRouter = require('./routes/ladders');

var app = express();

// Used for finding new games
var schedule = require('node-schedule');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/ladders", laddersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
		next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

console.log("Running app");

// Update ladders every 2 hours
//! Ignore jobs until application is initialized
var updateLaddersJob = schedule.scheduleJob('*/2 * * *', () => {
	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Starting to update ladders`);
	updateLadders();
	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Finished updating ladders`);
});

// Update ladder standings at 4AM
//! Ignore jobs until application is initialized
// var updateDailyStandingsJob = schedule.scheduleJob('4 * * *', () => {
// 	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Starting to update daily standings`);
// 	updateDailyStandings();
// 	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Finished updating daily standings`);
// });

module.exports = app;
