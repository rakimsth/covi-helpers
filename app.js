const mongoose = require("mongoose");
const config = require("config");
const helmet = require("helmet");
const cors = require("cors");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var routeManager = require("./routes");
var app = express();

if (config.has("app.enableSocial")) {
  if (config.get("app.enableSocial")) {
    const passport = require("passport");
    app.use(passport.initialize());
  }
}
mongoose.connect(config.get("db.url"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// view engine setup
app.use(helmet());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routeManager);

// Add headers for external use
app.use(cors());

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  if (req.headers["content-type"] == "application/json") {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
  } else {
    res.status(404).render("misc/404", {
      title: "Not Found",
      status: 404,
      url: req.url
    });
  }
});

/*
development error handler
will print stacktrace
*/

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      success: false,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
