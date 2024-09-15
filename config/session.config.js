const session = require("express-session");

const MongoStore = require("connect-mongo");

const mongoose = require("mongoose");

module.exports = (app) => {
  //required for app when deployed to Heroku
  app.set("trust proxy", 1);

  //use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 3600000, // 1hour
      },
      store: MongoStore.create({
        mongoUrl:
          process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/map-menace",
      }),
    })
  );
};
