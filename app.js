// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

//use session here
require("./config/session.config")(app);
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "userauth";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// routes are here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

const mapRoutes = require("./routes/map.routes");
app.use("/user-profile", mapRoutes);

//new file for map or in profile after login

// for errors in login
require("./error-handling")(app);

module.exports = app;
