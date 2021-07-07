// importing packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
//to configure the .env file we access env variables using process.env.VARIABLE_NAME
require('dotenv').config();

const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utilities/ExpressError')

const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user')

//express app
const app = express();

//Connecting with Database
const dbURL = process.env.DB_URL
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("Mongo Connected");
    })
    .catch(err => {
        console.log("Error!!", err);
    })

//setting up ejs templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//ejsMate for layouts,partials
app.engine('ejs', ejsMate)

//public directory to serve static css,js files
app.use(express.static(path.join(__dirname, 'public')));

//to get access of req.body parameters
app.use(express.urlencoded({ extended: true }))

//to perform put and delete requests
app.use(methodOverride('_method'))

//session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
}
app.use(session(sessionConfig))
app.use(flash());

//passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//response local variables for all requests
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//isLoggedIn checks if the user is logged in / req.isAuthenticated()
const { isLoggedIn } = require('./middleware');

//setting up different routes get,post,put,delete

//routes folders
const userRoutes = require('./routes/users')

//render home page
app.get('/', (req, res) => {
    res.render('home.ejs', { title: 'Home' })
})

//shorthand to set-up express-router
app.use('/', userRoutes)

//just to check if user is logged in here we'll define all the routes with is logged in middleware
app.get('/secret', isLoggedIn, (req, res) => {
    res.send('Hellooo')
})

//to check if the server is running
app.listen(3000, () => {
    console.log('Listening on port 3000!')
});