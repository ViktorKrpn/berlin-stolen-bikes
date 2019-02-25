const express = require("express");
const router  = express.Router();
const Bike =require("../models/bike");
const middleware = require("../middleware/index.js")


router.get("/", (req, res)=>{
    Bike.find({}, (err, allBikes)=>{
        if (err){
            console.log(err)
        } else {
            res.render('bikes/index', {bikes: allBikes, currentUser: req.user});
        }
    })
    
});

router.post("/", middleware.isLoggedIn, (req, res)=>{
   var name = req.body.name;
   var image = req.body.image;
   var desc = req.body.description
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newBike = {name: name, image: image, description: desc, author:author};
   Bike.create(newBike, (err, newlyCreated)=>{
       if (err){
           console.log(err)
       } else {
           res.redirect('/bikes')
       }
   })
   
})

router.get('/new', middleware.isLoggedIn, (req, res)=>{
    res.render('bikes/new')
})


//Show route
router.get('/:id', (req, res)=>{
    Bike.findById(req.params.id).populate("comments").exec((err, foundBike)=>{
        if(err){
            console.log(err)
        } else {
            res.render('bikes/show', {bike: foundBike});
        }
    });
});

//Edit
router.get("/:id/edit", middleware.checkBikeOwnership, (req,res)=>{
        Bike.findById(req.params.id, (err, foundBike)=>{
        res.render("bikes/edit", {bike: foundBike})
        })
})

//Update
router.put('/:id', middleware.checkBikeOwnership, (req,res)=>{
    var data = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    Bike.findByIdAndUpdate(req.params.id, data, (err, updatedBike)=>{
        if (err){
            res.redirect('/bikes')
        } else {
            res.redirect('/bikes/' + req.params.id)
            
        }
    })
})

//Destroy
router.delete('/:id', middleware.checkBikeOwnership, (req, res)=>{
    Bike.findByIdAndRemove(req.params.id, (err)=>{
        if (err){
            res.redirect('/bikes')
        } else {
            res.redirect('/bikes')
        }
    })
})



module.exports = router;
