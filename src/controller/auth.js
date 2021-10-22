const { Controller, Post, Middlewares } = require("../common/decorator");
const {
  userFormValidator,
  verifyUser,
} = require("../middlewares/user.middleware");
const userService = require("../service/user");
const { ResponseSuccess, ResponseFail } = require('../common/utils')

@Controller("/auth")
class AuthController {
  @Post("/regist")
  @Middlewares([userFormValidator, verifyUser])
  async register(ctx) {
    try {
      const { username, password, is_admin } = ctx.request.body;
      const user = await userService.create({ username, password, is_admin });
      ctx.body = ResponseSuccess("注册成功");
    } catch (error) {
      ctx.app.emit('error', ResponseFail(400, '用户注册出现错误'), ctx);
    }
  }
}

module.exports = AuthController;
