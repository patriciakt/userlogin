require("dotenv").config();
require("./db");

const express = require("express");
const hbs = require("hbs");
const app = express();

//use session here
require("./config/session.config")(app);
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "userauth";

app.use(express.static("public"));

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// routes are here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

const postRoutes = require("./routes/post.routes");
app.use("/", postRoutes);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.delete("/deletePost", (req, res) => {
  const postIdToDelete = req.body.posts._id;
});

// for errors in login
require("./error-handling")(app);

module.exports = app;
