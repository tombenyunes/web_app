// redirects to login page if the user is not currently logged in
exports.redirectLogin = (req, res, next) =>
{
    if (!req.session.userId ) { // userId determines if a user is logged in
        res.redirect('./login')
    } else { next(); }
}

exports.redirectAdmin = (req, res, next) =>
{
    if (!req.session.userId || req.session.isAdmin == 'false') { // userId determines if a user is logged in            
        res.redirect('./login')
    }
    else {
        next();
    }
}