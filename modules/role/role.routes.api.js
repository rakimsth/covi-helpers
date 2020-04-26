const router = require("express").Router();
const RoleController = require("./role.controller");
const { SecureAPI } = require("../../utils/secure");
const { ERR, PM } = require("../../utils");

router.get("/", async (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  RoleController.listRoles({
    limit,
    start,
    search: req.query.search.value ? req.query.search.value : null
  })
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.post("/", (req, res, next) => {
  RoleController.add(req.body)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.post("/permission", (req, res, next) => {
  RoleController.addPermission({
    name: req.body.name,
    permissions: req.body.permissions
  })
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.delete("/:name", (req, res, next) => {
  RoleController.remove(req.params.name)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.get("/:name/permissions", async (req, res, next) => {
  try {
    let permissions = await RoleController.calculatePermissions(req.params.name);
    let data = [];
    data = [...permissions];
    let total = data.length;
    data = data.map(d => {
      return {
        permissions: d
      };
    });
    res.json({ data, total });
  } catch (e) {
    next(e);
  }
});

router.post("/:name/permissions", (req, res, next) => {
  RoleController.removePermission({ name: req.params.name, permission: req.body.permission })
    .then(d => res.json(d))
    .catch(e => next(e));
});

module.exports = router;
