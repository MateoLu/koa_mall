const {
  Controller,
  Post,
  Middlewares,
  Get,
  Patch,
  Delete,
} = require("../common/decorator");
const { ResponseSuccess, EmitError, ResponseFail } = require("../common/utils");
const { auth, verifyGoodsId, validator } = require("../middlewares");
const cartService = require("../service/cart.service");

/**
 * 购物车控制层
 */
@Controller("/carts")
class CartController {
  /**
   * 添加商品到购物车
   * @param {*} ctx
   */
  @Post()
  @Middlewares([
    auth,
    validator({
      goods_id: "number",
    }),
    verifyGoodsId,
  ])
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

  /**
   * 根据当前登陆的用户查询购物车数据
   * @param {*} ctx
   */
  @Get()
  @Middlewares([auth])
  async findByUser(ctx) {
    try {
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const userId = ctx.state.user.id;
      const res = await cartService.findByUserId(userId, pageNum, pageSize);
      ctx.body = ResponseSuccess("查询成功", res);
    } catch (error) {
      EmitError(ResponseFail(500, "查询出现异常"), ctx);
    }
  }

  /**
   * 更新购物车的状态
   */
  @Patch("/:id")
  @Middlewares([
    validator({
      number: { type: "number", required: false },
      selected: { type: "bool", required: false },
    }),
  ])
  async updateCart(ctx) {
    try {
      const { id } = ctx.request.params;
      const { selected, number } = ctx.request.body;
      if (selected == undefined && number == undefined) {
        EmitError(ResponseFail(400, "number和selected不能同时为空"), ctx);
        return;
      }
      const res = await cartService.updateCart({ id, selected, number });
      if (!res) {
        EmitError(ResponseFail(400, "购物车没有该商品"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("更新购物车成功", res);
    } catch (error) {
      EmitError(ResponseFail(500, "更新购物车时出现异常"), ctx);
    }
  }

  /**
   * 移除购物车商品数据
   * @param {*} ctx
   * @returns
   */
  @Delete()
  @Middlewares([auth, validator({ ids: { type: "array", required: true } })])
  async removeCart(ctx) {
    try {
      const { ids } = ctx.request.body;
      const res = await cartService.removeCart(ids);
      if (!res) {
        EmitError(ResponseFail(400, "删除购物车商品失败"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("删除购物车商品成功");
    } catch (error) {
      EmitError(ResponseFail(500, "删除购物车商品出现异常"), ctx);
    }
  }

  /**
   * 全选购物车商品
   * @param {*} ctx
   * @returns
   */
  @Post("/selectAll")
  @Middlewares([auth])
  async selectedAll(ctx) {
    try {
      const userId = ctx.state.user.id;
      const res = await cartService.selectAllCarts(userId, true);
      if (!res) {
        EmitError(ResponseFail(400, "全选商品失败"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("全选商品成功");
    } catch (error) {
      EmitError(ResponseFail(500, "全选商品出现异常"), ctx);
    }
  }

  /**
   * 全不选购物车商品
   * @param {*} ctx
   * @returns
   */
  @Post("/unselectAll")
  @Middlewares([auth])
  async unselectedAll(ctx) {
    try {
      const userId = ctx.state.user.id;
      const res = await cartService.selectAllCarts(userId, false);
      if (!res) {
        EmitError(ResponseFail(400, "全不选商品失败"), ctx);
        return;
      }
      ctx.body = ResponseSuccess("全不选商品成功");
    } catch (error) {
      EmitError(ResponseFail(500, "全不选商品出现异常"), ctx);
    }
  }
}

module.exports = CartController;
