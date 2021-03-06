// First line
var express = require('express');
var path = require('path');
// Third line
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog');  //Import routes for "catalog" area of site
var auth = require('./routes/auth')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/library')
    .then(() => {
        console.log('connection succesful')
        var passport = require('passport');
        var LocalStrategy = require('passport-local').Strategy;

        app.use(require('express-session')({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: false
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        var User = require('./models/User');
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());


        app.use(function (req, res, next) {
            console.log("Hello from middleware")
            next();
        });

        app.use(function (req, res, next) {
            console.log("Hello from other middleware")
            next()
        });

        app.use('/auth', auth)
        app.use('/', index);
        app.use('/users', users);
        app.use('/catalog', catalog);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
        app.use(function (req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

// error handler :(
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    })
    .catch((err) => console.error(err));

module.exports = app;
