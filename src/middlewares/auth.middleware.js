const { EmitError, ResponseFail } = require("../common/utils");

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


module.exports = {
  adminPermission,
}