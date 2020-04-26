const router = require("express").Router();
const { SecureUI } = require("../utils/secure");
const AuthRouter = require("./ui.routes.auth");
const RoleRouter = require("../modules/role/role.routes.ui");
const SettingController = require("../modules/setting/setting.controller");
const UserRouter = require("../modules/user/user.routes.ui");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("map/index", { title: "Home Page" });
});

router.get("/cms", SecureUI(), (req, res, next) => {
  res.render("index", { title: "My Dashboard" });
});

router.get("/app", async (req, res, next) => {
  let settings = await SettingController.get();
  res.render("app", {
    settings
  });
});

router.get("/settings", SecureUI(), (req, res, next) => {
  res.render("misc/settings", { title: "Settings" });
});

router.use("/", AuthRouter);
router.use("/users", UserRouter);
router.use("/roles", RoleRouter);

module.exports = router;
