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

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);

/*
https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?
response_type=code&
redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&
scope=profile%20email&
client_id=684739951574-is6f0ssrhof3rl82dbd7rfl3fvgda59f.apps.googleusercontent.com&flowName=GeneralOAuthFlow
*/