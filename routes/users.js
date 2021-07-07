// requiring dependencies
const express = require('express');
const passport = require('passport');
//mergeparams enables us to access id param in /product/:id/blah
const router = express.Router({ mergeParams: true });

const User = require('../models/user')
const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')

//get req to register we render ejs page in views/users/register.ejs , we pass {title} to use it in boilerplate layout
router.get('/register', (req, res) => {
    res.render('users/register', { title: 'Register' });
})

//post req they will be async functions 
router.post('/register', async (req, res, next) => {
    try {
        //extract email name pass from form fields
        const { email, username, password } = req.body;
        //create a new User instance only pass parameters other than password
        const user = new User({ email, username });
        //specifically pass the password seperately with the prev created user it automatically adds salt and hashes the password
        const registeredUser = await User.register(user, password);
        //to login the newly registered user instead of asking him to login again
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome Back!');
            res.redirect('/')
        })
        //in case there is any error we flash and redirect
    } catch (e) {
        req.flash('success', e.message);
        res.redirect('/register')
    }
})



router.get('/login', (req, res) => {
    res.render('users/login', { title: 'Login' });
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye !')
    res.redirect('/')
})

module.exports = router;