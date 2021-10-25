const {
  Controller,
  Post,
  Middlewares,
  Get,
  Patch,
  Delete,
} = require("../common/decorator");
const { ResponseSuccess, EmitError, ResponseFail } = require("../common/utils");
const { validator, auth } = require("../middlewares");
const orderService = require("../service/order.service");

/**
 * 订单控制层
 */
@Controller("/orders")
class OrderController {
  /**
   * 生成订单
   * @param {*} ctx
   */
  @Post()
  @Middlewares([
    auth,
    validator({
      addressId: "int",
      goodsInfo: "string",
      total: "string",
    }),
  ])
  async create(ctx) {
    try {
      const uid = ctx.state.user.id;
      const { addressId, goodsInfo, total } = ctx.request.body;
      const orderNumber = "LLW" + Date.now();
      const res = await orderService.createOrder({
        userId: uid,
        addressId,
        goodsInfo,
        total,
        orderNumber,
      });

      ctx.body = ResponseSuccess("生成订单成功", res);
    } catch (error) {
      EmitError(ResponseFail(500, "生成订单出现异常"), ctx);
    }
  }

  /**
   * 获取订单列表
   */
  @Get()
  @Middlewares([auth])
  async findAll(ctx) {
    try {
      const { pageNum = 1, pageSize = 10, status = 0 } = ctx.request.query;
      const res = await orderService.findOrders(pageNum, pageSize, status);
      ctx.body = ResponseSuccess("获取订单列表成功", res);
    } catch (error) {
      EmitError(ResponseFail(500, "获取订单列表出现异常"), ctx);
    }
  }

  /**
   * 修改订单状态接口
   */
  @Patch("/:id")
  @Middlewares([auth, validator({ status: "number" })])
  async update(ctx) {
    try {
      const id = ctx.request.params.id;
      const status = ctx.request.body.status;
      const res = await orderService.updateOrderStatus(id, status);
      if (!res) {
        EmitError(ResponseFail(400, "更新订单状态出错"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("更新订单状态成功");
    } catch (error) {
      EmitError(ResponseFail(500, "更新订单状态出现异常"), ctx);
    }
  }

  /**
   * 删除订单接口
   */
  @Delete("/:orderNumber")
  @Middlewares([auth])
  async remove(ctx) {
    try {
      const orderNumber = ctx.params.orderNumber;
      const res = await orderService.removeOrder(orderNumber);
      if (!res) return EmitError(ResponseFail(400, "不存在该订单"), ctx);
      ctx.body = ResponseSuccess("删除订单成功");
    } catch (error) {
      EmitError(ResponseFail(500, "删除订单出现异常"), ctx);
    }
  }
}

module.exports = OrderController;
