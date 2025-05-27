const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect('/login');
    res.status(401).json({ message: '🚫 Unauthorized: Please log in to access this resource.' });
}

module.exports = {
    isAuthenticated,
};