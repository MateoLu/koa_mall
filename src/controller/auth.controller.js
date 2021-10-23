const { Controller, Post, Middlewares, Patch } = require("../common/decorator");
const {
  userFormValidator,
  verifyUser,
  cryptPassword,
  verifyLogin,
} = require("../middlewares/user.middleware");
const userService = require("../service/user.service");
const {
  ResponseSuccess,
  ResponseFail,
  EmitError,
  generateToken,
} = require("../common/utils");

@Controller("/auth")
class AuthController {
  @Post("/regist")
  @Middlewares([userFormValidator, verifyUser, cryptPassword])
  async register(ctx) {
    try {
      const { username, password, is_admin } = ctx.request.body;
      const user = await userService.create({ username, password, is_admin });
      ctx.body = ResponseSuccess("注册成功");
    } catch (error) {
      EmitError(ResponseFail(400, "用户注册出现错误"), ctx);
    }
  }

  @Post("/login")
  @Middlewares([userFormValidator, verifyLogin])
  async login(ctx) {
    try {
      const { username } = ctx.request.body;
      const { password, ...result } = await userService.getUserInfo({
        username,
      });
      // 生成 token
      const token = generateToken(result);

      ctx.body = ResponseSuccess("登陆成功", { access_token: token });
    } catch (error) {
      EmitError(ResponseFail(500, error.message), ctx);
    }
  }

  @Patch("/password")
  @Middlewares([cryptPassword])
  async modifyPassword(ctx) {
    try {
      const id = ctx.state.user.id;
      const password = ctx.request.body.password;
      
      const modifyCount = await userService.updateById({ id, password });
      if (modifyCount > 0) {
        ctx.body = ResponseSuccess("修改密码成功");
      } else {
        EmitError(ResponseFail(400, "修改密码失败"), ctx);
      }
    } catch (error) {
      EmitError(ResponseFail(500, "修改密码出现异常"), ctx);
    }
  }
}

module.exports = AuthController;
