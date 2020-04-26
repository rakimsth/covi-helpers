const router = require("express").Router();
const RoleController = require("./role.controller");
const { Permissions } = require("../../utils");

router.get("/", (req, res, next) => {
  res.render("user/roles", {
    title: "Role Manager"
  });
});

module.exports = router;
