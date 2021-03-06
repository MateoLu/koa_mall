const { Controller, Get, Middlewares } = require("../common/decorator/index");
const userService = require("../service/user.service");
const { ResponseSuccess, ResponseFail, EmitError } = require("../common/utils");
const { auth } = require("../middlewares");

/**
 * 用户管理控制层
 */
@Controller("/users")
class UserController {
  @Get()
  @Middlewares([auth])
  async findAll(ctx) {
    try {
      const users = await userService.findAll();
      ctx.body = ResponseSuccess("查询成功", users);
    } catch (error) {
      EmitError(ResponseFail(400, "查询出现错误"), ctx);
    }
  }
}

module.exports = UserController;
