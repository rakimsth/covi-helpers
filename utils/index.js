const { Error, ERR } = require("./error");
const { PM, Permissions } = require("./permissions");
const { DataUtils } = require("./data");
const TextUtils = {
  pascalToCamelCase: s =>
    s.replace(/\.?([A-Z])/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, ""),
  escapeRegex: text => text.replace(/[-[\]{}()*=?.,\\^$|#\s]/g, "\\$&"),
  randomText: length => {
    return Math.random()
      .toString(36)
      .slice(-8);
  }
};

module.exports = {
  TextUtils,
  DataUtils,
  Error,
  ERR,
  PM,
  Permissions
};
