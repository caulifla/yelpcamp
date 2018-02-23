var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var seedDB = require("./seeds");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

mongoose.connect('mongodb://localhost/camp_base_1');

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err) console.log(err);
        else res.render("index", {campgrounds: campgrounds});
    })
});

app.post("/campgrounds", function(req, res){
    if (!(req.body.name === '' || req.body.image === '')) {
        Campground.create({name: req.body.name, image: req.body.image, info: req.body.info}, function(err, campground) {
            if(err) console.log(err);
            else res.redirect("campgrounds");
        });
    }
    else res.redirect("campgrounds");
})

app.post("/campgrounds/:id", function(req, res){
    if (!(req.body.user === '' || req.body.comment === '')) {
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if(err) console.log(err);
            else {
                Comment.create(
                {
                    text: req.body.comment,
                    author:req.body.user
                }, function(err, comment){
                    if(err){
                        console.log(err);
                    } else {
                        foundCampground.comments.push(comment._id);
                        foundCampground.save();
                    }
                });
                res.redirect(req.get('referer'));
            }
        });
    }
    else console.log("somethin wrong");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) console.log(err);
        else res.render("show", {campground: foundCampground});
    });
});

app.listen(process.env.PORT|1212, process.env.IP, function(){
 console.log("YelpCamp is online!") 
});