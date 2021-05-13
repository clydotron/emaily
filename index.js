const express = require('express'); //use this sytnax within node
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');
require('./models/User');
require('./services/passport');


mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);

if (process.env.NODE_ENV === 'production') {

  // Express will serve up production assets
  // like main.js or main.css
  app.use(express.static('client/build'))

  // Express will serve up the index.html file 
  // if it doesnt recognize the route
  const path = require('path')
  app.get('*',(req, res) => {
    res.sendFile(path.resolve(__dirname, 'client','build','index.html'));
  })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT);

/*
https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?
response_type=code&
redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&
scope=profile%20email&
client_id=684739951574-is6f0ssrhof3rl82dbd7rfl3fvgda59f.apps.googleusercontent.com&flowName=GeneralOAuthFlow
*/