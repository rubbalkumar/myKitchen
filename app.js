const express = require('express');
const mysql = require('mysql');
const passport = require('passport');
const config = require('./config');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

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
    cb(null, currUser.id);
});

// get user data from browser cookie 
passport.deserializeUser((id, cb) => {
    var sql2 = "SELECT * FROM users WHERE id = '" + id + "';";
    connection.query(sql2, function (err, result3) {
        if (err) throw err;
        else {
            cb(null, result3[0]);
        }
    });
});


passport.use(new GoogleStrategy({
        clientID: config.google_client_id,
        clientSecret: config.google_client_secret,
        callbackURL: " /auth/google/redirect"
    },
    function (accessToken, refreshToken, profile, cb) {
        var sql = "SELECT * FROM users WHERE googleid = '" + profile._json.sub + "';";
        connection.query(sql, function (err, result2) {
            if (err) throw err;
            else if (result2[0] == null) {
                var sql1 = "INSERT INTO users (username, googleid, picture, bookmarked, contributed) VALUES ('" + profile._json.name + "', '" + profile._json.sub + "', '" + profile._json.picture + "', 0, 0);";
                console.log(sql1);
                connection.query(sql1, function (err, result7) {
                    if (err) {
                        console.log('error in sql user insert');
                    }
                });
            }

            var sql2 = "SELECT * FROM users WHERE googleid = '" + profile._json.sub + "';";
            connection.query(sql2, function (err, result3) {
                if (err) throw err;
                else {
                    cb(null, result3[0]);
                }
            });
        });
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

app.get('/pantry/add/:ingredient', (req, res) => {
    console.log(req.params.ingredient);
    var item = req.params.ingredient;
    if (req.user) {
        var userID = req.user.id;
        // TODO: based on the userID add a new ingredient in the user pantry list
    } else {
        res.send('unauthorized');
    }
});

app.get('/pantry/remove/:ingredient', (req, res) => {
    console.log(req.params.ingredient);
    var item = req.params.ingredient;
    if (req.user) {
        var userID = req.user.id;
        // TODO: based on the userID remove the ingredient in the user pantry list
    } else {
        res.send('unauthorized');
    }
});


app.get('/recipe/', (req, res) => {
    if (req.user) {
        res.render('recipe_details', {
            user: req.user,
            recipe: ['sfs', 'sdfa']
        });
    } else {
        res.render('recipe_details', {
            user: null,
            recipe: ['sfs', 'sdfa']
        });
    }
});

app.get('/search', (req, res) => {
    var ing = req.query.search.split(',');
    var sql = "SELECT * FROM recipes WHERE ingredients LIKE ";
    var i;
    for (i = 0; i < ing.length - 1; i++) {
        sql += "'%" + ing[i].trim() + "%' OR ingredients LIKE ";
    }
    sql += "'%" + ing[i].trim() + "%';";
    console.log(sql);
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });

    res.send(ing);
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