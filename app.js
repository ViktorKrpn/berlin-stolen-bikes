const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Bike = require("./models/bike");
const Comment = require("./models/comment");
const User = require("./models/user");
const commentRoutes = require("./routes/comments");
const bikeRoutes = require("./routes/bikes"); 
const indexRoutes = require("./routes/index"); 
const methodOverride = require("method-override");
const flash = require("connect-flash")

// var seedDB = require("./seeds");

// seedDB();
app.use(flash());
mongoose.connect("mongodb://localhost/berlin_stolen_bikes", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


//Passport configuration
app.use(require("express-session")({
    secret: "This is berlin stolen bikes website",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error")
   res.locals.success = req.flash("success")
   next();
});

app.use("/", indexRoutes);
app.use("/bikes", bikeRoutes);
app.use("/bikes/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, ()=>{
    console.log("Berlin Stolen Bikes Server has started");
})