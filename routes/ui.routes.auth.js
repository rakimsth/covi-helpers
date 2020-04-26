const passport = require("passport");
const router = require("express").Router();
const UserController = require("../modules/user/user.controller");

router.get("/login", (req, res, next) => {
  res.render("login", { title: "Login" });
});

router.post("/login_process", async (req, res, next) => {
  try {
    let user = await UserController.login(req.body);
    let tokenData = await UserController.validateToken(user.token);
    res.cookie("access_token", user.token);
    res.cookie("user", JSON.stringify(user));
    res.cookie("permissions", JSON.stringify(tokenData.data.permissions));
    res.json(user);
  } catch (e) {
    next(e);
  }
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("user");
  res.clearCookie("redirect_url");
  res.clearCookie("permissions");
  res.redirect("/login");
});

router.get("/register", (req, res, next) => {
  res.render("register", { title: "Register" });
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  }),
  (req, res, next) => {}
);

router.get("/auth/facebook/callback", async (req, res, next) => {
  passport.authenticate("facebook", async (err, user) => {
    let redirect_url = req.cookies.redirect_url;
    let tokenData = await UserController.validateToken(user.token);
    res.cookie("access_token", user.token);
    res.cookie("user", JSON.stringify(user));
    res.cookie("permissions", JSON.stringify(tokenData.data.permissions));
    if (redirect_url) res.redirect(redirect_url);
    else res.redirect("/");
  })(req, res, next);
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    userProperty: { test: 333 }
  })
);

router.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user) => {
    console.log(user);
    let tokenData = await UserController.validateToken(user.token);
    let redirect_url = req.cookies.redirect_url;
    res.cookie("access_token", user.token);
    res.cookie("user", JSON.stringify(user));
    res.cookie("permissions", JSON.stringify(tokenData.data.permissions));
    if (redirect_url) res.redirect(redirect_url);
    else res.redirect("/");
  })(req, res, next);
});

module.exports = router;
