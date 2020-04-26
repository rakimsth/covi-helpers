const config = require("config");
class RSError extends Error {
  constructor(message, name, httpCode) {
    super();
    this.message = message;
    this.data = {
      group: config.get("app.name"),
      type: "rserror",
      message: message,
      name: name || "none",
      httpCode: httpCode || 500
    };
    this.status = httpCode || 500;
    this.className = this.constructor.name;
    this.stack = new Error(message).stack;
  }
}

const ERR = {
  DEFAULT: new RSError("Error Occured", "none", 500),
  AUTH_FAIL: new RSError("Authentication failed. Please try again.", "auth_fail", 401),
  DATE_FUTURE: new RSError("Date is in future", "date_future", 400),
  PWD_SAME: new RSError("Please send different new password", "pwd_same", 400),
  PWD_NOTMATCH: new RSError("Old password does not match.", "pwd_notmatch", 400),
  TOKON_REQ: new RSError("Must send access_token", "token_req", 400),
  USER_NOEXISTS: new RSError("User does not exists.", "user_noexists", 400)
  //DEFAULT: new RSError('', '', 400),
};

const throwError = err => {
  throw err;
};
module.exports = { Error: RSError, ERR, throwError };
