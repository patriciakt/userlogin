//create one auth middlware function to check if user is in session
//if user not in session --> redirect to login
//if in session --> proceed

//check if logged in
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/login");
  }
  next();
};

const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

//second middleware function - check if user is not logged in
//in terms of accessing/viewing pages

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
