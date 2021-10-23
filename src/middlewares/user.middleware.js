const bcrypt = require("bcryptjs");
const userService = require("../service/user.service");
const { ResponseFail, EmitError } = require("../common/utils");

/**
 * 检查前端输入的表单是否为空
 * @param {*} ctx
 * @param {*} next
 * @returns
 */
const userFormValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    EmitError(ResponseFail(400, "用户名或密码为空"), ctx);
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
      EmitError(ResponseFail(409, "用户已存在"), ctx);
      return;
    }
    await next();
  } catch (error) {
    EmitError(ResponseFail(500, "用户注册出现错误"), ctx);
  }
};

/**
 * 密码加密中间件
 */
const cryptPassword = async (ctx, next) => {
  // 获取明文密码
  const { password } = ctx.request.body;
  if(!password) {
    EmitError(ResponseFail(400, "密码为空"), ctx);
    return;
  }
  // 盐
  const salt = bcrypt.genSaltSync(10);
  // 密文密码
  const hashPassword = bcrypt.hashSync(password, salt);

  ctx.request.body.password = hashPassword;

  await next();
};

/**
 * 验证登陆中间件
 * @param {*} ctx
 * @param {*} next
 */
const verifyLogin = async (ctx, next) => {
  try {
    const { username, password } = ctx.request.body;
    // 1. 验证用户名和密码是否正确
    const user = await userService.getUserInfo({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      EmitError(ResponseFail(400, '用户名或密码错误'), ctx);
      return;
    }

    await next();
  } catch (error) {
    EmitError(ResponseFail(500, error.message), ctx);
  }
};

module.exports = {
  userFormValidator,
  verifyUser,
  cryptPassword,
  verifyLogin
};
