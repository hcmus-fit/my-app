var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
    console.log("User: " + req.user)
    res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
    res.render('Auth/register');
};

// Post registration
userController.doRegister = function(req, res) {
    User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

// Go to login page
userController.login = function(req, res) {
    res.render('Auth/login');
};

// Post login
userController.doLogin = function(req, res) {
    passport.authenticate('local')(req, res, function () {
        res.redirect('/auth');
    });
};

// logout
userController.logout = function(req, res) {
    req.logout();
    res.redirect('/auth');
};

module.exports = userController;