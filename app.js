const express = require("express");
const app = express();
const port = 3000 || process.env.port;
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport");

require("./config/passport")(passport);

mongoose.connect("mongodb://localhost:27017/passport" , {useNewUrlParser : true})
.then(() => console.log("connected to mongodb"))
.catch(err => console.log("error is" , err));
// EJS
app.use(expressLayouts);
app.set("view engine" , "ejs");

//Bodyparser

app.use(express.urlencoded({extended : false}));

//expresssession middelware
app.use(session({
    secret : "secret",
    resave : true,
    saveUninitialized : true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// global vars
app.use((req , res , next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//routes 
app.use("/" , require('./routes/index.js'));
app.use("/users", require('./routes/users.js'));

app.listen(port , () =>{
    console.log(`server started at port ${port}`)
})
