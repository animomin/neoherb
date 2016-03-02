var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var pharms = require('./routes/pharms');
var hosps = require('./routes/hosps');
var master = require('./routes/master');
var modals =require('./routes/modals');

var app = express();

global.appPath = __dirname;

// view engine setup
app.set('views', path.join(__dirname, 'neoviews'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.use('/bootstrap', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/')));
app.use('/bootstrap-datepicker', express.static(path.join(__dirname, '/node_modules/bootstrap-datepicker/dist/')));
app.use('/icheck', express.static(path.join(__dirname, '/node_modules/icheck/')));
app.use('/sweetalert', express.static(path.join(__dirname, '/node_modules/sweetalert/dist/')));
app.use('/jquery-slimscroll', express.static(path.join(__dirname, '/node_modules/jquery-slimscroll/')));
app.use('/summernote', express.static(path.join(__dirname, '/node_modules/summernote/dist/')));

app.use('/', routes);
app.use('/users', users);
app.use('/hosp', hosps);
app.use('/pharm', pharms);
app.use('/master', master);
app.use('/modal', modals);

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
