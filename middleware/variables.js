const csrf = require('csurf');
module.exports = (req, res, next) => {
    res.locals.isAuth = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    next()
}