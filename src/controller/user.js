const { Controller, Get } = require("../common/decorator/index");
const userService = require("../service/user");
const {
  userFormValidator,
  verifyUser,
} = require("../middlewares/user.middleware");
const { ResponseSuccess, ResponseFail } = require("../common/utils");

@Controller("/users")
class UserController {
  @Get()
  async findAll(ctx) {
    try {
      const users = await userService.findAll();
      ctx.body = ResponseSuccess("查询成功", users);
    } catch (error) {
      ctx.app.emit('error', ResponseFail(400, '查询出现错误'), ctx);
    }
  }
}

module.exports = UserController;
