const router = require("express").Router();
const { SecureUI } = require("../utils/secure");
const AuthRouter = require("./ui.routes.auth");
const RoleRouter = require("../modules/role/role.routes.ui");
const RequestRouter = require("../modules/request/request.routes.ui");
const ReqController = require("../modules/request/request.controller").controller;
const SettingController = require("../modules/setting/setting.controller");
const UserRouter = require("../modules/user/user.routes.ui");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let requestData = await ReqController.getByType("request");
  let helpData = await ReqController.getByType("help");
  let requests = [];
  let helps = [];
  for (let d of requestData) {
    requests.push(d.mapdata);
  }
  for (let d of helpData) {
    helps.push(d.mapdata);
  }
  let dataA = {
    type: "FeatureCollection",
    features: requests
  };
  let dataB = {
    type: "FeatureCollection",
    features: helps
  };
  res.render("map/index", { title: "Home Page", dataA, dataB });
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
router.use("/requests", RequestRouter);
router.use("/users", UserRouter);
router.use("/roles", RoleRouter);

module.exports = router;
