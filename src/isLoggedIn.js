function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        console.log(req.session.user)
        console.log(req.session)
        res.redirect('/session/login');
    }
}

export { isLoggedIn };