const router = require("express").Router();

const { PM } = require("../../utils");
const { SecureAPI } = require("../../utils/secure");
const SettingController = require("./setting.controller");

router.get("/permissions", SecureAPI(PM.SETTINGS_READ), (q, r, n) => {
  try {
    let perm = Object.values(PM);
    r.json(perm);
  } catch (e) {
    n(e);
  }
});

module.exports = router;
