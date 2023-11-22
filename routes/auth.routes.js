const { Router } = require("express");
const router = new Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const mongoose = require("mongoose");
const User = require("../models/User.model");

const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard");

//SSSSSSSIGNUP ROUTES
router.get("/signup", (req, res) => res.render("auth/signup"));
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;


  // //if condition to check if user filled out all mandatory fields

  if (!username || !email || !password) {
    res.render("auth/signup", {
      errorMessage: "you better fill out all fields",
    });
    return;
  }

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
    });

});

  // close .catch()
}); // close .post()


///LLLLLOGIN ROUTESSS///

router.get("/login", (req, res) => res.render("auth/login"));
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
        req.session.currentUser = user;
        //console.log("User ID:", userId);

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

//MMMMAP/PROFILE ROUTES
router.get("/userProfile", isLoggedIn, (req, res) =>
  res.render("users/user-profile", { userInSession: req.session.currentUser })
);

router.get("/userPage", isLoggedIn, (req, res) => {
  console.log(req.session.currentUser.userInfo[0].returnedCity);
  res.render("users/user-page", {
    userInSession: req.session.currentUser,
    userInfoArray: req.session.currentUser.userInfo[0],
  });
});
//UUUPDATE ROUTESSSSS

// router.post("/updateUserInfo", isLoggedIn, (req, res) => {
//   const userId = req.session.currentUser._id;
//   const { returnedCity, returnedCity2, returnedCity3, test } = req.body;
//   console.log(userId);
//   console.log(returnedCity, returnedCity2, returnedCity3, test);
// });

router.post("/updateUserInfo", isLoggedIn, async (req, res) => {
  console.log(req.body);
  console.log("CURRENT USER =>", req.session.currentUser);
  try {
    const userId = req.session.currentUser._id;
    const { returnedCity, returnedCity2, returnedCity3 } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send(" user not found ");
    }
    user.userInfo.push({
      returnedCity: returnedCity,
      returnedCity2: returnedCity2,
      returnedCity3: returnedCity3,
    });

    await user.save();
    // req.session.currentUser = {
    //   ...req.session.currentUser,
    //   ...req.body,
    // };

    req.session.currentUser = await User.findById(userId);
    req.session.save();
    return res.redirect("/userPage");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// router.get("/updateUserInfo", isLoggedIn, async (req, res) => {
//   try {
//     const userId = req.session.currentUser._id;
//     const user = await User.findById(userId);

//     console.log("THIS IS THE USER =>", user);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.render("users/user-page", { userInSession: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

/// GETNEWCITY ROUTES OH MY GOD WHEN IT WILL END

//LLLLLOGOUT route

//LOGOUT route

router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
