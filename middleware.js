// all the frequentlu used middleware files go here

module.exports.isLoggedIn = (req, res, next) => {
    //we check if the user is logged in using req.isAuthenticated method from passport
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}