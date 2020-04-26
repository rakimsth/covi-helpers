const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const config = require("config");
const { UserManager, Utils } = require("rs-user");

const { TextUtils, DataUtils, ERR } = require("../../utils");
const messenger = require("../../utils/messenger");
const RoleController = require("../role/role.controller");

const createTokenData = async user => {
  let permissions = await RoleController.calculatePermissions(user.roles);
  return {
    permissions
  };
};

class UserController extends UserManager {
  login({ username, password, rememberMe = false }) {
    return this.authenticate({
      username,
      password,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration")
    });
  }

  loginExternal({ service, service_id, extras }) {
    return this.authenticateExternal({
      service,
      service_id,
      tokenData: createTokenData,
      jwtDuration: config.get("jwt.duration"),
      extras
    });
  }

  async addRoles({ user_id, roles }) {
    let isValid = await RoleController.isValidRole(roles);
    if (!isValid) throw ERR.ROLES_NOEXISTS;
    return super.addRoles({ user_id, roles });
  }

  list({ start, limit }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { "name.first": 1 },
      model: this.models.UserModel,
      query: [],
      facet_data: [
        {
          $lookup: {
            from: "users_comm",
            localField: "comms",
            foreignField: "_id",
            as: "comms"
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            full_name: { $concat: ["$name.first", " ", "$name.last"] },
            comms: {
              $filter: {
                input: "$comms",
                as: "item",
                cond: {
                  $eq: ["$$item.is_primary", true]
                }
              }
            },
            is_active: 1,
            created_at: 1,
            updated_at: 1
          }
        }
      ]
    });
  }
}

module.exports = new UserController({
  mongoose,
  messenger,
  appSecret: config.get("app.secret"),
  jwtDuration: config.get("jwt.duration"),
  modelConfig: {
    User: {
      schema: {
        gender: String,
        dob: Date
      }
    }
  }
});
