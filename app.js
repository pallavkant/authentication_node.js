var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser');

mongoose.connect("mongodb://localhost/authentication");

var app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

/// App settings for passport

app.use(expressSession({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================================================================
//              Routes
//=====================================================================

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/secret", function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}, function(req, res) {
    res.render("secret");
});

// Register Routes

app.get("/register", function(req, res) {
    res.render("register");
});
app.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err)
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secret");
            });
        }
    });
});

// Login Routes

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res) {

});

// Logout Routes

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.listen(80, "localhost", function() {
    console.log("Server Has started !");
});