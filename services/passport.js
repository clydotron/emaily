
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
  }, 
  async (accessToken,refreshToken,profile,done) => { 
    
    const existingUser = await User.findOne({ googleId: profile.id })

    if (existingUser) {
      console.log("Passport >> existing user")
      return done(null,existingUser);
    } 
      
    console.log("Passport >> new user")
    const user = await new User({ googleId: profile.id }).save()
    done(null,done); 
  })

);

//refactored - switch to async/await

/*
async (accessToken,refreshToken,profile,done) => { 
    
  console.log("Passport!")
// async action!
  const existingUser = await User.findOne({ googleId: profile.id })

  if (existingUser) {
    done(null,existingUser);
  } else {
      // create new user
    const user = await new User({ googleId: profile.id }).save()
    done(null,done); 
  }

  // create new user
  
*/