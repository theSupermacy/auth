var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var interceptor = require('express-interceptor');


var routes = require('./routes/index');
var users = require('./routes/users');
var employee = require('./routes/employee');
var config = require('./config/config')
var util = require('./util');
var app = express();

var finalParagraphInterceptor = interceptor(function(req, res){
  return {
    // Only HTML responses will be intercepted
    isInterceptable: function(){
      return true;
    },
    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      var customTimeout = 0
      var newResponse = JSON.parse(body);
      let { TimeOut } = newResponse;
      if(!TimeOut) TimeOut = 0;
      setTimeout(function(){
        send(JSON.stringify(newResponse))
      }, TimeOut*1000);
//      send($document.html());
    }
  };
})


app.use(finalParagraphInterceptor);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

config.connectDB(config.dbURL,function(err,dbConnection){
  if(err) console.log('ERROR',err)
  else {
    console.log('Connected to Database');
  }
})
app.use('/', routes);
app.use('/users', users);
app.use('/employee', employee);


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
