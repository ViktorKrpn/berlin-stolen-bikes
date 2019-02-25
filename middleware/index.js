const Bike = require("../models/bike");
const Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkBikeOwnership = (req, res, next)=>  {
 if(req.isAuthenticated()){
        Bike.findById(req.params.id, (err, foundBike)=>{
           if(err){
               req.flash("error", "Bike not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundBike.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next)=> {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
           if(err){
               res.redirect("back");
           }  else {
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that")
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in")
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in")
    res.redirect("/login");
}

module.exports = middlewareObj;
