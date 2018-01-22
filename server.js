'use strict';
var path = require('path');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var favicon = require('serve-favicon');

require('./server/models/db');
require('./server/config/passport');

var routesApi = require('./server/routes/index');

var app = express();

app.use(favicon(__dirname + '/client/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'client')));

app.use(passport.initialize());
app.use('/api', routesApi);

app.use(function(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  } else {
    next(err);
  }
});

app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500);
  res.json({"message" : err.name + ": " + err.message});
});

var port = process.env.PORT || 3000

app.listen(port, process.env.IP || "0.0.0.0", function(){
  console.log("Server listening on " + port);
});

module.exports = app;