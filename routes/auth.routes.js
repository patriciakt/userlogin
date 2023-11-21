const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const mongoose = require("mongoose");

//require/import User model
const User = require("../models/User.model");

//require auth middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

//GET route --> display signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

//POST route --> process form data
router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  //if condition to check if user filled out all mandatory fields
  if (!username || !email || !password) {
    res.render("auth/signup", { errorMessage: "fill out all fields,silly" });
    return;
  }

  //make sure of strong passwords
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
      errorMessage:
        "strong password is easy: at least one number, one lowercase and one uppercase letter",
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      res.redirect("/userProfile");
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(" only unique email and username. try new one. ");

        res.status(500).render("auth/signup", {
          errorMessage:
            "user not found and/or incorrect password. did you sleep well tonight, bro?",
        });
      } else {
        next(error);
      }
    }); // close .catch()
}); // close .post()

///LOGIN///

//get route to display login form
router.get("/login", (req, res) => res.render("auth/login"));

//post login route
router.post("/login", (req, res, next) => {
  console.log("SESSION ===>", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "enter both, ok?",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("Email not registered. ");
        res.render("auth/login", {
          errorMessage:
            "user not found and/or incorrect password. did you sleep well tonight, bro?",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        //saving user in session
        req.session.currentUser = user;
        res.redirect("/userProfile");
      } else {
        console.log("Incorrect password. ");
        res.render("auth/login", {
          errorMessage:
            "user not found and/or incorrect password. did you sleep well tonight, bro?",
        });
      }
    })
    .catch((error) => next(error));
});

//GET user profile display
router.get("/userProfile", isLoggedIn, (req, res) =>
  res.render("users/user-profile", { userInSession: req.session.currentUser })
);

module.exports = router;

//LOGOUT route
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
