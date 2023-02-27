const path = require('path');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

const config = {
  CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_OAUTH_SECRET
};

const AUTH_OPTIONS = {
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
};

function verifyCallback (accessToken, refreshToken, profile, done) {
  console.log('google profile', profile);
  done(null, profile)
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback ))

const app = express();

app.use(helmet());
app.use(passport.initialize());

function checkLoggedIn (req,res,next) {
  const isLoggedIn = true;
  if(!isLoggedIn) {
    return res.status(401).json({
      message:'You must log in'
    })
  };
  next();
}

app.get('/auth/google', 
  passport.authenticate('google', {
    scope: ['email'],
  }));

app.get('/auth/google/callback', 
  passport.authenticate('google', {
    failureRedirect: 'failure',
    successRedirect: '/',
    session: false
  }), 
  (req, res) => {
    console.log('google called us back');
  });

app.get('/auth/logout', (req, res) => {

});

app.get('/secret',checkLoggedIn, (req, res) => {
  return res.send('Your secret number is 21')
});

app.get('/failure', (req, res) => {
  return res.send('Failed to log in')
})

const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({
  key: fs.readFileSync('key.pem'), 
  cert: fs.readFileSync('cert.pem')
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});