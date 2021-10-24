const { Controller, Post, Middlewares, Get } = require("../common/decorator");
const { ResponseSuccess, EmitError, ResponseFail } = require("../common/utils");
const { auth } = require("../middlewares/auth.middleware");
const { valideCartFormValue, verifyGoodsId } = require("../middlewares/cart.middleware");
const cartService = require("../service/cart.service");

@Controller("/carts")
class CartController {
  @Post()
  @Middlewares([auth, valideCartFormValue, verifyGoodsId])
  async add(ctx) {
    try {
      // 获取用户id和商品id
      const user_id = ctx.state.user.id;
      const goods_id = ctx.request.body.goods_id;
      // 操作数据库
      const res = await cartService.createOrUpdate(user_id, goods_id);
      ctx.body = ResponseSuccess("添加购物车成功");
    } catch (error) {
      EmitError(ResponseFail(500, "添加购物车出现异常"), ctx);
    }
  }

  @Get()
  @Middlewares([ auth ])
  async findByUser(ctx) {
    try {
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const userId = ctx.state.user.id;
      const res = await cartService.findByUserId(userId, pageNum, pageSize);
      ctx.body = ResponseSuccess('查询成功', res);
    } catch (error) {
      EmitError(ResponseFail(500, "查询出现异常"), ctx);
      
    }
  }
}

module.exports = CartController;
