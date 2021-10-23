const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = {
  // 返回错误信息的格式
  ResponseFail(satatusCode, message) {
    return {
      code: satatusCode,
      message,
      success: false,
    };
  },
  // 返回成功信息的格式
  ResponseSuccess(message, data) {
    const responseBody = { code: 200, message, success: true };
    data && Object.assign(responseBody, { data: data });
    return responseBody;
  },
  // 封装的发送错误信息处理函数
  EmitError(error, ctx) {
    ctx.app.emit("error", error, ctx);
  },
  // 生成token
  generateToken(payload) {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expireTime,
    });
  },
  // 认证出现错误的回调函数
  unAuthHandler(ctx, next) {
    return next().catch((err) => {
      if (err.status === 401) {
        ctx.status = 401;
        const errMsg = err.originalError
          ? err.originalError.message
          : err.message;
        console.log(errMsg);
        let message = "";

        if (errMsg === "jwt expired") {
          message = "token已过期";
        } else {
          message = "无效的token";
        }

        ctx.body = {
          code: 401,
          message,
        };
      } else {
        throw err;
      }
    });
  },
};
