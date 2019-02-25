const express = require("express");
const router  = express.Router({mergeParams: true});
const Bike =require("../models/bike");
const Comment = require("../models/comment");
const middleware = require("../middleware/index.js");

router.get('/new', middleware.isLoggedIn, (req,res)=>{
    Bike.findById(req.params.id, (err, bike)=>{
        if (err){
            console.log(err)
        } else {
            res.render("comments/new", {bike: bike})
        }
    })
    
});

router.post('/', middleware.isLoggedIn, (req, res)=>{
    Bike.findById(req.params.id, (err, bike)=>{
        if (err) {
            console.log(err);
            res.redirect('/bikes')
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username =req.user.username;
                    comment.save();
                    bike.comments.push(comment);
                    bike.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect('/bikes/' + bike._id)
                }
            })
        }
    })
})

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if (err){
            res.redirect("back")
        } else {
            res.render("comments/edit", {bike_id: req.params.id, comment: foundComment})
        }
    })
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if (err){
            res.redirect("back")
        } else {
            res.redirect("/bikes/"+ req.params.id)
        }
    })
});


router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if (err){
            res.redirect('back')
        } else {
            req.flash("success", "Comment deleted")
            res.redirect('/bikes/' + req.params.id);
        }
    })
})




module.exports = router;