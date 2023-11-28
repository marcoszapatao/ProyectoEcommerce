import passport from 'passport';

function isLoggedIn(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err || !user) {

            return res.redirect('/session/login');
        }
        req.user = user;
        return next();
    })(req, res, next);
}

export { isLoggedIn };
