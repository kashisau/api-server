var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var apiTarget = require('./middlewares/v1/api-target.js');
var apiDocs = require('./routes/api-docs.js');

var authMiddleware = require('./middlewares/v1/auth/auth-request.js');

var mAuthTokens = require('./routes/api/v1/auth/tokens.js');
var mContactValidation = require('./routes/api/v1/contact/validate.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Routing
 * 
 * Routing for this web app is handled in a series of middlewares that cascade
 * and increase in specificity until a suitable endpoint is found.
 */

// The landing page for the API is handled separately to the rest of the webapp
app.use('/', index);

// Universal middleware: dissect the URL to determine the target resource.
app.use(apiTarget);

// Document router: if the request is for documentation, render it (or else
// onto the next handler).
app.use('/v1/*', apiDocs);

// Authentication middleware: handles authorisation for any API calls.
app.use('/v1/*', authMiddleware);

// Auth module router: process token issuance and management. This middleware
// also handles some errors thrown from the authMiddlware middleware.
app.use('/v1/auth/', mAuthTokens);

// Contact form data validation router: handles data validation.
app.use('/v1/contact/*', mContactValidation);

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
