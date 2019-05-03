module.exports = {
    ensureAuthenticated : function(req , res , next){
        if(req.isAuthenticated()){
            return next();
        }

        req.flash("error_msg" , "You need to login to view this resource");
        res.redirect("/users/login");
    }
}