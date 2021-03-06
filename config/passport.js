// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var Admin            = require('../models/admin');
// load the auth variables
var _ = require('underscore');
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(admin, done) {
        done(null, admin.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, admin) {
            done(err, admin);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        console.log('in signup');
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        console.log('in signup');
        Admin.findOne({ 'username' :  username }, function(err, admin) {
            // if there are any errors, return the error
            if (err){
                console.log(err);
                return done(err);
            }

            // check to see if theres already a user with that email
            if (admin) {
                console.log("already taken");
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                console.log("new admin detected");

                        var newAdmin = new Admin();
                        newAdmin.username = username;
                        newAdmin.password = newAdmin.generateHash(password);
                        
                        // save our user to the database
                        newAdmin.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newAdmin);
                        });
            }

        });    

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Admin.findOne({ 'username' :  username }, function(err, admin) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!admin)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!admin.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata


            admin.save(function(err) {
                if (err)
                    throw err;
            });
            // all is ok, return successfull user
            return done(null, admin);
        });

    }));


}
