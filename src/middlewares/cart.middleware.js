const { EmitError, ResponseFail } = require("../common/utils");
const GoodsModel = require("../model/goods.model");

/**
 * 校验商品id是否合法
 */
const verifyGoodsId = async (ctx, next) => {
  try {
    const goodsId = ctx.request.body.goods_id;
    const res = await GoodsModel.findByPk(goodsId);
    if (!res) {
      EmitError(ResponseFail(400, "暂无该商品或该商品未上架"), ctx);
      return;
    }
    await next();
  } catch (error) {
    EmitError(ResponseFail(500, "查询出现错误"), ctx);
  }
};

module.exports = {
  verifyGoodsId,
};
