const express = require("express");
const router  = express.Router();
const passport = require("passport");
const User = require("../models/user")

router.get("/", (req, res)=>{
    res.render("landing");
});

router.get('/register', (req, res)=>{
    res.render('register')
})

router.post('/register', (req, res)=>{
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message)
            return res.render('register')
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to Berlin Stolen Bikes Website " + user.username)
            res.redirect('/bikes')
        })
    })
})


router.get('/login', (req, res)=>{
    res.render('login')
})


router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/bikes",
        failureRedirect: "/login"
    }), function(req, res){
});


router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!")
   res.redirect("/bikes");
});


module.exports = router;