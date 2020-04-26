const router = require("express").Router();

router.get("/add", (req, res, next) => {
  res.render("request/add", { title: "Add Request" });
});

router.get("/help", (req, res, next) => {
  res.render("request/help", { title: "Add Help" });
});

module.exports = router;
