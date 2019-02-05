var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');

var indexRouter    = require('./routes/indexRouter');
var scoresRouter   = require('./routes/scoresRouter');

var app = express();

// connection to database
const USER = process.env.DB_USER;
const PORT = process.env.DB_PORT;
const NAME = process.env.DB_NAME;

mongoose.connect('mongodb://' + USER + ':' + PORT + '/' + NAME, { useNewUrlParser: true}).then(() =>{
    console.log("Database connection successful");
}).catch((err) => {
    console.log("Failed to connect to the database", err, err.message);
    mongoose.connection.close();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// middleware settings
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/', indexRouter);
app.use('/api', scoresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page and close the database if it is open
    if(mongoose.connection.readyState === 1){
        mongoose.connection.close();
    }
    mongoose.connection.close();
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});

module.exports = app;
