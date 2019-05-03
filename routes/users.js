const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Welcome Page
router.get('/login', (req, res) =>{ 
    res.render('login')
});

router.get('/register', (req, res) =>{ 
    res.render('register')
});

//register handel
router.post("/register" , (req , res)=>{
    const {name , email , password , password2} = req.body;
    let errors = [];
    if(!name || !email || !password || !password2){
        errors.push({msg : "please fill in all fields"});
    }
    if(password != password2){
        errors.push({msg : "passwords do not match"});
    }
    if(password.length<=6){
        errors.push({msg : "password should be atleast 6 character long"});

    }

    if(errors.lenght > 0){
        console.log(errors)
        res.render('register' , {
            errors,
            name,
            email,
            password,
            password2
        });
    }else {
        User.findOne({email : email})
        .then((user) => {
            if(user){
                errors.push({msg : "email has already been registered"})
                res.render('register' , {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newUser = new User({
                    name,
                    email,
                    password,
                });
                bcrypt.genSalt(10 , (err , salt) => {
                    bcrypt.hash(newUser.password , salt , (err , hash)=>{
                        if(err) throw err;

                        newUser.password = hash;

                        newUser.save().then((user) =>{ 
                            req.flash('success_msg' , "you are now registered and can login")
                            res.redirect("/users/login");
                        })
                        .catch((err) => console.log(err));
                    });
                });
            }
        });
    }

}); 

router.post("/login" , (req,res , next) => {
    passport.authenticate("local" , {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req , res , next);
});

router.get("/logout" , (req , res) => {
    req.logout();
    req.flash("success_msg" , "logged out successfully");
    res.redirect("/users/login");
});

module.exports = router;