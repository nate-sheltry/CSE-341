require('passport');

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        res.set({'Authentication':'succeeded'});
        return next();
    }
    res.redirect('/authentication-failed');
}

module.exports = {
    isAuthenticated
};