const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");

//require auth middleware
const { isLoggedIn } = require("../middleware/route-guard");

//GET post form
router.get("/create-post", isLoggedIn, (req, res) => {
  const { lat, lng } = req.query;
  res.render("users/create-post", {
    userInSession: req.session.currentUser,
    coordinates: { lat, lng },
  });
});

//POST blog post
router.post("/create-post/", isLoggedIn, (req, res, next) => {
  console.log(req.body);
  const { title, text, latitude, longitude } = req.body;
  const userId = req.session.currentUser._id;

  Post.create({
    title,
    text,
    latitude,
    longitude,
    user: userId,
  })
    .then((newPost) => {
      return User.findByIdAndUpdate(userId, { $push: { posts: newPost } });
    })
    .then(() => {
      console.log("post saved!!");
      res.redirect("/userPage");
    })
    .catch((error) => next);
});

//DELETE POST
router.post("/delete-post/:postId", (req, res, next) => {
  const { postId } = req.params;

  Post.findByIdAndDelete(postId)
    .then(() => res.redirect("/userPage"))
    .catch((error) => next(error));
});

module.exports = router;
