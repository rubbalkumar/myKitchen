const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const config = require('./config');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.use('/views', express.static('views'));

var connection = mysql.createConnection({
    host: 'mykitchen.c3jx8fklyfbq.us-east-2.rds.amazonaws.com',
    user: 'mykitchen',
    password: 'mykitchen',
    database: 'mykitchen',
    timeout: 60000
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieSession({
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 day for cookie
    keys: [config.cookieKey],
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// store user serialize data in browser cookie 
passport.serializeUser((currUser, cb) => {
    // TODO: user = user row in the db, and currUser.id is the whatever id for the user
    cb(null, currUser.sub);
});

// get user data from browser cookie 
passport.deserializeUser((id, cb) => {
    var currUser = id; // user after check/create in the db
    // TODO: query on the db based on the id (user table id), store back to currUser var
    console.log('id of the user from cookie: ' + id);
    cb(null, currUser);
});

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: " /auth/google/redirect"
    },
    function (accessToken, refreshToken, profile, cb) {
        var currUser = profile._json; // user after check/create in the db

        // TODO: check the user table if any user with this id "profile._json.sub" exist,
        //  if yes, then just login the user
        //  else, create a new user with the profile._json data. 
        /**
        profile._json = { sub: '101216936986399344837',
        name: 'Wilbur Wildcat',
        given_name: 'Wilbur',
        family_name: 'Wildcat',
        profile: 'https://plus.google.com/101216936986399344837',
        picture: 'https://lh6.googleusercontent.com/-6UdZWLEP7oE/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdyawnB0iISiYbR0rHOMEojDL3_VQ/mo/photo.jpg',
        gender: 'male',
        locale: 'en' }
         */
        console.log(profile._json);
        // TODO: after user login/signup, call cb(null, currUser) user is the user profile
        cb(null, currUser);
    }
));

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

app.get('/', (req, res) => {
    if (req.user) {
        res.render('index', {
            user: req.user,
            recipe: ['sfs', 'sdfa']
        });
    } else {
        res.render('index', {
            user: null, 
            recipe: ['sfs', 'sdfa']
        });
    }
});

app.get('/search', (req, res)=>{
    console.log(req.query.search);
    res.send(req.query.search.split(','));
});

app.get('/auth', (req, res) => {
    if (req.user) {
        res.send('auth user');
    } else {
        res.send("guest user");
    }
});

// redirect to google login page
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // req.user will give the curr user obj
    console.log(req.user);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('listening from 3000');
});