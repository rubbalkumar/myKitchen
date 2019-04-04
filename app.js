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
    console.log('here~~~~~~> ' + currUser.googleid);
    cb(null, currUser.id);
});

// get user data from browser cookie 
passport.deserializeUser((id, cb) => {
    var currUser = id; // user after check/create in the db
    // TODO: query on the db based on the id (user table id), store back to currUser var
    // console.log('id of the user from cookie: ' + id);
    console.log('deserialize user: ' + id);
    var sql2 = "SELECT * FROM users WHERE id = '" + id + "';";
            connection.query(sql2, function (err, result3) {
                if (err) throw err;
                else {
                    console.log(result3[0])
                    cb(null, result3[0]);
                }
            });
});

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: " /auth/google/redirect"
},
    function (accessToken, refreshToken, profile, cb) {
        var currUser = profile._json; // user after check/create in the 

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
        //console.log(profile._json.sub);
        // TODO: after user login/signup, call cb(null, currUser) user is the user profile

        var sql = "SELECT * FROM users WHERE googleid = '" + profile._json.sub + "';";
        connection.query(sql, function (err, result2) {
            if (err) throw err;
            else if (result2[0] == null) {
                var sql1 = "INSERT INTO users (username, googleid, picture, bookmarked, contributed) VALUES ('" + profile._json.name + "', '" + profile._json.sub + "', '" + profile._json.picture + "', 0, 0);";
                console.log(sql1);
                connection.query(sql1, function (err, result7) {
                    if (err) {
                        console.log('error in sql user inFsert')
                    } else {
                        console.log(result7);
                        console.log("here");
                    }
                });
            }

            var sql2 = "SELECT * FROM users WHERE googleid = '" + profile._json.sub + "';";
            connection.query(sql2, function (err, result3) {
                if (err) throw err;
                else {
                    console.log('curruser data from db: ---> '+result3[0].id);
                    cb(null, result3[0]);
                }
            });


        });



        // cb(null, currUser);
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