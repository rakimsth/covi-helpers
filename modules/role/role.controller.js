const mongoose = require("mongoose");
const { RoleManager } = require("rs-user");
const config = require("config");
const { DataUtils, TextUtils, Error, ERR } = require("../../utils");

class RoleController extends RoleManager {
  async listRoles({ limit, start, search }) {
    let filter = {};
    if (search)
      filter.name = {
        $regex: new RegExp(TextUtils.escapeRegex(search), "gi")
      };
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: this.model,
      query: [
        {
          $match: filter
        },
        {
          $project: {
            name: 1,
            permissions: 1,
            expiry_date: 1,
            is_system: 1
          }
        }
      ]
    });
  }

  async listAvailablePermissions({ name, start, limit }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: this.model,
      query: [
        {
          $match: {
            name
          }
        },
        {
          $project: {
            permissions: 1,
            _id: 0
          }
        },
        {
          $unwind: "$permissions"
        },
        { $group: { _id: null, permissions: { $addToSet: "$permissions" } } }
      ]
    });
  }
}

module.exports = new RoleController({
  mongoose
});
