
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');
const User = mongoose.model('users');

passport.serializeUser((user, done) => {

  // this id is the id of the mongo record (automatically generated) - not the googleId
  done(null, user.id);
});

passport.deserializeUser((id, done) => {

  User.findById(id).then(user => {
    done(null,user);
  });
});

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, (accessToken,refreshToken,profile,done) => { 
    
    console.log("Passport!")
// async action!
    User.findOne({ googleId: profile.id })
    .then((existingUser) => {
      if (existingUser) {
        // already have a record
        console.log("existing user!")


        // this is causing a crash...
        done(null,existingUser);
      } else {
        // create new user
        new User({ googleId: profile.id })
          .save()
          .then(user => done(null,done));   
      }
    });
  })
);