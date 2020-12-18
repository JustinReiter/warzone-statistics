var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

const { updateLadders, updateDailyStandings } = require('./updateLadders');
const { populateColourResults, populateDailyStandings, populateEloRatings, populateSingleLadderEloRatings, populateTrueSkillRatings } = require('./initializeDatabases');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var laddersRouter = require('./routes/ladders');
var gamesRouter = require('./routes/games');
var coloursRouter = require('./routes/colours');

var app = express();

// Used for finding new games
var schedule = require('node-schedule');
const db = require('./database');

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
app.use("/games", gamesRouter);
app.use("/colours", coloursRouter);

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

// Update ladders every 2 hours
var updateLaddersJob = schedule.scheduleJob('0 */2 * * *', () => {
	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Starting process to update ladders with new games`);
	updateLadders();
});

// Update ladder standings at 4:10AM (Staggered to update after ladders fetch new games)
var updateDailyStandingsJob = schedule.scheduleJob('10 4 * * *', () => {
	console.log(`[${new Date().toISOString().slice(0, 19).replace('T', ' ')}] Starting process to update daily standings`);
	updateDailyStandings();
});

console.log(`Starting running back-end process at ${new Date().toISOString()}`);


//! Run single-use scripts
// Initalize colour_results for all ladders
db.any('SELECT * FROM colour_results;').then((colours) => {
	if (colours.length === 0) {
		populateColourResults();
	}
});

// Initialize daily_standings for all ladders
db.any('SELECT * FROM daily_standings;').then((standings) => {
	if (standings.length === 0) {
		populateDailyStandings();
	}
});

// Initialize player_results with elo ratings
db.any('SELECT * FROM player_results;').then((players) => {
	if (players.length === 0) {
		populateEloRatings();
	}
});

// Initialize player_results with elo ratings
const LADDER_TO_UPDATE = 4076;
db.any('SELECT * FROM player_results WHERE lid=$1;', [LADDER_TO_UPDATE]).then((players) => {
	if (players.length === 0) {
		populateSingleLadderEloRatings(LADDER_TO_UPDATE);
	}
});

// Initialize player_results/colour_results for season X (TrueSkill for 4FFA)
db.any('SELECT * FROM player_results WHERE lid=4009;').then((players) => {
	if (players.length === 0) {
		populateTrueSkillRatings();
	}
});

// Single-use script to reset players database
// collapsePlayerNames();

module.exports = app;
