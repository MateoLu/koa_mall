const userService = require("../service/user");
const { ResponseFail } = require("../common/utils");

/**
 * 检查前端输入的表单是否为空
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
const userFormValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.app.emit("error", ResponseFail(400, "用户名或密码为空"), ctx);
    return;
  }
  await next();
};

/**
 * 检查用户是否已存在
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
const verifyUser = async (ctx, next) => {
  try {
    const { username } = ctx.request.body;
    const user = await userService.getUserInfo({ username });
    if (user) {
      ctx.app.emit("error", ResponseFail(409, "用户已存在"), ctx);
      return;
    }
    await next();
  } catch (error) {
    ctx.app.emit("error", ResponseFail(400, "用户注册出现错误"), ctx);
  }
};

module.exports = {
  userFormValidator,
  verifyUser,
};
