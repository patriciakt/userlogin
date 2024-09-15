const { Router } = require("express");
const router = new Router();

const User = require("../models/User.model");
const Post = require("../models/Post.model");

const fileUploader = require("../config/cloudinary.config");

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

router.post(
  "/create-post/",
  isLoggedIn,
  fileUploader.single("travel-images"),
  (req, res, next) => {
    console.log(req.body);
    const { title, text, lat, lng } = req.body;
    const userId = req.session.currentUser._id;

    Post.create({
      title,
      text,

      imageUrl: req.file.path,
      latitude: lat,
      longitude: lng,
      user: userId,
    })
      .then((newPost) => {
        console.log(newPost);
        // wait start
        User.findById(userId)
          .then((user) => {
            user.posts.push(newPost._id.toString());
            user.save();
          })
          .catch(() => {
            console.log("Error");
          });
      })
      .then(() => {
        res.redirect("/userPage");
      })
      .catch((error) => next);
  }
);

//DELETE POST
router.post("/delete-post/:postId", (req, res, next) => {
  const { postId } = req.params;

  Post.findByIdAndDelete(postId)
    .then(() => res.redirect("/userPage"))
    .catch((error) => next(error));
});

module.exports = router;
