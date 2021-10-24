const jwt = require('jsonwebtoken');
const { EmitError, ResponseFail } = require("../common/utils");
const config = require('../common/config');

/**
 * 判断用户是否有管理员权限
 */
const adminPermission = async (ctx, next) => {
  const is_admin = ctx.state.user?.is_admin;

  if (!is_admin) {
    EmitError(ResponseFail(403, '没有管理员权限'), ctx);
    return
  }

  await next();
}

const auth = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  // console.log(token)

  try {
    // user中包含了payload的信息(id, user_name, is_admin)
    const user = jwt.verify(token, config.jwt.secret);
    ctx.state.user = user
  } catch (err) {
    switch (err.name) {
      case 'TokenExpiredError':
        return EmitError(ResponseFail(401, 'token已过期'), ctx);
      case 'JsonWebTokenError':
        return EmitError(ResponseFail(401, '用户认证失败'), ctx);
    }
  }

  await next()
}


module.exports = {
  adminPermission,
  auth
}