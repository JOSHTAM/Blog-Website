const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

const homeStartingContent = "Hello, my name is Joshua and Welcome to my Programming Journal! 😎 This is simply a mini project that I created when I first began Web Developement. I strongly recommend beginners to Web Development, to challenge themselves by building their first blog website. That will make sure that the website doesn't go to waste as you will be able to log your learnings and progress along the way, as well as continue building and implementing new stuff to the website! Feel free to follow my journey! Cheers.";
const aboutContent = "Hi this is the about page.";
const contactContent = "Hi this is the contact details page.";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');


mongoose.connect("mongodb+srv://admin-joshua:Test123@cluster0-y2p1s.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});
const postSchema = {
  title: String,
  content: String
};
// By creating our model, MongoDB automatically creates a collection
// named after the plural of Post -> 'posts' is created
const Post = mongoose.model("Post", postSchema);


// Here is the displays for the main landing page of our website
app.get("/", function(req, res) {
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  // Pass in Options JSON to format the date
  var day = today.toLocaleDateString("en-US", options);

  Post.find({}, function(err, posts) {
    res.render("home", {startingContent: homeStartingContent, kindOfDay: day, posts: posts});
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {
  // Need a constant to store the postId parameter value
  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
